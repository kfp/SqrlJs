/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	badge: function(req, res) {
	  var crypto = require('crypto');
	  var name = new Date().getTime() + "";
	  var hash = crypto.createHash('md5').update(name).digest("hex");
	  
	  //User.find().where({id:"sqrlJsUser"}).exec(function(err, users){console.log(users[0]);});
	  
	  console.log("made it to: " + hash);	  
	  
	  locals = {
	    sessionHash : hash,
	    qrcode : ""
	  }
	  
	  loginMarker = {
	    sessionHash : hash,
	    valid : false	    
	  }
	  
	  req.session.sessionHash = hash;
	  
	  req.session.status = null;
	  
	  var qr = require('qr-image');  
	  
	  code = qr.imageSync(
	    "http://192.168.1.160:1337/Login/login?sessionHash="+hash+"&id=sqrlJsUser&password=123456", 
	    { type: 'svg' });
	  locals.qrcode = code;
	  
	  sails.config.globals.myCache.set("loginMarker", loginMarker);	  

	  
	  return res.view("login",locals);
	},
	
	login: function(req, res) {
	  var loginMarker = sails.config.globals.myCache.get("loginMarker").loginMarker;
	  User.find({id:"sqrlJsUser"}).exec(function(err, users){
	    if(err){
	      console.log(err); 
	    }
	    var user = users[0];
	    console.log("User: %j", user);
	      
	    if(loginMarker && user){
	      console.log("made it through: %j", loginMarker.sessionHash);
	      console.log("Socket ID:" + loginMarker.socketId);
	    
	      if(req.param('sessionHash') == loginMarker.sessionHash 
		  && user.pwMatches(req.param('password')) && !loginMarker.valid){
		loginMarker.valid = true;
		loginMarker.user = user;
		sails.sockets.emit(loginMarker.socketId, "welcomeMessage", {status: "good"});
		return res.view("success");
	      } else {
		console.log("problem with hash/pw/loginMarker.valid");
	      }
	    }
	    return res.view("failure");
	  });
	},
	
	status: function(req, res) {
	  console.log("In check status");
	  var loginMarker = sails.config.globals.myCache.get("loginMarker").loginMarker;
	  if(loginMarker){
	    hash = req.session.sessionHash;
	    sails.sockets.join(req.socket, hash);
	    var socketId = sails.sockets.id(req.socket);
	    loginMarker.socketId = socketId;
	    console.log('My socket ID is: ' + socketId);
	    res.json({
	      message: 'Subscribed to a fun room called '+hash+'!'
	    });
	    console.log('Subscribed to a fun room called '+hash+'!');
	    return res.send(200);
	  }
	  return res.send(400);
	},
	
	dashboard: function(req,res) {
	  var loginMarker = sails.config.globals.myCache.get("loginMarker").loginMarker;
	  sails.config.globals.myCache.del("loginMarker");
	  if(loginMarker && loginMarker.valid){
	    req.session.status == "good"
	    req.session.user = loginMarker.user.id;
	    console.log("Logged in!");
	    return res.view("dashboard", {id: loginMarker.user.id});
	  } else {
	    console.log("Not logged in, redirecting");
	    return res.redirect('/User/test#badLogin');
	  }
	}
};

