"use strict";

// declare general dependencies
var express = require('express'),
	morgan = require('morgan'),
	params = require('express-params'),
	multiparty = require('connect-multiparty'),
	eJwt = require('express-jwt'),
	goose = require('mongoose'),
	body = require('body-parser'),
	swig = require('swig'),
	app = express();

// declare more specifically configured dependencies.
var databases = require('./config/databases'),
	routes = require('./routes'),
	api = require('./routes/api'),
	authApi = require('./routes/authApi');

// configure View Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// configure Middleware
app.use(body.json());
app.use(body.urlencoded());
app.use(multiparty());
params.extend(app);
app.use(morgan());


// configure Static Content
app.use(express.static(__dirname + '/public'));

// configure express-jwt
app.use('/api', eJwt({ secret: 'I\'m King!' }));

// initialize routes (html and api)
routes(app);
api(app);
authApi(app);

//  initialize mongoose data connection
goose.connect(databases.oberyn);

// initialize server socket
app.listen(3000);
console.log('Listening on 3000');