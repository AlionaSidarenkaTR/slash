let User = require('../../front_dev/script/components/User.js').default;
let name = 'Aliona';

let user = new User({name});

describe('[USER COMPONENT]', function()  {
	it('should init user properties', function() {
		expect(user.name).toBe(name);
	});

	it('should be a singleton', function() {
		let newName = 'Vasiliy';
		let newUser = new User({newName});

		expect(name).toEqual(newUser.name);
	});
});
