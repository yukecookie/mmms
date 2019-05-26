const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");
const ml = require('machine_learning');

// 消费信息查询
router.post("/info", (req, res) => {
  const page = req.body.page;
  const pageSize = req.body.pageSize;
  const start = (page-1)*pageSize;
  let obj = {};
  let params = [];
  let paramsTotal = [];
  (async function() {
    // 计算总数据
    await new Promise(function(open) {
      let sqlTotal = "select count(*) as total from consumption_info where 1 = 1 ";
      if (req.body.orderCode) {
        sqlTotal += "and orderCode = ? ";
        paramsTotal.push(req.body.orderCode);
      }
      if (req.body.cardNum) {
        sqlTotal += "and cardNum = ? ";
        paramsTotal.push(req.body.cardNum);
      }
      if (req.body.amount) {
        sqlTotal += "and amount < ? ";
        paramsTotal.push(req.body.amount);
      }
      // if (req.body.productType) {
      //   sqlTotal += "and productType = ? ";
      //   paramsTotal.push(req.body.productType);
      // }
      if (req.body.orderCreationDateMin) {
        sqlTotal += "and (orderCreationDate between ? and ?) ";
        paramsTotal.push(new Date(req.body.orderCreationDateMin), new Date(req.body.orderCreationDateMax));
      }
      pool.query(sqlTotal, paramsTotal, (err, result) => {
        if (err) throw err;
        if(result[0].total>0) {
          obj.total = result[0].total
        } else {
          obj.total = 0;
        }
        open();
      });
    });
    // 查询
    await new Promise(function(open) {
      let sql = "select * from consumption_info where 1 = 1 ";
      if (req.body.orderCode) {
        sql += "and orderCode = ? ";
        params.push(req.body.orderCode);
      }
      if (req.body.cardNum) {
        sql += "and cardNum = ? ";
        params.push(req.body.cardNum);
      }
      if (req.body.amount) {
        sql += "and amount < ? ";
        params.push(req.body.amount);
      }
      // if (req.body.productType) {
      //   sql += "and productType = ? ";
      //   params.push(req.body.productType);
      // }
      if (req.body.orderCreationDateMin) {
        sql += "and (orderCreationDate between ? and ?) ";
        params.push(new Date(req.body.orderCreationDateMin), new Date(req.body.orderCreationDateMax));
      }
      sql += "order by orderCreationDate DESC limit ?, ?";
      params.push(start, pageSize);
      pool.query(sql, params, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          result.forEach((item) => {
            item.orderCreationDate = item.orderCreationDate.toLocaleString();
          });
          obj.data = result;
          obj.success = true;
        } else {
          obj.data = [];
          obj.success = true;
        }
        open();
        res.send(obj);
      });
    });
  })();
});

