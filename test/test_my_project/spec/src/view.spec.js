let View = require('../../front_dev/script/View.js').default;
let InstanciesFactory = require('../../front_dev/script/utils/InstanciesFactory.js').default;
let mediator = {
	subscribe: jasmine.createSpy('subscribe')
};

view = new View(mediator);

describe('[VIEW COMPONENT]', function()  {
	it('should init view properties', function() {
		expect(view.mediator).toEqual(mediator);
		expect(view.mediator.subscribe).toHaveBeenCalledWith('articles.changed', view.render, view);
	});

	it('should check for base getters functionality', function() {
		spyOn(InstanciesFactory, 'createInstance');
		['header', 'section', 'footer', 'resultsCount', 'searchInput', 'pagination']
			.forEach((item) => {
				view[item];
				expect(InstanciesFactory.createInstance).toHaveBeenCalled();
			});
	});
});
