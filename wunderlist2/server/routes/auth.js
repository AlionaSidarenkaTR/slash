var User = require('../models/user.js');
var List = require('../models/list.js');
var Task = require('../models/task.js');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(router, passport) {

	//IDENTIFYING IF USER EXISTS
  	router.get('/id', function(req, res, next) {
		var userId = req.query.user_id;

		User.findOne({'_id': userId},
				function(err, user){
					if (err) {
						return res.send(err);
					};

					if (!user) {
						res.status(401);
						return res.send('No such user');
					};

					if (user) {
						return res.send(user);
					}
				}
			)
  	});
  	router.delete('/auth', function(req, res) {
        res.setHeader('content-type', 'text/plain');
        res.writeHead(200);
        req.logout();
        res.end();
    });

	//LOCAL LOGIN
	router.post('/login', function(req, res, next) {
		passport.authenticate('local-signin', function(err, user, info) {
		    if (err) {
		      	throw err // will generate a 500 error
		    }
		    // Generate a JSON response reflecting authentication status
		    if (!user) {
		    	res.status(401);
		      	return res.send({ state : 'failure', message : req.flash('loginMessage')});
		    }
		    return res.send({ state : 'success', user:user});
		})(req, res, next);
  	});

	//LOCAL SIGNUP
  	router.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
		    if (err) {
		      	throw err // will generate a 500 error
		    }
		    // Generate a JSON response reflecting authentication status
		    if (!user) {
		    	res.status(401);
		      	return res.send({ state : 'failure', message : req.flash('signupMessage')});
		    }
		    return res.send({ state : 'success', user: user});
		})(req, res, next);
  	});

	//FACEBOOK

	//it doesn't send email by default, so we need to request it
	router.get('/facebook',passport.authenticate('facebook', {scope:['email']}));

	router.get('/facebook/callback',
  		passport.authenticate('facebook', {
  			successRedirect: '/auth/success',
  			failureRedirect: '/auth/failure'
  		})
  	);

    //GOOGLE
    router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));

	router.get('/google/callback',
  		passport.authenticate('google', {
  			successRedirect: '/auth/success',
  			failureRedirect: '/auth/failure'
  		})
  	);

	router.get('/success', function(req, res) {
        res.render('after-auth', { state: 'success', user: req.user ? req.user : null });
    });

    router.get('/failure', function(req, res) {
        res.render('after-auth', { state: 'failure', user: null });
    });
}