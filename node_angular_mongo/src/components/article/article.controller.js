let $$state,
	_articleRestService;

class ArticleController {
	constructor(articleRestService, $state) {
		_articleRestService = articleRestService;
		$$state = $state;
	}

	$onInit() {
		let successCallback = (response) => {
			this.article = response.article;
		};
		let errorCallback = (err) => {
			throw new Error('smth went wrong, try once again');
		};

		return _articleRestService
			.getArticle($$state.params.articleId, successCallback, errorCallback);
	}
}

export default ArticleController;