// 消费信息添加
router.post("/add", (req, res) => {
  let amount = parseInt(req.body.amount);
  let credit = 0;
  let obj = {};
  let consumptionParams = [req.body.orderCode, req.body.cardNum, parseInt(req.body.productType), new Date(req.body.orderCreationDate)];
  let scoreParams = [req.body.orderCode, req.body.cardNum];  
  let cardParams = [];  
  (async function() {
    // 流程：先查出card_info表中该会员卡有多少积分，把积分换算成钱，100积分1元，再计算消费金额，100消费金额对应1个积分
    if(req.body.isOnSale === 'true') {
      amount = amount * req.body.discount;
    }
    if(req.body.isScore === 'true') {
      await new Promise((resolve, reject) => {
        let cardSql = "select vipCredit from card_info where cardNum = ?";
        pool.query(cardSql, req.body.cardNum, (err, result) => {
          if (err) reject(err);
          if (result[0].vipCredit) {
            if(result[0].vipCredit / 100 > amount) {
              amount = 0;
              credit = amount * 100;
            } else {
              amount = amount - result[0].vipCredit / 100;
              credit = result[0].vipCredit;
            }
          }
          resolve();
        });
      });
    }
    // 判断卡余额是否大于消费金额
    await new Promise((resolve, reject) => {
      let cardAmountSql = "select cardBalance from card_info where cardNum = ?";
      pool.query(cardAmountSql, [req.body.cardNum], (err, result) => {
        if (err) reject(err);
        if (result[0].cardBalance > amount) {
          obj.success = true;
          // obj.message = '添加成功';
        } else {
          obj.success = false;
          obj.message = '会员卡余额不足';
        }
        resolve();
      });
    });
    // 插入 consumption_info 设置外键 先插入consumption_info
    await new Promise((resolve, reject) => {
      consumptionParams.push(amount, credit);
      scoreParams.push(amount, parseInt(amount / 100));
      cardParams.push(amount, amount, parseInt(amount / 100) - credit, req.body.cardNum);
      let consumptionSql = "insert into consumption_info set orderCode = ?, cardNum = ?, productType = ?, orderCreationDate = ?, amount = ?, credit = ? ";
      pool.query(consumptionSql, consumptionParams, (err, result) => {
        if (err) reject(err);
        if (result.affectedRows > 0) {
          obj.success = true && obj.success;
        } else {
          obj.success = false;
        }
        resolve();
      });
    });
    // 插入consumption_score 并更新card_info表
    await new Promise((resolve, reject) => {
      let scoreSql = "insert into consumption_score set orderCode = ?, cardNum = ?, amount = ?, givenScore = ?";
      pool.query(scoreSql, scoreParams, (err, result) => {
        if (err) reject(err);
        if (result.affectedRows > 0) {
          obj.success = true && obj.success;
        } else {
          obj.success = false;
        }
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      let cardSql = "update card_info set vipAmount = vipAmount + ?, cardBalance = cardBalance - ?, vipCredit = vipCredit + ? where cardNum = ?";
      pool.query(cardSql, cardParams, (err, result) => {
        if (err) reject(err);
        console.log(result);
        if (result.changedRows > 0) {
          obj.success = true && obj.success;
        } else {
          obj.success = false;
        }
        resolve();
        if (obj.success === true) {
          obj.message = '添加成功';
        } else if (obj.message !== '会员卡余额不足') {
          obj.message = '添加失败';
        }
        res.send(obj);
      });
    });
  })();
});

// RFM
router.post("/queryTag", (req, res) => {
  const cardNums = req.body.cardNums ? req.body.cardNums : [];
//   const cardNums = ['10000001', '10000002', '10000003', '10000004', '10000005', '10000006', '10000007', '10000008'];
  let data = [];
  cardNums.map((cardNum, index) => {
    let value = [];
    // value.push(cardNum);
    (async function() {
      await new Promise(function(open) {
        // 遍历每一个用户 在所有消费信息中查找 R F M 并放到二维数组中
        const sqlR="select datediff(now(), orderCreationDate) as day from consumption_info where cardNum=? order by orderCreationDate desc limit 1";
        pool.query(sqlR, [cardNum], (err, result) => {
          if (err) throw err;
          if(result[0].day>30) {
              value.push(0);
          } else {
              value.push(1);
          }
        //   value.push(result[0].day);
          open();
        }); // R: 计算每个用户最近一次的消费时间距离今天是多少天
      });
      await new Promise(function(open) {
        const sqlF="select count(*) as count from consumption_info where cardNum=?";
        pool.query(sqlF, [cardNum], (err, result) => {
          if (err) throw err;
          if(result[0].count<3) {
            value.push(0);
          } else {
            value.push(1);
          }
        //   value.push(result[0].count);
          open();
        }); // F: 计算该用户近三个月消费过多少次
      });
      await new Promise(function(open) {
        const sqlM="select sum(amount) as totalMoney from consumption_info where cardNum=?";
        pool.query(sqlM, [cardNum], (err, result) => {
          if (err) throw err;
          if(result[0].totalMoney<200) {
            value.push(0);
          } else {
            value.push(1);
          }
        //   value.push(result[0].totalMoney);
          data.push(value);
          open();
        }); // M: 计算该用户近三个月消费总金额
        return value;
      });
      await new Promise(function(open) {
        if(index === cardNums.length - 1) {
            console.log(data);
            const result = ml.kmeans.cluster({
              data: data,
              k: 8,
              epochs: 20,
              distance: { type: 'euclidean' }
            });
            console.log(result);
            res.send(result.means);
            // console.log(`clusters: ${result.clusters}`);
            // console.log(`means: ${result.means}`);
        }
        open();
      });
    })();
  });

  // MM: 计算(本商场近三个月所有的消费总额)/(近三个月的用户数量)  平均消费总金额
  // if ((当前时间 - R) <= 90天 && F >=3 && M >= 2 * MM)                tag = '重要价值客户'
  // else if ((当前时间 - R) <= 90天 && F >=3 && M <= 2 * MM)           tag = '一般价值客户'
  // else if ((当前时间 - R) >= 90天 && F >=3 && M >= 2 * MM)           tag = '重要保持客户'
  // else if ((当前时间 - R) >= 90天 && F >=3 && M <= 2 * MM)           tag = '一般保持客户'
  // else if ((当前时间 - R) <= 90天 && F <=3 && M >= 2 * MM)           tag = '重要发展客户'
  // else if ((当前时间 - R) <= 90天 && F <=3 && M <= 2 * MM)           tag = '一般发展客户'
  // else if ((当前时间 - R) >= 90天 && F <=3 && M >= 2 * MM)           tag = '重要挽留客户'
  // else 即 else if ((当前时间 - R) >= 90天 && F <=3 && M <= 2 * MM)   tag = '一般挽留客户'
  // return tag
  // 根据tag发送不同类型的促销信息

});

// 消费退款
router.post("/refund", (req, res) => {
  const sql = "delete from consumption_info where orderCode = ?";
  let obj = {};
  pool.query(sql, [req.body.orderCode], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      obj.success = true;
      obj.message = '删除成功';
    } else {
      obj.success = false;
      obj.message = '删除失败';
    }
    res.send(obj);
  });
});

module.exports = router;
