var express = require('express');
var router = express.Router();
var models = require('../db/models/index.js');
var userController = require('../db/controllers/userController.js');
/*
 * POST to adduser.
 */
router.post('/register', function(req, res) {
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

 module.exports = router;