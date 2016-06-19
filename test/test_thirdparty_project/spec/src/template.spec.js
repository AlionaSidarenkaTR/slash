let Template = require('../../src/template.js');
Template = new Template();

describe('[TEMPLATE COMPONENT]', function()  {
	it('should init template properties', function() {
		expect(Template.defaultTemplate).toBeDefined();
	});

	it('should check for show functionality', function() {
		let data = [{
			id: 1,
			title: 'test',
			completed: true,
			checked: true
		}, {
			id: 2,
			title: 'test2'
		}];

		let template = '<li data-id="1" class="completed">\
			<div class="view">\
				<input class="toggle" type="checkbox" checked>\
				<label>test</label>\
				<button class="destroy"></button>\
			</div>\
			</li><li data-id="2" class="">\
				<div class="view">\
					<input class="toggle" type="checkbox">\
					<label>test2</label>\
					<button class="destroy"></button>\
				</div>\
			</li>';

		expect(Template.show(data).replace(/\s/gi, '')).toBe(template.replace(/\s/gi, ''));
	});

	it('should check for itemCounter functionality', function() {
		let activeTodos = 2;
		expect(Template.itemCounter(activeTodos)).toBe('<strong>2</strong> items left')

		activeTodos = 1;
		expect(Template.itemCounter(activeTodos)).toBe('<strong>1</strong> item left')
	});

	it('should check for clearCompletedButton functionality', function() {
		let completedTodos = 2;
		expect(Template.clearCompletedButton(completedTodos)).toBe('Clear completed');

		completedTodos = 0;
		expect(Template.clearCompletedButton(completedTodos)).toBe('');
	});
});