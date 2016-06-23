'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Dev(cloud9) Server IP
  ip:       process.env.IP ||
            undefined,
            
  // MongoDB connection options
  mongo: {
    uri: ''
  },
  
  redis: {
    uri: '',
    port: 10671,
    password: ''
  },

  seedDB: true,
  
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
