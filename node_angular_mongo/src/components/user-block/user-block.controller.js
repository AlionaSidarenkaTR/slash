let $$state,
	_sessionService;

class UserBlockController {
	constructor(userBlockRestService, sessionService, $state) {
		this.userBlockRestService = userBlockRestService;
		$$state = $state;
		_sessionService = sessionService;
	}

	$onInit() {
		this.user = _sessionService.currentUser;
	}

	logout() {
		let successCallback = (response) => {
			_sessionService.logout();
		};
		let errorCallback = (err) => {
			throw new Error('couldn\'t logout');
		};

		this.userBlockRestService.logout(successCallback, errorCallback);
	}
}

export default UserBlockController;