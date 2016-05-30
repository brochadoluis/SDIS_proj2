var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })
var models = require('../db/models/index.js');

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
            res.redirect("/home");
      });
      });
       /*if(err == null){
         console.log("OK");
         console.log(req.session);
         console.log(req.session.name);
         console.log(req.session.username);
         console.log(req.session.email);
         console.log(req.session.password);
       }else {
         res.redirect("/home");
       }*/
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
        //console.log("FILES");
        //console.log(room[0].files);
        //for(var i = 0; i < room[0].files.length; i++){
          //files[i] = room[0].files[i].name;
          //files[i].push(room[0].files[i].name);
      //  }
        res.send(room[0].files);
      } else {
        res.send(err);
      }
    });
      });
    //var files = models.fileModel.getFiles(function(err,files){
    /*files = fs.readdirSync(dirname);
    var filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dirname + file).isDirectory()) {
          filelist = walkSync(dirname + file, filelist);
      }
      else {
          filelist.push(file);
      }
  });
    res.send(filelist);*/

router.get('/delete/:name', function(req, res) {
  var dirname = path.resolve(".")+'/uploads/';
  models.fileModel.deleteFile(req.params.name, function(err) {
    console.log("AQUI");
    models.roomModel.getRoomByUser(req.session.username, function( err, room){
      console.log("ALI");
      models.roomModel.deleteFileInRoom(room[0].name, req.params.name,function( err, rooms){
        console.log(room[0].name)
      if(err == null){
        console.log("Deleted File sucefully!");
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


module.exports = router;
