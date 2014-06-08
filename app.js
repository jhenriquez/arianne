"use strict";

var express = require('express'),
	morgan = require('morgan'),
	goose = require('mongoose'),
	body = require('body-parser'),
	swig = require('swig'),
	app = express();

// Configure View Engine

app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// Configure Static Content
app.use(express.static(__dirname + '/public'));

app.get('/', function (rq, rs) {
	rs.render('layout', {title : 'index'});
});

app.listen(3000);
console.log('Listening on 3000');