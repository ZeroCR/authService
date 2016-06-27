"use strict";

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fs = require('fs');
const config = require('../../config/environment');
const sendgrid = require('sendgrid')(config.secrets.SENDGRIDID_API_KEY);

const model = {
	verifyUrl: config.DOMAIN + '/api/auth/verifyEmail?token=',
	title: 'MopTek',
	subTitle: 'Thanks for signing up!',
	body: 'Thanks for signing up with Moptek! You must follow this link to activate your account:'
};

const send = async (newUser) => {

	const path = '../emailTemplates/_inlined/emailVerification.html';
	const html = await fs.readFileAsync(path, {encoding: 'utf8'});
	const template = _.template(html);

	newUser.token = await jwt.signAsync( { email: newUser.email }, config.secrets.EMAIL_SECRET, { expiresInMinutes: 60*5 });
	
	model.verifyUrl += newUser.token;
	model.name = newUser.name;
	
	const email = new sendgrid.Email({
		to: newUser.email,
		from: 'test.moptek.com',
		subject: 'Moptek Account Verification',
		html: template(model)
	});
	
	sendgrid.send(email, (err, json) => { 
		if (err) {
			console.log(err);
		}
	});
};

module.exports.send = send;

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;