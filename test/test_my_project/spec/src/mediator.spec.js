let Mediator = require('../../front_dev/script/services/Mediator.js').default;
let mediator = new Mediator();
let callback = jasmine.createSpy();
let context = {};

describe('[MEDIATOR COMPONENT]', function()  {
	it('should check for base properties', function() {
		expect(mediator.eventBus).toEqual({});
	});

	it('should check for subscribe functionality', function() {
		mediator.subscribe('click', callback, context);

		expect(mediator.eventBus['click']).toEqual([{callback, context}]);

		mediator.subscribe('click', callback, context);
		expect(mediator.eventBus['click'].length).toBe(2);
	});

	it('should check for onNext functionality', function() {
		let args = ['test1', 'test2'];
		mediator.onNext('click', args);
		expect(callback).toHaveBeenCalledWith(args);
		expect(callback.calls.count()).toBe(2);
	});

	it('should check for dismiss functionality', function() {
		expect(mediator.eventBus['click'].length).toBe(2);
		mediator.dismiss('click', callback, context);
		expect(mediator.eventBus['click'].length).toBe(0);
	});
});