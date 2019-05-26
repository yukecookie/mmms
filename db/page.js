const mysql = require('mysql');

const pool  = mysql.createPool( {
  host: 'localhost',
  user: 'root',
  password: 'yukecookie',
  port: '3306',
  database: 'j2ee',
} );

let addUser = (params) => {
  return Promise((resolve, reject) => {
    pool.getConnection((err, cnt) => {
      if(err) {
        return reject(err);
      }
      const sql = 'select * from article';
      cnt.query(sql, params, (error, res) => {
        cnt.release();
        if(error) {
          return reject(error);
        }
        return resolve(res);
      })
    })
  })
}

module.exports = addUser;