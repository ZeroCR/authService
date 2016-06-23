'use strict';

// var config = require('./config/environment');
// var jwt = require('express-jwt');
// var authService = require("./api/auth/authService.js");


module.exports = app => {
	// Authentification
	// app.use('/api/s', jwt({secret: config.secrets.AUTH_SECRET, isRevoked: authService.isTokenRevoked}));
	// app.use( (err, req, res, next) => {
	// 	if (err.name === 'UnauthorizedError') 
	// 	{
	// 		res.status(401).json({ErrorMessage: 'invalid token'});
	// 	}
	// });
	// Insert routes below
	app.use('/api/s/things', require('./things/thingsController'));
};
