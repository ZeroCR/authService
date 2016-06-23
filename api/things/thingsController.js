'use strict';

const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const bunyan = require('bunyan');
const log = bunyan.createLogger({
	name: 'myapp',
	src: true,
	streams: [
		{
			stream: process.stderr,
			level: 'info'
		},
		{
			stream: process.stderr,
			level: 'debug'
		},
		{
			level: 'error',
			path: './log/applogging.log'
		}
	]
});

router.route('/')
	.get((req, res) => {
		log.info('test info bunyan');
		res.send({test: 'test'});
		// userService.getUsers()
		// .then( (results) => {
		// 	res.set('Content-Type','application/json');
		// 	res.send(results);
		// })
		// .catch( err => res.status(500).send({error: err}));
	})
	.post((req, res) => {
		res.send({test: 'test'});
		// userService.saveUser()
		// .then((results) => {
		// 	res.set('Content-Type','application/json');
		// 	res.send(results);
		// })
		// .catch( err => res.status(500).send({error: err}));
	});

router.route('/test')
	.get((req, res) => {
		log.error('test error bunyan');
		res.send({test: 'test error'});
		// userService.getUsers()
		// .then( (results) => {
		// 	res.set('Content-Type','application/json');
		// 	res.send(results);
		// })
		// .catch( err => res.status(500).send({error: err}));
	});

module.exports = router;