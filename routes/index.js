var express = require('express');
var router = express.Router();
var models = require('../db/models/index.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session.name);
	console.log(req.session.username);
	console.log(req.session.email);
	console.log(req.session.password);
	if(req.session.name != undefined){
		res.render('index', { title: 'Express' });
	}
	else {
		res.render('login', { title: 'Express' });
		//res.render('index', { title: 'Express' });
	}
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
