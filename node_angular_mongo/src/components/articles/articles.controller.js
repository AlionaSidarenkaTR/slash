let _articlesRestService;

class ArticlesController {
	constructor(articlesRestService) {
		_articlesRestService = articlesRestService;
	}

	$onInit() {
		let successCallback = (response) => {
			this.articles = response.articles;
		};
		let errorCallback = (err) => {
			throw new Error('smth went wrong, try once again');
		};

		return _articlesRestService.getAllArticles(successCallback, errorCallback);
	}

	auth(network) {
		let url = `/auth/${network}`,
			width = 1000,
			height = 650,
			top = (window.outerHeight - height) / 2,
			left = (window.outerWidth - width) / 2,
			windowParams = `width=${width}, height=${height}, scrollbars=0, top=${top}, left=${left}`;

		window.open(url, `${network}_login`, windowParams);
	}
}

export default ArticlesController;