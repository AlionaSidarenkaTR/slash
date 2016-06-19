let Todo = require('../../src/app.js');
let Helpers = require('../../src/helpers.js');

describe('[APP COMPONENT]', function()  {
	let todo;

	beforeEach(() => {
		spyOn(Helpers, '$on');
		todo = new Todo('Test name');
	});

	it('should init app property', function() {
		expect(todo.storage).toBeDefined();
		expect(todo.model).toBeDefined();
		expect(todo.template).toBeDefined();
		expect(todo.view).toBeDefined();
		expect(todo.controller).toBeDefined();
	});
});
