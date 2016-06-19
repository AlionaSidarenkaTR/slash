let $$resource

class AuthRestService {
	constructor($resource) {
		$$resource = $resource('/articles/all/:id', {id: '@id'}, {
			getAllArticles: {
				method: 'GET'
			}
		});
	}

	getAllArticles(successCallback, errorCallback) {
		return $$resource
			.getAllArticles({}, successCallback, errorCallback);
	}
}

export default AuthRestService;