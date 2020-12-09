var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/db_config');
const conn =  mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});


router.post('/user', function(req, res, next){
  //1. 데이터를 다 받아온다
  let data = req.body;
  let email = data.emailId;
  let password = data.password;
  let username = data.name;

  // //2. DB저장
  conn.query(`INSERT INTO users(email, password, username) values(?, ?, ?)`, [email,password,username], function(err, rows, field){
    if(err) console.log(err);
    console.log(rows);
    //여기서 응답
    res.redirect('/');
  });
});

module.exports = router;
