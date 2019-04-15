const express = require("express");
const router = express.Router();
//引入数据库连接模块
const pool = require("./pool");

// 消费积分查询
router.post("/consumption", (req, res) => {
    const orderCode = req.body.orderCode ? req.body.orderCode : '';
    const cardNum = req.body.cardNum ? req.body.cardNum: '';
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    (async function() {
        await new Promise(function(open) {
            const sql = "select * from consumption_score where orderCode = ? and cardNum = ? limit ?, ?";
            pool.query(sql, [orderCode, cardNum, start, pageSize], (err, result) => {
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
    const userName = req.body.userName ? req.body.userName : '';
    const cardNum = req.body.cardNum ? req.body.cardNum: '';
    const page = req.body.page;
    const pageSize = req.body.pageSize;
    const start = (page-1) * pageSize;
    let obj = {};
    (async function() {
        await new Promise(function(open) {
            const sql = "select * from birthScore where userName = ? and cardNum = ? limit ?, ?";
            pool.query(sql, [userName, cardNum, start, pageSize], (err, result) => {
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
