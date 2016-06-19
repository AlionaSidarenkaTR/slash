var redirectAuthenticated = require('../controllers/redirectAuthenticated');

module.exports = function(router, passport) {

	router.post('/local-login', function(req, res, next) {
	  	passport.authenticate('local-signin', function(err, user, info) {
			if (err) {
			  	throw err // will generate a 500 error
			}
			// Generate a JSON response reflecting authentication status
			if (!user) {
				res.status(401);
			  	return res.send({message : req.flash('loginMessage')});
			}

			req.session.user = user;
			return res.send({user: JSON.stringify(user)});
		})(req, res, next);
	});

	router.post('/local-signup', function(req, res, next) {
	  	passport.authenticate('local-signup', function(err, user, info) {
			if (err) {
			  	throw err // will generate a 500 error
			}
			// Generate a JSON response reflecting authentication status
			if (!user) {
				res.status(401);
			  	return res.send({message : req.flash('signupMessage')});
			}
			req.session.user = user;

			return res.send({user: JSON.stringify(user)});
		})(req, res, next);
	});

	//FACEBOOK

	//it doesn't send email by default, so we need to request it
	router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

	router.get('/facebook/callback',
  		passport.authenticate('facebook', {
  			successRedirect: '/auth/success',
  			failureRedirect: '/auth/failure'
  		})
  	);

    //GOOGLE
    router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	router.get('/google/callback',
  		passport.authenticate('google', {
  			successRedirect: '/auth/success',
  			failureRedirect: '/auth/failure'
  		})
  	);

  	router.get('/success', function(req, res) {
		req.session.user = req.user;
        res.render('after-auth', { state: 'success', user: req.user ? JSON.stringify(req.user) : null });
    });

    router.get('/failure', function(req, res) {
    	res.status(401);
        res.render('after-auth', { state: 'failure', user: null });
    });
}
