'use strict';
const router = require('express').Router();
const request = require('request');
const config = require('../../config/environment');
const authService = require('./authService');
const userModel = require('../user/userModel');

router.post('/signUp', async (req, res) => {
	try {
		const newUser = userModel.create({
			name: req.body.name,
			lastName: req.body.lastName,
			email: req.body.email,
			active: false
		});
		await authService.signUp( newUser );
		return res.status(200).json({wasSuccessful: 'true'});
	} catch (err) {
		return res.status(500).json({wasSuccessful: 'false',ErrorMessage: err.message});
	}
});

router.get('/verifyEmail', async (req, res) => {
	try {
		await authService.verifyEmail(req.query.token);
		res.redirect(config.DOMAIN + '/signUpPassword?token=' + req.query.token);
	} catch (err) {
		res.status(500).json({wasSuccessful: 'false', ErrorMessage: err.message});
	} 
});

router.post('/signUpPassword', async (req, res) => {
	try {
		const user = await authService.signUpPassword(req.query.token, req.body.password);
		const token = authService.createJWT(user);
		res.json({ token: token });
	} catch (err) {
		res.status(500).json({wasSuccessful: 'false', ErrorMessage: err.message});
	}
});

router.post('/logout', (req, res) => {
	authService.expireToken(req.headers);
	res.redirect(config.DOMAIN);
});

router.post('/login', async (req, res) => {
	try {
		const user = await authService.login(req.body.email, req.body.password);
		const token = authService.createJWT(user);
		res.json({ token: token });	
	} catch (err) {
		res.status(401).json({wasSuccessful: 'false', ErrorMessage: err.message});
	}
});

router.post('/facebook', async (req, res) => {
	try {
		const accessTokenUrl = 'https://graph.facebook.com/' + config.oauth.facebook.apiVersion + '/oauth/access_token';
		const graphApiUrl = 'https://graph.facebook.com/' + config.oauth.facebook.apiVersion + '/me?fields=email,first_name,last_name,friends';
		let currentUserId, results;
		const params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.oauth.facebook.clientSecret,
			redirect_uri: req.body.redirectUri
		};

		// Step 1. Exchange authorization code for access token.
		results = await request.getAsync({ url: accessTokenUrl, qs: params, json: true });
		const accessToken = results[1];
		
		if (results[0].statusCode !== 200) {
			return res.status(500).send({ message: accessToken.error.message });
		}

		// Step 2. Retrieve profile information about the current user.
		results = await request.getAsync({ url: graphApiUrl, qs: accessToken, json: true });
		const profile = results[1];
		
		if (results[0].statusCode !== 200) {
			return res.status(500).send({ message: profile.error.message });
		}
		
		const token = authService.getToken(req.headers);
		
		if (token) {
			try {
				results = await authService.verifyToken(req);
				currentUserId = results[1];
			} catch (err) {
				currentUserId = undefined;
			}
		}
			
		const newProfile = {
			id: profile.id,
			name: profile.first_name,
			lastName: profile.last_name,
			picture: 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large',
			email: profile.email,
			friends: profile.friends.data.map(friend => friend.id),
			accessToken: accessToken.access_token
		};
			
		const finalToken = await authService.linkUserAccounts(currentUserId, newProfile, 'facebook');
		return res.json({ token: finalToken });
	} catch (err) {
		return res.status(500).json({wasSuccessful: 'false', ErrorMessage: err.message});
	}
});

router.post('/google', async (req, res) => {
	try {
		const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
		const profileApiUrl = 'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe%2Cemails%2Cgender%2Cid%2Cimage%2Furl%2Cname(familyName%2CgivenName)';
		const friendsApiUrl = 'https://www.googleapis.com/plus/v1/people/me/people/connected?fields=items%2Fid';
		let currentUserId, results;
		const params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.oauth.google.clientSecret,
			redirect_uri: req.body.redirectUri,
			grant_type: 'authorization_code'
		};

		// Step 1. Exchange authorization code for access token.
		results = await request.postAsync(accessTokenUrl, { json: true, form: params });
		const accessToken = results[1].access_token;

		const headers = { Authorization: 'Bearer ' + accessToken };

		// Step 2. Retrieve profile information about the current user.
		results = await request.getAsync({ url: profileApiUrl, headers: headers, json: true });
		const profile = results[1];
		
		// Step 3a. Retrieve friendIDs information from the current user.
		results = await request.getAsync({ url: friendsApiUrl, headers: headers, json: true });
		const friends = results[1];
		
		const token = authService.getToken(req.headers);
		
		if (token) {
			try {
				results = await authService.verifyToken(req);
				currentUserId = results[1];
			} catch (err) {
				currentUserId = undefined;
			}
		}
						
		const newProfile = {
			id: profile.id,
			name: profile.name.givenName,
			lastName: profile.name.familyName,
			picture: profile.image.url,
			email: profile.emails[0].value,
			friends: friends.items.map(friend => friend.id ),
			accessToken: accessToken
		};
		
		const finalToken = await authService.linkUserAccounts(currentUserId, newProfile, 'google');
		return res.json({ token: finalToken });
	} catch (err) {
		return res.status(500).json({wasSuccessful: 'false', ErrorMessage: err.message});
	}
});

module.exports = router;