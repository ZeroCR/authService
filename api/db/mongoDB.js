'use strict';
const config = require('../../config/environment');
const Promise = require('bluebird');
Promise.promisifyAll(require('mongodb'));
const mongodb = require('mongodb');

let theDb;

const getDb = async () => {
	if (!theDb) {
		const db = await mongodb.connectAsync(config.mongo.uri);
		theDb = {
			db: db,
			user: db.collection('User')
		};
	}
	return theDb;
};

module.exports.getDb = getDb;