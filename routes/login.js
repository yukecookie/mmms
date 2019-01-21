const express = require('express');
const { findUser } = require('../db/user');

//
var app = express();
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');//自定义中间件，设置跨域需要的响应头。
  next();
 };
 app.use(allowCrossDomain);//运用跨域的中间件
 app.use(bodyParser.text());//运用中间件，对请求体的文本进行解析
 //


const router = express.Router();

router.post('/node/loginnnnn', (req, res, next) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  findUser([userName, userPwd]).then((user) => {
    if(user.length) {
      req.session.user = userName;
      res.send({
        user_code: 200,
        message: '登录成功',
        user: req.body.userName
      })
    } else {
      req.session.user = userName;
      res.send({
        user_code: 500,
        message: '用户名或密码错误'
      })
    }
  })
});

module.exports = router;
