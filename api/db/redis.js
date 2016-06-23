'use strict';

const config = require('../../config/environment');
const Redis = require('ioredis');
const redisClient  = new Redis( config.redis.port, config.redis.uri, {password: config.redis.password} );

redisClient.on('error', err => {
    console.log('Error ' + err);
});
 
redisClient.on('connect', () => {
    console.log('Redis is ready');
});
 
module.exports.redisClient  = redisClient ;