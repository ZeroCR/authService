'use strict';

const validator = require('validator');
const sanitizer = require('auto-sanitize').sanitizeObject;
const _ = require('lodash');
const properties = ['providerType', 'id', 'accessToken', 'email'];

const Create = args => {
    args = args || {};
    
    var authProvider = {};

    const proLength = properties.length;
    
    for(var i = 0; i < proLength; i += 1) 
    { 
        if (args[properties[i]] !== undefined) 
        {
            authProvider[properties[i]] = args[properties[i]];
        }
    }
    
    authProvider = sanitizer(authProvider);
    
    if(hasValidData(authProvider)) 
    {
        return authProvider;
    }
};

const hasValidData = authProvider => {

    if(authProvider.id) 
    {
        if(!validator.isAlphanumeric(authProvider.id)) 
        {
            throw new Error('The authProvider id is invalid');
        }
    }
    
    if(authProvider.providerType)
    {
        if(!validator.isAlpha(authProvider.providerType)) 
        {
            throw new Error('The authProvider providerType is invalid');
        }
    }
    
    if(authProvider.accessToken)
    {
        if(!_.isString(authProvider.accessToken)) 
        {
            throw new Error('The authProvider accessToken is invalid');
        }
    }
    
    if(authProvider.email)
    {
        if(!validator.isEmail(authProvider.email)) 
        {
            throw new Error('The authProvider email is invalid');
        }
    }
    
    return true;
};

module.exports.Create = Create;