var express = require("express");
var router = express.Router();


const pool = require("./pool");
var obj = {};
router.get("/a", (req, res) => {
  (async function() {
    await new Promise(function(open) {
      var sql = "SELECT * FROM user_info WHERE id=1";
      pool.query(sql, [], (err, result) => {
        if (err) throw err;
        obj.small = result[0];

        open();
      });
    });
    res.send(obj);
  })();
});



module.exports = router;
