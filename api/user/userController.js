'use strict';
const router = require('express').Router();
const objectId = require('mongodb').ObjectID;
const userService = require('./userService.js');
const userModel = require('./userModel.js');

		
router.route('/')
	.get( async (req,res) => {
		try {
			const users = await userService.getUsers();
			res.set('Content-Type', 'application/json');
			res.send(users);
		} catch (err) {
			res.status(500).send({error: err});
		}
	})
	.post( async (req,res) => {
		try {
			const user = await userService.saveUser();
			res.set('Content-Type', 'application/json');
			res.send(user);
		} catch (err) {
			res.status(500).send({error: err});
		}
	});

router.use('/:userId', async (req,res,next) => {
	try {
		const objId = new objectId(req.params.userId);
		const user = await userService.getUser({_id: objId});

		if (user) {
			req.user = user;
			return next();
		} 
		return res.status(404).send({error: 'No user found'});
	} catch (err) {
		res.status(500).send({error: err});
	}
});

router.route('/:userId')
	.get( (req,res) => {
		res.json(req.user);
	})
	.put( async (req, res) => {
		try {
			const currentUser = userModel.init(req.body.user);
			if (currentUser.isValid) {
				currentUser.data._id = req.user._id;
				const result = await userService.updateUser(currentUser.data);
				res.set('Content-Type', 'application/json');
				return res.send(result);
			}
			throw new Error('User invalid');
		} catch (err) {
			res.status(500).send({error: err});
		}
	})
	.patch( async (req,res) => {
		// userService.partialUpdateUser().then(function(results){
		//     res.set("Content-Type","application/json");
		//     res.send(results);
		// },function(err){
		//     res.send(500).send({error: err});
		// });
	});

module.exports = router;