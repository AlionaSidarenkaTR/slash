let $$resource

class AuthRestService {
	constructor($resource) {
		$$resource = $resource('/auth/local-:action', {action: '@action'}, {
			authorize: {
				method: 'POST'
			}
		});
	}

	authUser(action, data, successCallback, errorCallback) {
		return $$resource
			.authorize({action: action}, data, successCallback, errorCallback);
	}
}

export default AuthRestService;