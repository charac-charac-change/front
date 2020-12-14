var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
var multer = require("multer");
const fs = require("fs");
const url = require('url');
const querystring = require('querystring')

var startRouter = require('./routes/start');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var mainRouter = require('./routes/index');
var db = require('./routes/dbTest');
const mysql = require('mysql');
const dbconfig = require('./config/db_config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const conn = mysql.createConnection(dbconfig);

app.use('/', startRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/main', mainRouter);
app.use('/', db);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   console.log('here');
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const upload = multer({
  dest: "D:/project/front/files"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post("/upload"  ,
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    console.log(req.body);
    const tempPath = req.file.path;
    if (true) {
      var formData = {
        "file": fs.createReadStream(tempPath)
      };
        
      request.post({url:'http://10.120.72.244:5000/remove', formData: formData,headers:{"Content-Type": "multipart/form-data"}}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
        //console.log('Upload successful!  Server responded with:', body);
        console.log(body)
        var base64Data = body.replace(/^data:image\/png;base64,/, "");
        var bufferValue = Buffer.from(base64Data,"base64");
        var now = new Date();

        conn.query(`INSERT INTO image(email, image, created) values(?, ?, ?)`, [req.cookies.email,bufferValue,now], function(err, rows, field){
          if(err) console.log(err);
          //console.log('1');
          //여기서 응답
          //res.redirect('/result');
        });

         fs.writeFile("out.png", base64Data, 'base64', function(err) {
           console.log("fs.writeFile_error "+err);
         });
        res.redirect('/result')
      });

    } 
  }
);

app.get("/Background",(req,res) =>{
  var parsedUrl = url.parse(req.url);
  var qs = querystring.parse(parsedUrl.query);
  
  const options = {
    uri : 'http://127.0.0.1:5000/select',
    method : 'POST',
    form : {
      "file": fs.createReadStream('./out.png'),
      "data": qs.select,
    },
    headers:{"Content-Type": "multipart/form-data"}
  };

  request.post(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
        //console.log('Upload successful!  Server responded with:', body);
        console.log(body)
        var base64Data = body.replace(/^data:image\/png;base64,/, "");
        fs.writeFile("out.png", base64Data, 'base64', function(err) {
          console.log("fs.writeFile_error "+err);
        });
        //res.redirect('/result')
      });
  console.log("selected"+qs.select);
});

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

app.get("/image", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/loading.jpg"));
});

app.get("/result", (req, res) => {
  res.sendFile(path.join(__dirname, "./out.png"));
});
module.exports = app;
