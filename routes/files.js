var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })
var models = require('../db/models/index.js');
var nodemailer = require('nodemailer');

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/upload', upload.single('image'), function(req, res) {
  var dirname = path.resolve(".")+'/uploads/'; // path.resolve(“.”) get application directory path
  var newPath = dirname + req.file.originalname; // add the file name
  fs.readFile(req.file.path, function (err, data){ // readfilr from the given path
    fs.renameSync(dirname+req.file.filename, dirname + req.file.originalname);
    models.fileModel.addFile(req.file.originalname, function (err) {
      models.roomModel.getRoomByUser(req.session.username, function( erro, room){
        models.roomModel.addFileToRoom(room[0].name, req.file.originalname, function (errr, file) {
          models.roomModel.getUsers(room[0].name, function (err, usersRoom) {
            for(var i = 0; i < usersRoom.users.length; i++){
              models.userModel.getEmail(usersRoom.users[i], function(erro, user) {
                sendEmail(req.session.username,user[0], req.file.originalname, "uploaded");
              });
            }
          });
          res.redirect("/home");
        });
      });
    });
  });
});

router.get('/uploads/:file', function (req, res){
  file = req.params.file;
  models.fileModel.addFile(file.name, function (err) {
    if (err == null) {
      var dirname = path.resolve(".")+'/uploads/';
      var img = fs.readFileSync(dirname  + file);
      res.writeHead(200, {'Content-Type': 'image/jpg' });
      res.end(img, 'binary');
    } else {
      res.send(err);
    }
  });
});

router.get('/filelist', function(req, res) {
  var dirname = path.resolve(".")+'/uploads/';
  models.roomModel.getRoomByUser(req.session.username, function( err, room){
    if(err == null){
      res.send(room[0].files);
    } else {
      res.send(err);
    }
  });
});

router.get('/delete/:name', function(req, res) {
  var dirname = path.resolve(".")+'/uploads/';
  models.fileModel.deleteFile(req.params.name, function(err) {
    models.roomModel.getRoomByUser(req.session.username, function( err, room){
      models.roomModel.deleteFileInRoom(room[0].name, req.params.name,function( err, rooms){
        if(err == null){
          models.roomModel.getUsers(room[0].name, function (err, usersRoom) {
            for(var i = 0; i < usersRoom.users.length; i++){
              models.userModel.getEmail(usersRoom.users[i], function(erro, user) {
                sendEmail(req.session.username,user[0], req.params.name, "deleted");
              });
            }
          });
          res.redirect('/home');        
        }
        else {
          res.send(err);
        }
      });
    });
  });
});

// Add this route for download it
router.get('/:file(*)', function(req, res, next){ // this routes all types of file
  var file = req.params.file;
  var dirname = path.resolve(".")+'/uploads/'+file;
  res.download(dirname); // magic of download fuction
});

// Notifications by email
function sendEmail(userAction, user, filename, action) {
  var today = new Date();
  var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    var html = [userAction + " has " + action + " " + filename].join('');

    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sdis.proj2.2016@gmail.com',
        pass: 'sdis2016'
      }
    });

    var mailOptions = {
        from: 'Bancas Comunitarias <sdis.proj2.2016@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "A file has been " + action + " in your room" , // Subject line
        text: "An action has been made",
        html: html
      };

      transporter.sendMail(mailOptions, function (error, info) {
        console.log("Sending email");
        if (error) {
          console.log("Falhou o mail");
        } else {
          console.log("Funcionou o mail");
        }
      });
      console.log("OK, processed");
      //res.status(200).json({ok:"processed"});
    };

    module.exports = router;
