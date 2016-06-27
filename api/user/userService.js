'use strict';
//var ObjectId = require('mongodb').ObjectID;
const database = require('../db/mongoDB.js');
const userModel = require('./userModel');

const getUsers = async (where = {}, select= {}) => {
	const db = await database.getDb();
	const user = await db.user.find(where, select).toArrayAsync();
	return user;
};

const addUser = async (user) => {
	const db = await database.getDb();
	const result = await db.user.insertOneAsync(user);
	return result;
};

const getUser = async (where = {}, select= {}) => {
	const db = await database.getDb();
	const user = await db.user.findOneAsync(where, select);
	return user;
};

const updateUser = async (where = {}, update = {}) => {
	const db = await database.getDb();
	const result = await db.user.updateOneAsync(where, update);
	return result;
};

const updateAndGetUser = async (where = {}, update = {}, options = {}) => {
	const db = await database.getDb();
	const user = await db.user.findOneAndUpdateAsync( where, update, options);
	return user;
};

const seedUser = async () => {
	const users = await getUsers();
	if (users.length === 0) {
		const db = await database.getDb();
		const user = userModel.Create({
			name: 'Edgar',
			lastName: 'Hernandez',
			email: 'ed1g2a3r@gmail.com',
			active: true
		});
		const result = await db.user.insertOneAsync(user);
		return result;
	}
};

module.exports = {
	getUsers: getUsers,
	addUser: addUser,
	getUser: getUser,
	updateUser: updateUser,
	updateAndGetUser: updateAndGetUser,
	seedUser: seedUser
};
