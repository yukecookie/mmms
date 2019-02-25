export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // 首页
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Dashboard',
      },
      // 会员信息管理
      {
        path: '/info',
        icon: 'form',
        name: 'info',
        authority: ['admin'],
        routes: [
          {
            path: '/info/add-user',
            name: 'add',
            component: './UserInfo/UserInfoAdd',
          },
          {
            path: '/info/update-user',
            name: 'update',
            component: './UserInfo',
          },
          {
            path: '/info/del-user',
            name: 'del',
            component: './UserInfo',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      // 会员卡管理
      {
        path: '/card',
        name: 'card',
        icon: 'credit-card',
        authority: ['admin'],
        routes: [
          {
            path: '/card/replace',
            name: 'replace',
            component: './UserCard/CardReplace',
          },
          {
            path: '/card/charge',
            name: 'charge',
            component: './UserCard/CardCharge',
          },
          {
            path: '/card/lost',
            name: 'lost',
            component: './UserCard/CardLost',
          },
          {
            path: '/card/lock',
            name: 'lock',
            component: './UserCard/CardLock',
          },
        ],
      },
      // 会员消费管理
      {
        name: 'consumption',
        icon: 'money-collect',
        path: '/consumption',
        authority: ['admin'],
        routes: [
          {
            path: '/consumption/add',
            name: 'add',
            component: './Result/Success',
          },
          {
            path: '/consumption/refund',
            name: 'refund',
            component: './Result/Error',
          },
        ],
      },
      // 积分兑换管理
      {
        name: 'score',
        icon: 'inbox',
        path: '/score',
        authority: ['admin'],
        routes: [
          {
            path: '/score/birth',
            name: 'birth',
            component: './Exception/403',
          },
          {
            path: '/score/consumption',
            name: 'consumption',
            component: './Exception/404',
          },
          {
            path: '/score/gift-exchange',
            name: 'gift-exchange',
            component: './Exception/500',
          },
          {
            path: '/score/gift-manage',
            name: 'gift-manage',
            // hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      // 短信管理
      {
        name: 'message',
        icon: 'message',
        path: '/message',
        authority: ['admin'],
        routes: [
          {
            path: '/message/activation',
            name: 'activation',
            component: './Account/Center/Center',
          },
          {
            path: '/message/pay',
            name: 'pay',
            component: './Account/Settings/Info',
          },
          {
            path: '/message/recharge',
            name: 'recharge',
            component: './Account/Center/Center',
          },
          {
            path: '/message/exchange',
            name: 'exchange',
            component: './Account/Settings/Info',
          },
          {
            path: '/message/birth',
            name: 'birth',
            component: './Account/Center/Center',
          },
          {
            path: '/message/refund',
            name: 'refund',
            component: './Account/Settings/Info',
          },
        ],
      },
      // 个人中心
      {
        name: 'personal',
        icon: 'user',
        path: '/personal',
        authority: ['user'],
        routes: [
          {
            path: '/personal/info-update',
            name: 'info-update',
            component: './Result/Success',
          },
          {
            path: '/personal/gift',
            name: 'gift',
            component: './Result/Error',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
