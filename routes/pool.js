const mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yukecookie',
  database: 'j2ee',
  connectionLimit: 10 
});
//把创建好的连接池导出
module.exports = pool;