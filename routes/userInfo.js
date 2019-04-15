const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");

// 下个会员的id
router.get("/getId", (req, res) => {
  const sql = "select id from user_info order by id DESC limit 1";
  pool.query(sql, [], (err, result) => {
    if (err) throw err;
    if (result[0].id) {
      res.send({ id: result[0].id });
    } else {
      res.send({ id: 0 });
    }
  });
});

// 会员信息查询
router.post("/info", (req, res) => {
  const page = req.body.page ? parseInt(req.body.page) : 1;
  const pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
  const start = (page-1) * pageSize;
  let obj = {};
  let params =[];
  (async function() {
    // 计算总数据
    await new Promise(function(open) {
      const sqlTotal="select count(*) as total from user_info as a, card_info as b where a.cardNum = b.cardNum ";
      pool.query(sqlTotal, [], (err, result) => {
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
      let sql = "select b.cardNum, cardActiveDate, vipAmount, cardBalance, vipCredit from user_info as a, card_info as b where a.cardNum = b.cardNum ";
      if (req.body.cardNum) {
        sql += "and b.cardNum = ? ";
        params.push(req.body.cardNum);
      }
      if (req.body.mobile) {
        sql += "and mobile = ? ";
        params.push(req.body.mobile);
      }
      sql += "order by a.lastUpdateDate DESC limit ?, ?";
      params.push(start, pageSize);
      pool.query(sql, params, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          result.forEach((item) => {
            item.cardActiveDate = item.cardActiveDate.toLocaleString();
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

// 会员信息添加 不仅要添加会员信息 还要添加会员卡信息
router.post("/add", (req, res) => {
  // 会员卡号 用户名userName password 会员姓名name 手机号码mobile 性别sex （邮箱email）    会员卡号 消费总额vipAmount 累计积分vipCredit 卡余额cardBalance 开卡时间cardActiveDate
  const cardNum = req.body.cardNum;
  const userName = req.body.userName;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const sex = req.body.sex === 'true' ? 0 : 1;
  const now = new Date();
  let obj = {};
  let userParams = [userName, '123456', name, mobile, sex, cardNum, now];
  let cardParams = [cardNum, mobile, 0, 0, 0, now];
  (async function() {
    // 插入card_info 设置外键 先插入card_info
    await new Promise((resolve, reject) => {
      let cardSql = "insert into card_info set cardNum = ?, mobile = ?, vipAmount = ?, vipCredit = ?, cardBalance = ?, cardActiveDate = ?";
      pool.query(cardSql, cardParams, (err, result) => {
        console.log(cardSql);
        if (err) reject(err);
        if (result > 0) {
          obj.success = true;
          obj.message = '添加成功';
        } else {
          obj.success = false;
          obj.message = '添加失败';
        }
        resolve();
        res.send(obj);
      });
    });
    // 插入user_info
    await new Promise((resolve, reject) => {
      let userSql = "insert into user_info set userName = ?, password = ?, name = ?, mobile = ?, sex = ?, cardNum = ?, lastUpdateDate = ?";
      if (req.body.birth) {
        userSql += ", birth = ? ";
        userParams.push(req.body.birth);
      }
      if (req.body.email) {
        userSql += ", email = ?";
        userParams.push(req.body.email);
      }
      pool.query(userSql, userParams, (err, result) => {
        console.log(userSql);
        if (err) reject(err);
        if (result > 0) {
          obj.success = true;
          obj.message = '添加成功';
        } else {
          obj.success = false;
          obj.message = '添加失败';
        }
        resolve();
      });
    });
  })();
});

//验证用户名是否存在
router.post("/userNameVerify", (req, res) => {
  check(
    "select userName from user_info where userName = ?",
    req.body.userName,
    "用户名",
    res
  );
});
//验证手机号是否存在
router.post("/mobileVerify", (req, res) => {
  check(
    "select mobile from user_info where mobile = ?",
    req.body.mobile,
    "手机号",
    res
  );
});

//验证函数
function check(sql, params, name, res) {
  let obj = {};
  return pool.query(sql, [params], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      obj.isExistence = true;
    } else {
      obj.isExistence = false;
    }
    res.send(obj);
  });
}

// // 手机号码是否已存在
// router.post("/mobileVerify", (req, res) => {
//   const mobile = req.body.mobile;
//   let obj = {};
//   const sql="select mobile from user_info where mobile = ? ";
//   pool.query(sql, [mobile], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     if(result.length > 0) {
//       obj.isExistence = true;
//     } else {
//       obj.isExistence = false;
//     }
//     res.send(obj);
//   });
// });

module.exports = router;
