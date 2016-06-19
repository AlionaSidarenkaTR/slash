let instance;

class User {
	constructor({name}) {
		if (!instance) {
			instance = this;
		}
		this.name = name;

		return instance;
	}
}

export default User;
