"use strict";

var jwt = require('jsonwebtoken');
var _ = require('lodash');
var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var config = require('../../config/environment');

var model = {
  verifyUrl: config.DOMAIN + '/api/auth/verifyEmail?token=',
  title: 'MopTek',
  subTitle: 'Thanks for signing up!',
  body:'Thanks for signing up with Moptek! You must follow this link to activate your account:'
};

var getHtml = function(newUser) {
  return new Promise(function(resolve, reject) {
    var path = 'server/views/emailTemplates/_inlined/emailVerification.html';
    
    fs.readFile(path, {encoding: 'utf8'}, function (err, html) {
      if (err) return reject(err);
      
      var template = _.template(html);
      
      model.verifyUrl += newUser.token;
      model.name = newUser.name;
      
      resolve(template(model));
    });
  });
};

var send = function(newUser) {
  return new Promise(function(resolve, reject) {
    
    var payload = {
      email: newUser.email
    };
  
    newUser.token = jwt.sign(payload, config.secrets.EMAIL_SECRET, { expiresInMinutes: 60*5 });
  
    getHtml(newUser).then(function (html) {
      
      var transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: 'edgar.hernandez@moptek.com',
          pass: config.secrets.SMTP_PASS
        }
      }));
      
      var mailOptions = {
        from: 'noreply@moptek.com',
        to: newUser.email,
        subject: 'Moptek Account Verification',
        html: html
      };
      
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) return reject(err);
        
        resolve(info.response);
      });
    },reject);
  });
};

module.exports.send = send;

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;