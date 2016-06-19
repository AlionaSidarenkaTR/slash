function redirectAuthenticated() {

	return function(req, res, next) {
		if (!req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/articles');
		}
	}
}

module.exports = redirectAuthenticated;