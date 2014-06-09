"use strict";

// declare general dependencies
var express = require('express'),
	morgan = require('morgan'),
	goose = require('mongoose'),
	body = require('body-parser'),
	cookie = require('cookie-parser'),
	session = require('express-session'),
	flash = require('connect-flash'),
	swig = require('swig'),
	app = express();

// declare more specifically configured dependencies.
var passport = require('./config/passport'),
	databases = require('./config/databases'),
	routes = require('./routes'),
	api = requrie('./routes/api');

// configure View Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// configure Middleware
app.use(morgan());
app.use(body());
app.use(cookie());
app.use(flash());
app.use(session({ secret : 'Velvet Secret They Fear' }));
app.use(passport.initialize());
app.use(passport.session());


// configure Static Content
app.use(express.static(__dirname + '/public'));

// initialize routes (html and api)
routes();
api();

//  initialize mongoose data connection
goose.connect(databases.oberyn);

// initialize server socket
app.listen(3000);
console.log('Listening on 3000');