var Article = require('../models/article.js');

function findArticleById(res, req) {
	var id = req.params.id;

	Article.findById(id, function(error, article) {
		if (error) {
			res.send({error: error});
		} else {
			res.send({article: article})
		}
	});
}

module.exports = findArticleById;