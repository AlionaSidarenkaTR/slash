let MainController = require('../../front_dev/script/controllers/MainController.js').default;
let mediator = {
	subscribe: jasmine.createSpy('subscribe')
};
let model = {};
let view = {};

ctrl = new MainController(model, view, mediator);

describe('[MAIN CONTROLLER COMPONENT]', function()  {
	it('should init mainController properties', function() {
		expect(ctrl.mediator).toEqual(mediator);
		expect(ctrl.model).toEqual(model);
		expect(ctrl.view).toEqual(view);
	});

	it('should check for subscribe functionality', function() {
		ctrl.subscribe();

		expect(ctrl.mediator.subscribe.calls.count()).toBe(2);
		expect(ctrl.mediator.subscribe.calls.allArgs())
			.toEqual([['pagination.clicked', jasmine.any(Function), ctrl], [
				'searchInput.keydown', jasmine.any(Function), ctrl]]);
	});
});
