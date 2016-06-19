let View = require('../../src/view.js');
let Helpers = require('../../src/helpers.js');
let handler = function() {};
let template;

describe('[VIEW COMPONENT]', () => {
	beforeAll(() => {
		template = {
			defaultTemplate: `
				<li data-id="{{id}}" class="{{completed}}">
					<div class="view">
						<input class="toggle" type="checkbox" {{checked}}>
						<label>{{title}}</label>
						<button class="destroy"></button>
					</div>
				</li>
			`
		};
		spyOn(Helpers, "$on");
		spyOn(Helpers, "$delegate");
		View = new View(template);
	});

	it('should init view properties', function() {
		expect(View.template).toEqual(template);
	});

	it('should check render functionality', function() {
		spyOn(View.viewCommands, "removeItem");
		View.render('removeItem', 1);

		expect(View.viewCommands.removeItem).toHaveBeenCalledWith(1);
	});

	it('should check for _bindItemEditDone functionality', function() {
		View._bindItemEditDone(handler);
		expect(Helpers.$delegate.calls.count()).toBe(2);
	});

	describe('should check bind functionality', function() {

		it('should check newToDo functionality', function() {
			View.bind('newTodo', handler);

			expect(Helpers.$on.calls.mostRecent().args[1]).toBe('change');
		});

		it('should check removeCompleted functionality', function() {
			View.bind('removeCompleted', handler);

			expect(Helpers.$on.calls.mostRecent().args.slice(1)).toEqual(['click', handler]);
		});

		it('should check toggleAll functionality', function() {
			View.bind('toggleAll', handler);

			expect(Helpers.$on.calls.mostRecent().args[1]).toBe('click');
		});

		it('should check itemEdit functionality', function() {
			View.bind('itemEdit', handler);

			expect(Helpers.$delegate.calls.mostRecent().args.slice(1, 3)).toEqual(['li label', 'dblclick']);
		});

		it('should check itemRemove functionality', function() {
			View.bind('itemRemove', handler);

			expect(Helpers.$delegate.calls.mostRecent().args.slice(1, 3)).toEqual(['.destroy', 'click']);
		});

		it('should check itemToggle functionality', function() {
			View.bind('itemToggle', handler);

			expect(Helpers.$delegate.calls.mostRecent().args.slice(1, 3)).toEqual(['.toggle', 'click']);
		});

		it('should check itemEditDone && itemEditCancel functionality', function() {
			spyOn(View, "_bindItemEditDone");

			['itemEditDone', 'itemEditCancel'].forEach((eventName) => {
				View.bind(eventName, handler);

				expect(View._bindItemEditDone).toHaveBeenCalledWith(handler);
			});
		});
	});
});