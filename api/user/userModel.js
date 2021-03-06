'use strict';

const ObjectId = require('mongodb').ObjectID;
const validator = require('validator');
const _ = require('lodash');
const sanitizer = require('auto-sanitize').sanitizeObject;

const properties = [ '_id', 'name', 'lastName', 'email', 'active', 'picture', 'friendIDs', 'authProviders' ];

const Create = (args = {}) => {
	
	let user = {};

	const proLength = properties.length;
	
	for (let i = 0; i < proLength; i += 1) { 
		if (args[properties[i]] !== undefined) {
			user[properties[i]] = args[properties[i]];
		}
	}
	
	user = sanitizer(user);
	
	if (hasValidData(user)) {
		return user;
	}
};

const hasValidData = user => {
	if (user._id) {
		if (_.isString(user._id)) {
			user._id = new ObjectId(user._id);
		} else {
			throw new Error('The user id is invalid');
		}
	}
    
	if (user.name) {
		if (!_.isString(user.name) || user.name.length > 150) {
			throw new Error('The user name is invalid');
		}
	}
  
	if (user.lastName) {
		if (!_.isString(user.lastName) || user.lastName.length > 150) {
			throw new Error('The user lastName is invalid');
		}
	}
	
	if (user.email) {
		if (!validator.isEmail(user.email)) {
			throw new Error('The user email is invalid');
		}
	}
	
	if (user.active) {
		if (!validator.isBoolean(user.active)) {
			throw new Error('The user active is invalid');
		}
	}
	
	if (user.picture) {
		if (!validator.isURL(user.picture)) {
			throw new Error('The user picture is invalid');
		}
	}
	
	if (user.friendIDs) {
		if (!_.isArray(user.friendIDs)) {
			throw new Error('The user friendIDs is invalid');
		}
	}
	
	if (user.authProviders) {
		if (!_.isArray(user.authProviders)) {
			throw new Error('The user authProviders is invalid');
		}
	}
	
	return true;
};

module.exports.Create = Create;