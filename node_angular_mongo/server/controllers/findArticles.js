var Article = require('../models/article.js');

function findArticle(req, res) {
	Article.find({}, function(error, articles) {
		if (error) {
			throw new Error(error);
		} else {
			res.send({articles: articles});
		}
	});
}

module.exports = findArticle;