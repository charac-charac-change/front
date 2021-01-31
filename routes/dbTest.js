var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const fs = require("fs");
const dbconfig = require("../config/db_config");
const { timeStamp } = require("console");

router.use(express.static("public"));

const conn = mysql.createConnection(dbconfig);

var username;

router.get("/dbTest", function (req, res) {
  conn.query(
    `select t.image, t.username from (select image_2.image,users.username,image_2.created from image_2,users,linked_user_image where linked_user_image.image_id = image_2.image_id and linked_user_image.email = users.email) t where t.username = "${req.cookies.name}" ORDER BY t.created DESC;`,
    //"select u.username, i.image, i.created from image as i , users as u where i.email = u.email ORDER BY created DESC;",
    function (err, rows, feild) {
      if (err) console.log(err);
      //console.log(row[0])
      console.log(rows[0]);
      username = rows[0].username;
      fs.writeFile("public/images/test.jpg", rows[0].image, function (err, written) {
        if (err) console.log(err);
        else {
          console.log("Successfully written");
        }
      });

      res.redirect("/get_image");
    }
  );
});

router.get("/get_image", (req, res) => {
  console.log(username);
  res.render("get_image", { title: username });
});

router.get("/down", (req,res) => {
  res.setHeader('Content-disposition', 'attachment; filename=' + "test.jpg"); // 다운받아질 파일명 설정
  res.setHeader('Content-type', "image/jpeg"); // 파일 형식 지정
  var filestream = fs.createReadStream("public/images/test.jpg");
  filestream.pipe(res);
});

module.exports = router;
