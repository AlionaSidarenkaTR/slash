function redirectAuthenticated() {

	return function(req, res, next) {
		if (!req.isAuthenticated()) {
			next();
		}
	}
}

module.exports = redirectAuthenticated;