var express = require('express');
var router = express.Router();
var models = require('../db/models/index.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.email != undefined){
		res.render('index', { title: 'Express' });
	}
	else {
		res.render('login', { title: 'Express' });
	}
});

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/home', function(req, res, next) {
	if(req.session.email != undefined){
		res.render('index', { title: 'Express' });
	}
	else {
		res.render('login', { title: 'Express' });
	}
});

router.get('/rooms', function(req, res, next) {
	if(req.session.email != undefined){
		res.render('rooms', { title: 'Express' });
	}
	else {
		res.render('login', { title: 'Express' });
	}
});

module.exports = router;
