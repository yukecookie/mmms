const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//引入cors模块解决跨域
const cors=require("cors")
const logger = require('morgan');
//加载模板处理模块
const swig=require("swig")
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const consumptionRouter = require('./routes/consumption');

const app = express();
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:8008");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// app.use(cors({
//   origin:'http://localhost:8001',
//   methods:['GET','POST'],
//   allowedHeaders:['Content-Type', 'Authorization'],
//   // credentials:true
// }));
const bodyParse=require("body-parser")
//引入session
const session=require('express-session')
//配置bodyParser中间件
app.use(bodyParse.urlencoded({extended:false}))
//配置session
app.use(session({
  secret:"128位随机字符串", // secret :  'secret', // 对session id 相关的cookie 进行签名
  resave:false,
  saveUninitialized:true
}))

// 配置应用模板
// 第一个参数:模板引擎的名称，同时也是模板文件的后缀
// 第二个参数：用于解析处理模板内容的方法
app.engine('html',swig.renderFile)
// view engine setup
// app.set('view engine', 'ejs');
// app.set('view engine', 'jade');
// app.set('view engine','html')
app.set('views', path.join(__dirname, 'views'));

//配置bodyParser中间件
app.use(bodyParse.urlencoded({extended:false}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './assets/build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/consumption', consumptionRouter);

app.use((req,res)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
