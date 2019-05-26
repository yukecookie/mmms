const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");

// 消费积分查询
router.post("/consumption", (req, res) => {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    let params = [];
    (async function() {
        await new Promise(function(open) {
            let sql = "select * from consumption_score where 1 = 1 ";
            if (req.body.orderCode) {
                sql += "and orderCode = ? ";
                params.push(req.body.orderCode);
            }
            if (req.body.cardNum) {
                sql += "and cardNum = ? ";
                params.push(req.body.cardNum);
            }
            sql += "limit ?, ?";
            params.push(start, pageSize);
            pool.query(sql, params, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    obj.data = result;
                    obj.success = true;
                    obj.total = 1;
                } else {
                    obj.data = [];
                    obj.success = true;
                    obj.total = 0;
                }
                open();
                res.send(obj);
            });
        });
    })();
});

// 生日积分查询
router.post("/birth", (req, res) => {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    let params = [];
    (async function() {
        await new Promise(function(open) {
            let sql = "select * from birth_score where 1 = 1 ";
            if (req.body.userName) {
                sql += "and userName = ? ";
                params.push(req.body.userName);
            }
            if (req.body.cardNum) {
                sql += "and cardNum = ? ";
                params.push(req.body.cardNum);
            }
            sql += "limit ?, ?";
            params.push(start, pageSize);
            pool.query(sql, params, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    obj.data = result;
                    obj.success = true;
                    obj.total = 1;
                } else {
                    obj.data = [];
                    obj.success = true;
                    obj.total = 0;
                }
                open();
                res.send(obj);
            });
        });
    })();
});

// 积分消费
router.post("/score", (req, res) => {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    let params = [];
    (async function() {
        await new Promise(function(open) {
            let sql = "select * from consumption_info where 1 = 1 ";
            if (req.body.orderCode) {
                sql += "and orderCode = ? ";
                params.push(req.body.orderCode);
            }
            if (req.body.cardNum) {
                sql += "and cardNum = ? ";
                params.push(req.body.cardNum);
            }
            sql += "order by orderCreationDate DESC limit ?, ?";
            params.push(start, pageSize);
            pool.query(sql, params, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    obj.data = result;
                    obj.success = true;
                    obj.total = 1;
                } else {
                    obj.data = [];
                    obj.success = true;
                    obj.total = 0;
                }
                open();
                res.send(obj);
            });
        });
    })();
});


// 礼品管理
router.post("/gift", (req, res) => {
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    let params = [];
    (async function() {
        await new Promise(function(open) {
            let sql = "select * from gift_info where 1 = 1 ";
            if (req.body.productType) {
                sql += "and productType = ? ";
                params.push(req.body.productType);
            }
            if (req.body.productNum) {
                sql += "and productNum = ? ";
                params.push(req.body.productNum);
            }
            if (req.body.productName) {
                sql += "and productName = ? ";
                params.push(req.body.productName);
            }
            sql += "limit ?, ?";
            params.push(start, pageSize);
            pool.query(sql, params, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    obj.data = result;
                    obj.success = true;
                    obj.total = 1;
                } else {
                    obj.data = [];
                    obj.success = true;
                    obj.total = 0;
                }
                open();
                res.send(obj);
            });
        });
    })();
});

module.exports = router;
