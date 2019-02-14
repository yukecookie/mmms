const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");
//问：怎么改成application/json

// 登录
router.post("/server/api/login/account", (req, res) => {
  console.log(req);
  const username = req.body.userName;
  const password = req.body.password;
  (async function() {
    await new Promise(function(open) {
      const sql = "select * from user_info where username=? and password=?";
      pool.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        //设置响应头解决跨域
        // res.writeHead(200, {
        // "content-type": "application/x-www-form-urlencoded;charset=utf-8", // application/json   text/plain  application/x-www-form-urlencoded,multipart/form-data
        // "Access-Control-Allow-Origin": "*"
        // });
        if (result.length > 0) {
          console.log(123);
          //如果用户存在，将用户的id保存在session中
          req.session.username = result[0].username;
          if(username === 'admin') {
            result = {
              status: 'ok',
              type,
              currentAuthority: 'admin',
            }
          } else{
            result = {
              status: 'ok',
              type,
              currentAuthority: 'user',
            }
          }
          
          // obj.result = result[0];
          // res.write(
          //   JSON.stringify({
          //     result
          //   })
          // );
        } else {
          result = {
            failed: true,
            message: "登录失败"
          };
          // res.write(
          //   JSON.stringify({
          //     failed: true,
          //     message: "登录失败"
          //   })
          // );
        }
        open();
        // console.log(JSON.stringify({ obj }));
        // res.write(JSON.stringify({ obj }));
        // res.end();
        res.send(result);
      });
    });
  })();
});

//判断是否登录
router.post("/isLogin", (req, res) => {
  (async function() {
    await new Promise(function(open) {
      const sql = "select * from user_info where username=?";
      pool.query(
        sql,
        [req.session.username === undefined ? "" : req.session.username],
        (err, result) => {
          if (err) throw err;
          //如果没登录
          if (result.length === 0) {
            result = {
              failed: true,
              message: "no login"
            };
          } else {
            result = result[0];
          }
          open();
          res.send(result);
        }
      );
    });
  })();
});

//注销
router.post("/loginOut", (req, res) => {
  // res.writeHead(200);
  //将session中存储的用户id清空
  req.session.username = undefined;
  if (req.session.username === undefined) {
    res.send("1");
  } else {
    res.send("注销失败");
  }
});

//注册
router.post("/register", (req, res) => {
  let obj = req.body;
  const sql = "insert into user_info values(null,?,?,?,?,?,?,?)";
  pool.query(
    sql,
    [
      obj.username,
      obj.password,
      obj.mobile,
      obj.name,
      obj.sex,
      obj.email,
      obj.qq
    ],
    (err, result) => {
      if (err) throw err;
      // res.writeHead(200, {
      // "content-type": "text/plain;charset=utf-8",
      // "Access-Control-Allow-Origin": "*"
      // });
      console.log(result);
      // res.write(1);
      //1成功 2验证码错
      if (result.insertId !== "") {
        res.send("1");
      } else {
        res.send("2");
      }
    }
  );
});

//验证用户名是否存在
router.post("/checkName", (req, res) => {
  check(
    "select * from user_info where username=?",
    req.body.username,
    "用户名",
    res
  );
});
//验证手机号是否存在
router.post("/checkMobile", (req, res) => {
  check(
    "select * from user_info where mobile=?",
    req.body.mobile,
    "手机号",
    res
  );
});
//验证函数
function check(sql, params, name, res) {
  return pool.query(sql, [params], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send("0");
    } //不存在
    else {
      res.send("1");
    } //已存在
  });
}

// 发送验证码
router.post("/sentCode", (req, res) => {
  // const mobile = req.body.mobile;
  let t = "";
  for (let i = 0; i < 6; i++) {
    t += Math.floor(Math.random() * 10);
  }
  res.send(t); // 假装发了一条短信
});

// 读取博客
router.post("/getBlogs", (req, res) => {
  (async function() {
    await new Promise(function(open) {
      const sql = "select * from user_blog where username=?";
      pool.query(sql, [req.body.username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          // console.log(result);
        } else {
          result = {
            empty: true,
            message: "no blog"
          };
        }
        open();
        res.send(result);
      });
    });
  })();
});

module.exports = router;
