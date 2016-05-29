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
  console.log("OLHA EU AQUI");
  console.log(req.body.fixe);
  console.log(req.file);
  var dirname = path.resolve(".")+'/uploads/'; // path.resolve(“.”) get application directory path
  var newPath = dirname + req.file.originalname; // add the file name
  fs.readFile(req.file.path, function (err, data){ // readfilr from the given path
    fs.renameSync(dirname+req.file.filename, dirname + req.file.originalname);
     models.fileModel.addFile(req.file.originalname, function (err) {
       if(err == null){
         console.log("OK");
       }else {
         res.redirect("/home");
       }
     });
     res.redirect("/home");
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
    var files = models.fileModel.getFiles(function(err,files){
      if(err == null){
        for(var i = 0; i < files.length; i++){
          files[i] = files[i].name;
        }
        res.send(files);
      } else {
        res.send(err);
      }
    });
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
});


// Add this route for download it
router.get('/:file(*)', function(req, res, next){ // this routes all types of file
  var file = req.params.file;
  var dirname = path.resolve(".")+'/uploads/'+file;
  res.download(dirname); // magic of download fuction
});

router.delete('/delete/:name', function(req, res) {
  var dirname = path.resolve(".")+'/uploads/';
  var file = req.params.file;
  models.fileModel.deleteFile(file.name, function(err) {
    if(err == null){
      console.log("Deleted File sucefully!");
    }
    else {
      res.send(err);
    }
  })
});


module.exports = router;
