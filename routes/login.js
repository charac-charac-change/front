var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const dbconfig = require("../config/db_config");
const conn = mysql.createConnection(dbconfig);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/user", function (req, res, next) {
  //1. 데이터를 다 받아온다
  let data = req.body;
  let email = data.emailId;
  let password = data.password;

  // //2. DB저장
  conn.query(
    `select * from change_db.users where email = "${email}";`,
    function (err, rows, field) {
      if (err) console.log(err);
      if (rows[0].email == email) {
        if (rows[0].password == password) {
          res.redirect("/main");
        } else {
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
      }
    }
  );
});

module.exports = router;
