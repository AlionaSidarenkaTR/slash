var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user.js');
var List = require('../models/list.js');
var ObjectId = require('mongoose').Types.ObjectId;

var configAuth = require('../config/auth.js');

module.exports = function(passport){
	// serialize user (session data is just a userName)
	passport.serializeUser(function(user, done){
		done(null, user.email);
	});
	// deserialize user (looking at name and give all info ab user)
	passport.deserializeUser(function(email, done){
		//not give token and so on
		User.findOne({'email': email}, function(err, user) {
	        done(err, user)
	    });
	});

	passport.use('local-signup', new LocalStrategy({
		//if we want to rewrite default fields username and password
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		// asynchronous nodejs func - unless data is sent back or rlook up in the dataabse won't fire
		process.nextTick(function(){
			User.findOne({'email': email}, function(err, user){

				if(err){
					return done(err);
				};

				if (user){
					//null error send false to passport as this user is invalid
					return done(null, false, req.flash('signupMessage', 'This email already taken'));
				} else {
					var newUser = new User();
					newUser.assignPropertes(email, password);
					newUser.save(function(err){
						if(err){
							throw err;
						} else {
							var list = new List();
							list.saveList({name: 'inbox', owner_id: newUser._id, owner_email: newUser.email});
							return done(null, newUser);
						}
					});

				}
			})
		})
	}));

	passport.use('local-signin', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'email': email}, 
				function(err, user){
					if(err){
						return done(err);
					};

					if (!user){

						return done(null, false, req.flash('loginMessage', 'Incorrect email'));
					};

					if (!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'Incorrect password'));
					} else {
						return done(null, user);
					}
				}
			)
		})

	}));
	passport.use('facebook', new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    profileFields: ["id","emails","name"],
	    passReqToCallback: true
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		if(!req.user) {
		    		User.findOne({'id': profile.id}, function(err, user){
		    			if(err) {
		    				return done(err);
		    			};

		    			if(user)
		    				return done(null, user);
		    			else {

		    				var newUser = new User();
		    				var name = profile.name.givenName + ' ' + profile.name.familyName;
		    				var email = profile.emails[0].value;
		    				newUser.assignPropertes(email, null, name, profile.id, accessToken);
		    				newUser.save(function(err){
		    					if(err) {
		    						throw err;
		    					}
		    					var list = new List();
								list.name = 'inbox';
								list.save();
		    					return done(null, newUser);
		    				})
		    			}
		    		});
		    	} else {

		    		var user = req.user;

		    		user.id = profile.id;
    				user.token = accessToken;
    				user.name = profile.name.givenName + ' ' + profile.name.familyName;
    				user.email = profile.emails[0].value;

    				user.save(function(err){
    					if(err)
    						throw err;
    					return done(null, user);
    				})
		    	}
	    	});
	    }
	));
	passport.use('google', new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    				var newUser = new User();
	    				var email = profile.emails[0].value;
						newUser.assignPropertes(email, null, profile.displayName, profile.id, accessToken);
	    				newUser.save(function(err){
	    					if(err) {
	    						throw err;
	    					}
	    					var list = new List();
							list.name = 'inbox';
							list.save();
	    					return done(null, newUser);
	    				})
	    			}
	    		});
	    	});
	    }
	));
}
