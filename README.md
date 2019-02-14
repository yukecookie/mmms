---
title: node-web
date: 2019-02-01
tag: node.js express React webpack ant-design-pro
version: 1.0.0
---

node-web
===

### 项目目录结构

```js
├── README.md                    # 项目说明文档
├── app.js
├── assets
│   ├── mock                     # 本地模拟数据
│   ├── public                   # 存放公共资源
│   ├── src
│   │   ├── assets               # 本地静态资源
│   │   ├── common               # 导航信息和路由的配置
│   │   ├── components           # 通用组件的封装，如表格、表单
│   │   ├── e2e                  # 集成测试用例
│   │   ├── layouts              # 通用布局，整个网站的共用导航栏，页脚和主体部分
│   │   ├── models               # dva model
│   │   ├── routes               # 浏览器中所看到的页面
│   │   ├── services             # 后台接口服务
│   │   ├── utils                # 工具库
│   │   ├── g2.js                # 可视化图形配置
│   │   ├── theme.js             # 主题配置
│   │   ├── index.ejs            # HTML 入口模板，相当于index.html
│   │   ├── index.js             # 应用入口
│   │   ├── index.less           # 全局样式
│   │   └── router.js            # 路由入口
│   ├── package.json             # 项目package.json 配置文件
│   ├── tests                    # 测试工具
│   ├── README.md 
│   └── yarn.lock                # yarn node_modules管理 依赖 配置文件
├── bin
│   └── www                      # express 服务启动/配置文件
|—— docs                         # 项目文档说明 markdown格式
├── package.json                 # 项目package.json 配置文件
├── public                       # 公共资源目录
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes                       # express服务路由目录
│   ├── index.js
│   └── users.js
├── views                        # express视图模块 目录
│   ├── error.ejs
│   └── index.ejs
└── yarn.lock                    # yarn node_modules管理 依赖 配置文件
```

### 项目搭建

#### 开发工具

 * Visual Studio Code

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
http://localhost:8008/
```

#### 项目说明

本项目主要包括基于react的前端部分和基于`Express` `node.js` `web`服务框架的服务端部分,本项目相对原始和基础,使用`ant-design-pro`和`express cli`脚手架搭建,相关技术可参考如下地址:

 * `Express` 官网: http://expressjs.com/
 * `Express` 中文文档: http://www.expressjs.com.cn/ or http://www.expressjs.com.cn/4x/api.html

 * `ant design` 官网: https://ant.design/ or https://github.com/ant-design/ant-design-pro
 * `webpack` 官网: https://webpack.js.org/
