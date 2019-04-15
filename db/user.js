const mysql = require('mysql');

const pool  = mysql.createPool( {
  host: 'localhost',
  user: 'yukecookie',
  password: '1519',
  port: '3306',
  database: 'j2ee',
});

let addUser = (params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, cnt) => {
      if(err) {
        return reject(err);
      }
      const sql = 'insert into user_info(userName, password,mobile,name,sex,email,qq) values(?, ?,?,?,?,?,?)';
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
let findUser = (params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, cnt) => {
      if(err) {
        return reject(err);
      }
      let sql = 'select * from user_info where userName = ?';
      if(params.length > 1) {
        sql += ' and password = ?';
      }
      cnt.query(sql, params, (error, res) => {
        cnt.release();
        if(!error) {
          return resolve(res);
        }
        return reject(error);
      })
    })
  })
}

module.exports = {
  addUser,
  findUser
};
