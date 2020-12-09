var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/db_config');

const conn =  mysql.createConnection(dbconfig);

router.get('/dbTest', function(req, res){
    conn.query('select * from users', function(err, rows, feild){
        if(err) console.log(err);

        res.send(rows);
    });
});

module.exports = router;