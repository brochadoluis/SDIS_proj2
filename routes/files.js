var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');


router.post('/upload', function(req, res) {
    fs.readFile(req.files.image.path, function (err, data){ // readfilr from the given path
      var dirname = path.resolve(".")+'/uploads/'; // path.resolve(“.”) get application directory path
      var newPath = dirname + req.files.image.originalFilename; // add the file name
      fs.writeFile(newPath, data, function (err) { // write file i+-*/n uploads folder
        if(err){
          res.redirect("/");
        }
        else {
          res.redirect("/");
        }
      });
    });
});

router.get('/uploads/:file', function (req, res){
  file = req.params.file;
  var dirname = path.resolve(".")+'/uploads/';
  var img = fs.readFileSync(dirname  + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

router.get('/filelist', function(req, res) {
    var dirname = path.resolve(".")+'/uploads/';
    files = fs.readdirSync(dirname);
    var filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dirname + file).isDirectory()) {
          filelist = walkSync(dirname + file, filelist);
      }
      else {
          filelist.push(file);
      }
  });
    res.send(filelist);
});


// Add this route for download it
router.get('/:file(*)', function(req, res, next){ // this routes all types of file
  var file = req.params.file;
  var dirname = path.resolve(".")+'/uploads/'+file;
  res.download(dirname); // magic of download fuction
});


module.exports = router;
