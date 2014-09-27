/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  
  if(!sails.config.globals.myCache){
	var NodeCache = require( "node-cache" );
	sails.config.globals.myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); 
  }
  
  User.create({id:"sqrlJsUser", password:"123456"}).exec(console.log);	

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
