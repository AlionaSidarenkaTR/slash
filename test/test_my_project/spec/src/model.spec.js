let Model = require('../../front_dev/script/Model.js').default;
let mediator = {};

model = new Model(mediator);

describe('[MODEL COMPONENT]', function()  {
	afterAll(() => {
		model.page = 0;
		model.query = '';
	});

	it('should init model properties', function() {
		expect(model.page).toBe(0);
		expect(model.query).toBe('');
		expect(model.mediator).toEqual(mediator);
	});

	it('should check for currentPage to return right page', function() {
		model.page = 5;
		expect(model.currentPage).toBe(model.page);
		model.page = 0;
	});

	it('should check for queryValue functionality', function() {
		model.query = 'hello';
		expect(model.queryValue).toBe(model.query);
		model.query = '';
	});

	it('should check for resetPage functionality', function() {
		model.page = 5;
		model.resetPage();

		expect(model.page).toBe(0);
	});

	it('should check for changePage functionality', function() {
		let delta = 2;
		let currentPage = model.page;

		model.changePage(delta);

		expect(model.page).toBe(currentPage + delta);
	});

	it('should check for setQuery functionality', function() {
		let newQuery = 'test';
		model.setQuery(newQuery);

		expect(model.query).toBe(newQuery);
	});
});
