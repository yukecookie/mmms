---
title: node-web
date: 2018-06-01
tag: node.js express React webpack create-react-app
version: 1.0.0
---

node-web
===

## node.js/webpack练习作业

### 项目目录结构

```js
.
├── README.md // 项目说明文档
├── app.js
├── assets
│   ├── README.md // 项目说明文档
│   ├── build // 静态资源生成目录
│   ├── config // webpack配置目录
│   │   ├── env.js // 环境变量配置
│   │   ├── jest // jest单元测试工具
│   │   ├── paths.js
│   │   ├── webpack.config.dev.js // webpack开发模式配置文件
│   │   ├── webpack.config.prod.js // webpack生产环境配置文件
│   │   └── webpackDevServer.config.js // webpack 开发环境服务器配置文件
│   ├── package.json // 项目package.json配置文件
│   ├── public // 公共资源目录
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── scripts // webpack编译/运行/测试命令配置文件
│   │   ├── build.js
│   │   ├── start.js
│   │   └── test.js
│   ├── src // 静态资源开发目录
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   └── serviceWorker.js
│   └── yarn.lock // yarn node_modules管理依赖配置文件
├── bin
│   └── www // express 服务启动/配置文件
|—— docs // 项目文档说明(markdown格式)
├── package.json // 项目package.json配置文件
├── public // 公共资源目录
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes // express服务路由目录
│   ├── index.js
│   └── users.js
├── views // express视图模块目录
│   ├── error.ejs
│   └── index.ejs
└── yarn.lock // yarn node_modules管理依赖配置文件
```

### 项目搭建

#### 开发工具

 * 推荐使用Visual Studio Code打开本项目

 * node.js: v10.x+

 * 其他工具: yarn

#### 项目启动

```
$ npm install yarn -g
$ cd node-web
$ yarn && cd assets && yarn
$ yarn start
```

或者

```
$ npm run init
$ npm run build-page
$ npm start
```

项目启动成功后,在浏览器访问如下地址即可
```
http://localhost:3000/
```

#### 项目说明

本项目主要包括基于react的前端部分和基于`Express` `node.js` `web`服务框架的服务端部分,本项目相对原始和基础,使用`create-react-app`和`express cli`脚手架搭建,相关技术可参考如下地址:

 * `Express` 官网: http://expressjs.com/
 * `Express` 中文文档: http://www.expressjs.com.cn/ or http://www.expressjs.com.cn/4x/api.html

 * `create-react-app` 官网: https://facebook.github.io/create-react-app/ or https://github.com/facebook/create-react-app
 * `webpack` 官网: https://webpack.js.org/

### 练习要求

1. 在node.js/webpack课程培训期间完成

2. 仔细阅读README.md说明文档, 并在项目根目录下编写自己的课题(项目)设计`/node-web/README.md`

3. 理解本项目结构,综合运用所学到的node.js/webpack知识完成本练习作业,课题内容不限(例如:个人网站/博客等)

4. 每天在`/node-web/docs`目录下登记工作日志/练习心得/未解决的问题/实现目标等,注: 需要提交rdc gitlab

5. 作业检查: node.js/webpack课程培训最后一天进行作业检查,检查项目如上所述,包括代码review;需要讲解演示自己的练习项目