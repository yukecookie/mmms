const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");
const ml = require('machine_learning');

// 消费信息查询
router.post("/info", (req, res) => {
  const orderCode = req.body.orderCode ? req.body.orderCode : '';
  const cardNum = req.body.cardNum ? req.body.cardNum: '';
  const amount = req.body.amount ? req.body.amount : '';
  const productType = req.body.productType ? req.body.productType : '';
  const orderCreationDateMin = req.body.orderCreationDateMin ? req.body.orderCreationDateMin: '';
  const orderCreationDateMax = req.body.orderCreationDateMax ? req.body.orderCreationDateMax : '';
  const page = req.body.page;
  const pageSize = req.body.pageSize;
  const start = (page-1)*pageSize;
  let obj = {};
  (async function() {
    await new Promise(function(open) {
      const sql = "select * from consumptionInfo where orderCode = ? and cardNum = ? and amount >= ? and productType = ? and (orderCreationDate between ? and ?) order by orderCreationDate DESC limit ?, ?";
      pool.query(sql, [orderCode, cardNum, amount, productType, orderCreationDateMin, orderCreationDateMax, start, pageSize], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          obj.data = result;
          obj.success = true;
          obj.total = 1;
        } else {
          obj.data = [];
          obj.success = true;
          obj.total = 0;
        }
        open();
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
        const sqlR="select datediff(now(), orderCreationDate) as day from consumptionInfo where cardNum=? order by orderCreationDate desc limit 1";
        pool.query(sqlR, [cardNum], (err, result) => {
          if (err) throw err;
          value.push(result[0].day);
          open();
        }); // R: 计算每个用户最近一次的消费时间距离今天是多少天
      });
      await new Promise(function(open) {
        const sqlF="select count(*) as count from consumptionInfo where cardNum=?";
        pool.query(sqlF, [cardNum], (err, result) => {
          if (err) throw err;
          value.push(result[0].count);
          open();
        }); // F: 计算该用户近三个月消费过多少次
      });
      await new Promise(function(open) {
        const sqlM="select sum(amount) as totalMoney from consumptionInfo where cardNum=?";
        pool.query(sqlM, [cardNum], (err, result) => {
          if (err) throw err;
          value.push(result[0].totalMoney);
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
              epochs: 85,
              distance: { type: 'euclidean' }
              // default : { type: 'euclidean' }
              // {type : 'pearson'}
              // Or you can use your own distance function
              // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
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
module.exports = router;
