'use strict';
//var ObjectId = require('mongodb').ObjectID;
var database = require('../db/mongoDB.js');
var userModel = require('./userModel');

var getUsers = async (where, select) => {
	select = select || {};
	where = where || {};
	let db = await database.getDb();
	let user = await db.user.find(where, select).toArrayAsync();
	return user;
};

var addUser = async user => {
	let db = await database.getDb();
	let result = await db.user.insertOneAsync(user);
	return result;
};

var getUser = async (where, select) => {
	select = select || {};
	where = where || {};
	let db = await database.getDb();
	let user = await db.user.findOneAsync(where, select);
	return user;
};

var updateUser = async (where, update) => {
	let db = await database.getDb();
	let result = await db.user.updateOneAsync(where, update);
	return result;
};

var updateAndGetUser = async (where, update, options) => {
	let db = await database.getDb();
	let user = await db.user.findOneAndUpdateAsync( where, update, options);
	return user;
};

var seedUser = async () => {
	let users = await getUsers();
	if (users.length === 0) {
		let db = await database.getDb();
		var user = userModel.Create({
            name: 'Edgar',
            lastName: 'Hernandez',
            email: 'ed1g2a3r@gmail.com',
            active: true
        });
		let result = await db.user.insertOneAsync(user);
		return result;
	}
};

module.exports = {
	getUsers : getUsers,
	addUser : addUser,
	getUser : getUser,
	updateUser : updateUser,
	updateAndGetUser : updateAndGetUser,
	seedUser : seedUser
};
