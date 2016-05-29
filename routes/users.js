var express = require('express');
var router = express.Router();
var models = require('../db/models/index.js');
var userController = require('../db/controllers/userController.js');
/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
   var users = models.userModel.getUsers(function(err, users) {
       if(err == null){
           for(var i = 0; i < users.length; i++){
               users[i] = users[i].name;
           }
           res.send(users);
       }
       else{
           res.send(err);
       }
   });
});

/*
 * POST to adduser.
 */
router.post('/register', function(req, res) {
    console.log(req.body.name);
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);
   if (req.body.name != "" && req.body.username != "" && req.body.email != "" && req.body.password != "") {
       userController.register(req.body.name, req.body.username, req.body.email, req.body.password, req.session, res);
   } else {
       res.status(400).json({error: 'Please fill all fields'});
   }
});


router.post('/login', function(req, res) {
   if (req.body.email != "" && req.body.password != "") {
       userController.login(req.body.email, req.body.password, req.session, res);
   } else {
       res.status(400).json({error: 'Please fill all fields'});
   }
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
   var db = req.db;
   var collection = db.get('userlist');
   var userToDelete = req.params.id;
   collection.remove({ '_id' : userToDelete }, function(err) {
       res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
   });
});

 module.exports = router;