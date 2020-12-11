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
var mainRouter = require('./routes/main');
var db = require('./routes/dbTest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', startRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/main', mainRouter);
app.use('/', db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
  dest: "/path/to/temporary/directory/to/store/uploaded/files"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post("/upload"  ,
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.jpg");
    //path.extname(req.file.originalname).toLowerCase() === ".jpg"
    if (true) {
      // fs.rename(tempPath, targetPath, err => {
      //   if (err) return handleError(err, res);
      //   res
      //     .status(200)
      //     .contentType("text/plain")
      //     .end("File uploaded!");
      // });
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
        fs.writeFile("out.png", base64Data, 'base64', function(err) {
          console.log("fs.writeFile_error "+err);
        });
        //res.redirect('/result')
      });

    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .jpg files are allowed!");
      });
    }
    res.redirect('/image')

  }
);

module.exports = app;
