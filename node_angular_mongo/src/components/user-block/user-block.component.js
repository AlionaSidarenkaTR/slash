import UserBlockController from './user-block.controller';

class UserBlockComponent {
	constructor() {
		this.templateUrl = 'src/components/user-block/user-block.html';
		this.controller = UserBlockController;
		this.controllerAs = 'userBlockCtrl';
	}
}

export default UserBlockComponent;