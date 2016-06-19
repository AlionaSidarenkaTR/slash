let Controller = require('../../src/controller.js');
let model = {
	read: jasmine.createSpy('read'),
	create: jasmine.createSpy('create'),
	update: jasmine.createSpy('update'),
	remove: jasmine.createSpy('remove'),
	getCount: jasmine.createSpy('getCount')
};
let view = {
	bind: jasmine.createSpy('bind'),
	render: jasmine.createSpy('render')
};
let controller= new Controller(model, view);
describe('[CONTROLLER COMPONENT]', function()  {

	it('should init controller property', function() {
		expect(controller.model).toEqual(model);
		expect(controller.view).toEqual(view);
	});

	it('should check for setView functionality', function() {
		spyOn(controller, '_updateFilter');

		let hash = '#/active';
		controller.setView(hash);
		expect(controller._updateFilter).toHaveBeenCalledWith('active');

		hash = '#/';
		controller.setView(hash);
		expect(controller._updateFilter).toHaveBeenCalledWith('');
	});

	it('should check for showAll, showActive and showCompleted functionality', function() {
		controller.showAll();
		expect(controller.model.read).toHaveBeenCalled();

		controller.showActive();
		expect(controller.model.read).toHaveBeenCalled();

		controller.showCompleted();
		expect(controller.model.read).toHaveBeenCalled();
	});

	it('should check for addItem functionality', function() {
		let title = '  	';
		controller.addItem(title);
		expect(controller.model.create).not.toHaveBeenCalled();

		title = 'new title';
		controller.addItem(title);
		expect(controller.model.create.calls.mostRecent().args[0]).toBe(title);
	});

	it('should check for editItem functionality', function() {
		let id = 1;
		controller.editItem(id);
		expect(controller.model.read.calls.mostRecent().args[0]).toBe(id);
	});

	it('should check for editItemSave functionality', function() {
		let id = 1;
		let title = 'test';
		spyOn(controller, 'removeItem');

		controller.editItemSave(id, title);
		expect(controller.model.update.calls.mostRecent().args.slice(0, 2))
			.toEqual([id, {title: title}]);

		title = '';
		controller.editItemSave(id, title);
		expect(controller.removeItem).toHaveBeenCalledWith(id);
	});

	it('should check for editItemCancel functionality', function() {
		let id = 1;
		controller.editItemCancel(id);
		expect(controller.model.read).toHaveBeenCalledWith(id, jasmine.any(Function));
	});

	it('should check for removeItem functionality', function() {
		let id = 1;
		spyOn(controller, '_filter');
		controller.removeItem(id);
		expect(controller.model.remove).toHaveBeenCalledWith(id, jasmine.any(Function));
	});

	it('should check for removeCompletedItems functionality', function() {
		spyOn(controller, '_filter');
		controller.removeCompletedItems();
		expect(controller.model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
		expect(controller._filter).toHaveBeenCalled();
	});

	it('should check for toggleComplete functionality', function() {
		spyOn(controller, '_filter');
		let id = 1;
		let completed = true;
		let silent = true;

		controller.toggleComplete(id, completed, silent);
		expect(controller.model.update).toHaveBeenCalledWith(id, {completed: true}, jasmine.any(Function));
		expect(controller._filter).not.toHaveBeenCalled();

		controller.toggleComplete(id, completed);
		expect(controller._filter).toHaveBeenCalled();
	});

	it('should check for toggleAll functionality', function() {
		spyOn(controller, '_filter');
		let completed = true;

		controller.toggleAll(completed);
		expect(controller.model.read).toHaveBeenCalledWith({completed: false}, jasmine.any(Function));
		expect(controller._filter).toHaveBeenCalled();
	});

	it('should check for _updateCount functionality', function() {
		controller._updateCount();
		expect(controller.model.getCount).toHaveBeenCalled();
	});

	it('should check for _filter functionality', function() {
		let force = true;
		spyOn(controller, '_updateCount');
		spyOn(controller, 'showActive');
		controller._activeRoute = "active";

		controller._filter(force);
		expect(controller._lastActiveRoute).toBe("Active");
		expect(controller.showActive).toHaveBeenCalled();
	});

	it('should check for _updateFilter functionality', function() {
		let currentPage = 'completed';
		controller._activeRoute = "active";

		spyOn(controller, '_filter');
		controller._updateFilter(currentPage);

		expect(controller._activeRoute).toBe("completed");
		expect(controller.view.render).toHaveBeenCalledWith('setFilter', currentPage);

		currentPage = '';
		controller._updateFilter(currentPage);

		expect(controller._activeRoute).toBe("All");
	});
});