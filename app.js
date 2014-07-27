"use strict";

// declare general dependencies
var express = require('express'),
	morgan = require('morgan'),
	params = require('express-params'),
	goose = require('mongoose'),
	body = require('body-parser'),
	swig = require('swig'),
	app = express();

// declare more specifically configured dependencies.
var databases = require('./config/databases'),
	routes = require('./routes'),
	api = require('./routes/api');

// configure View Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// configure Middleware
params.extend(app);
app.use(morgan());
app.use(body());


// configure Static Content
app.use(express.static(__dirname + '/public'));

// initialize routes (html and api)
routes(app);
api(app);

//  initialize mongoose data connection
goose.connect(databases.oberyn);

// initialize server socket
app.listen(3000);
console.log('Listening on 3000');