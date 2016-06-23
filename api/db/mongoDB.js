'use strict';
const config = require('../../config/environment');
const Promise = require('bluebird');
Promisebb.promisifyAll(require('mongodb'));
const mongodb = require('mongodb');

const theDb;

const getDb = () => {
	return new Promise( (resolve, reject) => {
		if(!theDb) 
		{
			mongodb.connectAsync(config.mongo.uri)
			.then( db => {
				 theDb = {
					 db: db,
					 user: db.collection('User')
				 };
				 resolve(theDb);
			}, reject);
		}
		else 
		{
			resolve(theDb);
		}
	});
};

module.exports.getDb = getDb;