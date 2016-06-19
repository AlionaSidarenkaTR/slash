let $$resource

class AuthRestService {
	constructor($resource) {
		$$resource = $resource('/logout', {}, {
			logout: {
				method: 'DELETE'
			}
		});
	}

	logout(successCallback, errorCallback) {
		return $$resource
			.logout(successCallback, errorCallback);
	}
}

export default AuthRestService;