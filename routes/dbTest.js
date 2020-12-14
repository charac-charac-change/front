var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const dbconfig = require('../config/db_config');
var toBuffer = require('blob-to-buffer')

const conn =  mysql.createConnection(dbconfig);

router.get('/dbTest', function(req, res){
    conn.query('select image from image', function(err, rows, feild){
        if(err) console.log(err);
        fs.writeFile('test.jpg', rows[0].image, function(err,written){
            if(err) console.log(err);
             else {
              console.log("Successfully written");
             }
         });
        
        res.send(rows);
    });
});

module.exports = router;