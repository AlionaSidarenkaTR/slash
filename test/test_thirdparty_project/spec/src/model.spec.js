let Model = require('../../src/model.js');
let Store = {
	save: jasmine.createSpy('saves'),
	find: jasmine.createSpy('find'),
	findAll: jasmine.createSpy('findAll'),
	remove: jasmine.createSpy('remove'),
	drop: jasmine.createSpy('drop')
};

Model = new Model(Store);

describe('[MODEL COMPONENT]', () => {
	let callback = function() {};

	it('should contain storage as param', () => {
		expect(Model.storage).toBe(Store);
	});

	it('should create new item and pass it to storage for save', () => {
		let title = 'Hello';
		Model.create(title, callback);

		expect(Store.save).toHaveBeenCalledWith(jasmine.objectContaining({
			title: title
		}), callback);
	});

	describe('[READ PROPERTY]', () => {

		it('should check functionality if query is function', () => {
			let query = function() {};
			Model.read(query);

			expect(Store.findAll).toHaveBeenCalled();
			expect(Store.findAll).toHaveBeenCalledWith(query);
		});

		it('should check functionality if query is string or number', () => {
			['5', 6].forEach((query) => {
				Model.read(query, callback);

				expect(Store.find).toHaveBeenCalledWith(jasmine.objectContaining({
					id: parseInt(query)
				}), callback);
			})
		})

		it('should check functionality if query is an object', () => {
			let query = {
				foo: 'bar',
				hello: 'world'
			};
			Model.read(query, callback);

			expect(Store.find).toHaveBeenCalledWith(query, callback);
		});
	});

	it('should execute update property with definite params', () => {
		let id = 11;
		let data = {
			foo: 'bar',
			hello: 'world'
		};
		Model.update(id, data, callback);

		expect(Store.save).toHaveBeenCalledWith(data, callback, id);
	});

	it('should execute remove property with definite params', () => {
		let id = 11;
		let data = {
			foo: 'bar',
			hello: 'world'
		};
		Model.remove(id, callback);

		expect(Store.remove).toHaveBeenCalledWith(id, callback);
	});

	it('should execute removeAll property with definite params', () => {
		Model.removeAll(callback);

		expect(Store.drop).toHaveBeenCalledWith(callback);
	});

	it('should execute getCount property with definite params', () => {
		Model.getCount(callback);

		expect(Store.findAll).toHaveBeenCalled();
	});
});