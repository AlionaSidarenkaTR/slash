let $$resource

class AuthRestService {
	constructor($resource) {
		$$resource = $resource('/articles/all/:id', {id: '@id'}, {
			getArticle: {
				method: 'GET'
			}
		});
	}

	getArticle(id, successCallback, errorCallback) {
		return $$resource
			.getArticle({id: id}, successCallback, errorCallback);
	}
}

export default AuthRestService;