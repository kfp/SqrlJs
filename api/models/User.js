/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = {

  attributes: {
    id:{
      type: 'string'
    },
    password:{
      type: 'string'
    },
    publicKey:{
      type: 'string'
    },
    salt:{
      type: 'string'
    },
    
    pwMatches: function(pw){
      providedHash = bcrypt.hashSync(String(pw), this.salt);
      console.log(providedHash + " : " + this.salt + " : " + pw);
      if(this.password && this.password == providedHash){
	return true;
      }
      return false;
    }
  },

  // generate salt & Hash PW
  beforeCreate: function(values, next) {
    values.salt = bcrypt.genSaltSync(10);
    bcrypt.hash(String(values.password), values.salt, function(err, hash) {
      if(err) return next(err);
      console.log("Salt: "+values.password+" : "+values.salt+" : "+hash);
      values.password = hash;
      console.log(hash);
      next();
    });
  }
};

