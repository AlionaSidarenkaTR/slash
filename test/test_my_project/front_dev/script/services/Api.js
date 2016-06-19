import Rest from './../utils/Rest';

class Api {
	static getArticles(pageNum = 0, q = '') {
		let params = new Map();
		let paramsStr = '';

		params.set('page', pageNum);
		q === '' ? params.delete(q) : params.set('q', q);

		for (let entry of params) {
			paramsStr+= `${entry[0]}=${entry[1]}&`;
		}

		paramsStr = paramsStr.slice(0, -1);
		let url = `http:\/\/api.nytimes.com/svc/search/v2/articlesearch.json?${paramsStr}&api-key=${API_KEY}`;

		return Rest.get(url);
	}
}

export default Api;
