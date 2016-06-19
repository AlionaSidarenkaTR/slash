var multer = require('multer');
var upload = multer({dest: 'public/uploads'});
var saveArticle = require('../controllers/saveArticle');
var findArticleById = require('../controllers/findArticleById');
var findArticles = require('../controllers/findArticles');
var requireRole = require('../controllers/requireRole');

module.exports = function(router) {

	/* GET home page. */
	router.get('/', function(req, res, next) {
		findArticles(req, res);
	});

	router.post('/add', upload.single('file'), function(req, res, next) {
		saveArticle(req, res);
	});

	router.get('/:id', function(req, res, next) {
		findArticleById(res, req);
	});
}