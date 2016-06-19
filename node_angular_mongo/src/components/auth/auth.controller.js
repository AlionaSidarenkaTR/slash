let _sessionService,
	_authRestService;

class AuthController {
	constructor(authRestService, sessionService) {
		_sessionService = sessionService;
		_authRestService = authRestService;
	}

	sendFormData(e, data) {
		let successCallBack = (response) => {
			let user = JSON.parse(response.user);

			_sessionService.auth('success', user);
		};
		let errorCallBack = (response) => {
			this.message = response.data.message[0];
			_sessionService.auth('failure');
		};

		e.preventDefault();

		return _authRestService
			.authUser(this.action, data, successCallBack, errorCallBack);
	}
}

export default AuthController;