const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");


// 会员卡挂失 24小时后自动解挂
router.post("/lost", (req, res) => {
  const num = req.body.num;
  let obj = {};
  (async function() {
    // 挂失
    await new Promise(function(open) {
      let sql = '';
      if(num.length === 11) {
        sql="update card_info set isLock = ? where mobile = ?";
      } else {
        sql="update card_info set isLock = ? where cardNum = ?";
      }
      pool.query(sql, [1, num], (err, result) => {
        if (err) throw err;
        // console.log(result);
        // console.log(result.changedRows);
        if(result.changedRows > 0) {
          obj.success = true;
          obj.message = '挂失成功';
        } else if(result.message.match(/matched: 1  Changed: 0/g)) {
          obj.success = false;
          obj.message = '该会员卡已挂失';
        } else {
          obj.success = false;
          obj.message = '会员卡号或手机号不存在';
        }
        open();
        res.send(obj);
      });
    });
    // 24小时后自动解挂
    await new Promise(function(open) {
      setTimeout(() => {
        let sql = '';
        if(num.length === 11) {
          sql="update card_info set isLock = ? where mobile = ?";
        } else {
          sql="update card_info set isLock = ? where cardNum = ?";
        }
        pool.query(sql, [0, num], (err, result) => {
          if (err) throw err;
          if (result.changedRows > 0) {
            obj.success = true;
          } else {
            obj.success = false;
          }
          open();
          // res.send(obj);
        });
      }, 1000*60*60);
    });
  })();
});

// 会员卡充值
router.post("/charge", (req, res) => {
  const num = req.body.num;
  const amount = req.body.amount;
  let obj = {};
  let sql = '';
  if(num.length === 11) {
    sql="update card_info set cardBalance = cardBalance + ? where mobile = ?";
  } else {
    sql="update card_info set cardBalance = cardBalance + ? where cardNum = ?";
  }
  pool.query(sql, [amount, num], (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log(result.changedRows);
    if(result.changedRows > 0) {
      obj.success = true;
      obj.message = '充值成功';
    } else {
      obj.success = false;
      obj.message = '会员卡号或手机号不存在';
    }
    res.send(obj);
  });
});

// 会员卡更换
router.post("/replace", (req, res) => {
  const oldCardNum = req.body.oldCardNum;
  const newCardNum = req.body.newCardNum;
  let obj = {};
  (async function() {
    // user_info
    await new Promise(function(open) {
      const sql="update user_info set cardNum = ? where cardNum = ?";
      pool.query(sql, [newCardNum, oldCardNum], (err, result) => {
        if (err) throw err;
        // console.log(result);
        // console.log(result.changedRows);
        if(result.changedRows > 0) {
          obj.success = true;
          obj.message = '挂失成功';
        } else if(result.message.match(/matched: 1  Changed: 0/g)) {
          obj.success = false;
          obj.message = '该会员卡已挂失';
        } else {
          obj.success = false;
          obj.message = '会员卡号或手机号不存在';
        }
        open();
      });
    });
    // card_info
    await new Promise(function(open) {
      const sql="update card_info set cardNum = ? where cardNum = ?";
      pool.query(sql, [newCardNum, oldCardNum], (err, result) => {
        if (err) throw err;
        if (result.changedRows > 0) {
          obj.success = true;
        } else {
          obj.success = false;
        }
        open();
        res.send(obj);
      });
    });
  })();
});

module.exports = router;
