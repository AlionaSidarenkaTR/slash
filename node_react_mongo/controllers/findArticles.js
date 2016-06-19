var Article = require('../models/article.js');

function findArticle(req, res) {
	Article.find({}, function(error, articles) {
		if (error) {
			res.send({error: error});
		} else {
			res.send({articles: articles, user: req.session.user});
		}
	});
}

module.exports = findArticle;