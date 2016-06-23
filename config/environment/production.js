'use strict';

// Production specific configuration
// =================================
module.exports = {
	// Server IP
	ip:       process.env.OPENSHIFT_NODEJS_IP ||
						process.env.IP ||
						undefined,

	// Server port
	port:     process.env.OPENSHIFT_NODEJS_PORT ||
						process.env.PORT ||
						8080,

	// MongoDB connection options
	mongo: {
		uri:    process.env.MONGOLAB_URI ||
						process.env.MONGOHQ_URL ||
						process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
						'mongodb://'
	},
	
	redis: {
		uri: '',
		port: 0,
		password: ''
	},
	
	secrets: {
    EMAIL_SECRET: '',
    SMTP_PASS: '',
    AUTH_SECRET: 'shhhhhhh',
    SENDGRIDID_API_KEY: ''
  },
  
  DOMAIN: 'http://localhost:3000',
  oauth: {
    facebook: {
      clientID: '',
      clientSecret: '',
      callbackURL: 'https://arthas-zerocr.c9.io/api/auth/facebook/callback',
      apiVersion: ''
    },
    twitter: {
      consumerKey: 'get_your_own',
      consumerSecret: 'get_your_own',
      callbackURL: 'https://arthas-zerocr.c9.io/api/auth/twitter/callback'
    },
    google: {
      returnURL: 'https://arthas-zerocr.c9.io/api/auth/google/callback',
      clientSecret: '',
      realm: ''
    }
  }
};