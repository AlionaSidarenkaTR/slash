import AuthController from './auth.controller';

class AuthComponent {
	constructor () {
		this.templateUrl = 'src/components/auth/auth.html';
		this.controller = AuthController;
		this.controllerAs = 'auth';
		this.bindings = {
			action: '<'
		};
	}
}

export default AuthComponent;