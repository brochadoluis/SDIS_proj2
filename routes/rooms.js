var express = require('express');
var router = express.Router();
var models = require('../db/models/index.js');
var userController = require('../db/controllers/userController.js');
/*
 * POST CREATE ROOM.
 */
 router.post('/create', function(req, res) {
  if (req.body.name != ""){
    models.roomModel.getRoomByName(req.body.name, function(err, room) {
      if(room.length != 0){
        res.redirect('/rooms');
      }
      else{
        models.roomModel.createRoom(req.body.name, function(err) {
          if(err == null){
            models.roomModel.addUserToRoom(req.body.name , req.session.username, function (err, room) {
              res.redirect('/home');
            });
          }
          else{
           res.send(err);
         }
       });
      }
    });
  }
  else{
    res.status(400).json({error: 'Please fill all fields'});
  }
});

/*
 * POST JOIN ROOM.
 */
 router.post('/join', function(req, res) {
  if (req.body.code != ""){
    models.roomModel.getRoomByCode(req.body.code, function(err, room) {
      if(room.length != 0){;
        models.roomModel.addUserToRoom(room[0].name , req.session.username, function (err, room) {
          res.redirect('/home');
        });
      }
      else {
        res.redirect('/rooms');
      }
    });
  }
  else{
    res.redirect('/rooms');
  }
});

 router.get('/getRoom', function(req, res) {
  models.roomModel.getRoomByUser(req.session.username, function( err, room){
    if(err == null){
      console.log(room[0].code)
        res.send(room[0]);
      } else {
        res.send(err);
      }
  });
});

 module.exports = router;