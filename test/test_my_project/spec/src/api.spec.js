let Api = require('../../front_dev/script/services/Api.js').default;
let Rest = require('../../front_dev/script/utils/Rest.js').default;

describe('[API COMPONENT]', function()  {
	it('should check for getArticles functionality', function() {
		let pageNum = 3;
		let q = 'test';
		let url = `http:\/\/api.nytimes.com/svc/search/v2/articlesearch.json?page=${pageNum}&q=${q}&api-key=${API_KEY}`;

		spyOn(Rest, 'get');
		Api.getArticles(pageNum, q);
		expect(Rest.get).toHaveBeenCalledWith(url);

		q = '';
		url = `http:\/\/api.nytimes.com/svc/search/v2/articlesearch.json?page=${pageNum}&api-key=${API_KEY}`;
		Api.getArticles(pageNum, q);
		expect(Rest.get).toHaveBeenCalledWith(url);

	});
});
