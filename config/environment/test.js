'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://zerocr:zerocr@ds043348.mongolab.com:43348/arthasdb'
  },
  
  redis: {
    uri: 'pub-redis-10671.us-east-1-2.4.ec2.garantiadata.com',
    port: 10671,
    password: 'zerozero'
  },
  
  secrets: {
    EMAIL_SECRET: 'emailSecret',
    SMTP_PASS: 'Artomas@tek2191',
    AUTH_SECRET: 'shhhhhhh'
  },
  
  DOMAIN: 'https://arthas-zerocr.c9.io',
  
  oauth: {
    facebook: {
      clientID: '722548471188276',
      clientSecret: '60208503c6ce99d769079703553f9589',
      callbackURL: 'https://arthas-zerocr.c9.io/api/auth/facebook/callback'
    },
    twitter: {
      consumerKey: 'get_your_own',
      consumerSecret: 'get_your_own',
      callbackURL: "https://arthas-zerocr.c9.io/api/auth/twitter/callback"
    },
    google: {
      returnURL: 'https://arthas-zerocr.c9.io/api/auth/google/callback',
      realm: 'http://127.0.0.1:1337'
    }
  }
};