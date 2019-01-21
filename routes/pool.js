const mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'yukecookie',
  password: '1519',
  database: 'j2ee',
  connectionLimit: 10 
});
//把创建好的连接池导出
module.exports = pool;