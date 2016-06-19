var Article = require('../models/article.js');

function saveArticle(req, res) {
	var title = req.body.title;
	var textarea = req.body.textarea;
	var author = req.body.author;
	var path = '';

	if (req.file) {
		path = req.file.filename;
	}

	var data = {
		author: author,
		text: textarea,
		title: title,
		image: path
	};

	var newArticle = new Article(data);
	newArticle.save(function(err) {
		if (err) {
			res.send({status: 'error', result: err});
		} else {
			res.send({status: 'success'});
		}
	});
}

module.exports = saveArticle;