 'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const config = require('../../config/environment');
const userService = require('../user/userService');
const userModel = require('../user/userModel');
const authProviderModel = require('./authProviderModel');
const emailVerification = require('./emailVerification2');
const redisClient = require('../db/redis').redisClient;

	
const TOKEN_EXPIRATION = 60;
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

const expireToken = headers => {
	const token = getToken(headers);
	// Validar que esto funcione
	if (token) {
		redisClient.set(token, { is_expired: true });
		redisClient.expire(token, TOKEN_EXPIRATION_SEC);
	}
};

const getToken = headers => {
	if (headers && headers.authorization) {
		const part = headers.authorization.split(' ');
		
		if (part.length === 2) {
			return part[1];
		}
	}
	return null;
};

const verifyToken = async (token) => {
	
	const decoded = await jwt.verifyAsync(token, config.secrets.AUTH_SECRET);
	const reply = await redisClient.get(token);
	const final = [];
	
	final.push(!!!reply);
	final.push(decoded.id);
	return final;
};

const isTokenRevoked = (req, res, next) => {
	const token = getToken(req.headers);
	redisClient.get(token, (err, reply) => {
		if (err) { 
			return next(err); 
		}
		return next(null, !!reply);
	});
};

const createJWT = (user) => {
	const payload = {
		name: user.name,
		email: user.email,
		id: user._id.toString(),
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	return jwt.sign(payload, config.secrets.AUTH_SECRET, { expiresInMinutes: moment().add(14, 'days').unix() });
};
		
const signUp = async (newUser) => {
	const user = await userService.getUser({email: newUser.email}, {_id:true});
	
	if (_.isObject(user)) {
		throw new Error('error user already exist');
	} 
	
	let saved = await userService.addUser(newUser);
	
	if (saved.result.ok !== 1) {
		throw new Error('error user already exist');
	}
	emailVerification.send(newUser);
	return;
};

const verifyEmail = async (token) => {
	
	const decoded = await jwt.verifyAsync(token, config.secrets.EMAIL_SECRET);
	const saved = await userService.updateUser({email: decoded.email}, {$set:{active:true}});
	if (saved.result.ok !== 1) {
		throw new Error('error updating user');
	}
	return;
};

const signUpPassword = async (token, password) => {

	const decoded = await jwt.verifyAsync(token, config.secrets.EMAIL_SECRET);
	const salt = await bcrypt.genSaltAsync(10);
	const hash = await bcrypt.hashAsync(password, salt);
	
	const saved = await userService.updateAndGetUser({email: decoded.email}, {$set:{password: hash}}, {returnOriginal: false});
	if (saved.ok !== 1) {
		throw new Error('error updating user password');
	}
	return saved.value;
};

const login = async (email, password) => {
	
	let user = await userService.getUser({email: email}, {_id:true, name:true, password: true});
			
	if (_.isObject(user)) {
		const result = await bcrypt.compareAsync(password, user.password);
		if (result) {
			user.email = email;
			return user;
		} 
		throw new Error('Invalid Credentials.');
	}
	throw new Error('user does not exist');
};

const linkUserAccounts = async (currentUserId, profile, provider) => {

	const select = { _id: true, name: true, email: true, friendIDs: true, authProviders: true };
	
	if (currentUserId) {
		const where = { _id: new ObjectId(currentUserId) };
		const user = await userService.getUser(where, select);
		if (!_.isObject(user)) {
			throw new Error('user does not exist');
		}
		const token = await applyProviderInfoToUser(user, profile, provider);
		return token;
	}
	const where = { $or: [{ $and: [{"authProviders.providerType": provider }, {"authProviders.id": profile.id }]}, {email: profile.email}]};
	const user = await userService.getUser( where, select );
	if (user) {
		const token = await applyProviderInfoToUser(user, profile, provider);
		return token;
	}
	const newUser = userModel.create({
		name: profile.name,
		lastName: profile.lastName,
		email: profile.email,
		active: true,
		picture: profile.picture,
		friendIDs: [],
		authProviders: []
	});
	
	const authProvider = authProviderModel.Create({
		providerType: provider,
		id: profile.id,
		email: profile.email,
		accessToken: profile.accessToken
	});
	
	newUser.authProviders.push(authProvider);
	
	const saved = await userService.addUser(newUser);
	if (saved.result.ok !== 1) {
		throw new Error('error inserting user');
	}
	newUser._id = saved.insertedId;
	await consolidateFriends(newUser, profile.friends, provider);
	return createJWT(newUser);
};

const applyProviderInfoToUser = async (user, profile, provider) => {
	
	const currentAuthProvider = _.find(user.authProviders, authProvider => authProvider.providerType === provider && authProvider.id === profile.id );
	
	if (currentAuthProvider) {
		await consolidateFriends(user, profile.friends, provider);
		return createJWT(user);
	}
	const newAuthProvider = authProviderModel.Create({
		providerType: provider,
		id: profile.id,
		email: profile.email,
		accessToken: profile.accessToken
	});
	
	const saved = await userService.updateUser( { _id: user._id }, { $push: { authProviders: newAuthProvider }});
	if (saved.result.ok !== 1) {
		throw new Error('error updating user');
	}
	await consolidateFriends(user, profile.friends, provider);
	return createJWT(user);
};

const consolidateFriends = async (user, socialFriendIDs, provider) => {
	if (socialFriendIDs.length) {
		const where = { $and: [{"authProviders.providerType": provider }, {"authProviders.id": { $in: socialFriendIDs }}]};
		const users = await userService.getUsers(where, { _id: true});
		const userFriendIDs = users.map(user => user._id.toString());
		const newFriends = _.difference(userFriendIDs, user.friendIDs);
		
		if (newFriends.length) {
			const saved = await userService.updateUser( { _id: user._id }, { $pushAll: { friendIDs: newFriends } } );
			if (saved.result.ok !== 1) {
				throw new Error('error updating user friends');
			}
			return;
		}
	}
	return;
};

module.exports = {
	signUp: signUp,
	signUpPassword: signUpPassword,
	verifyEmail: verifyEmail,
	login: login,
	linkUserAccounts: linkUserAccounts,
	expireToken: expireToken,
	verifyToken: verifyToken,
	createJWT: createJWT,
	getToken: getToken,
	isTokenRevoked: isTokenRevoked
};