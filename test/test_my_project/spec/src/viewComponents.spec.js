let InputComponent = require('../../front_dev/script/components/InputComponent.js').default;
let Pagination = require('../../front_dev/script/components/Pagination.js').default;
let Section = require('../../front_dev/script/components/Section.js').default;

let inputConfig = {
	type: 'text',
	className: 'new-input',
	placeholder: 'enter',
	selector: '.input'
};
let paginationConfig = {
	temp: '<ul class="pages"><li>0</li></ul>',
	selector: '.pages'
};
let sectionConfig = {
	temp: '<ul class="articles"><li><p>Title</p></li></ul>',
	selector: '.articles'
};

let input = new InputComponent(inputConfig);
let pagination = new Pagination(paginationConfig);
let section = new Section(sectionConfig);

describe('[VIEW COMPONENTS]', function()  {
	it('should check for component properties', function() {
		expect(input.temp).toBe('<input type=text class=new-input placeholder=enter></input>');
		expect(input.selector).toBe(inputConfig.selector);
		expect(pagination.temp).toBe(paginationConfig.temp);
		expect(pagination.selector).toBe(paginationConfig.selector);
		expect(section.temp).toBe(sectionConfig.temp);
		expect(section.selector).toBe(sectionConfig.selector);
	});

	it('should inherit functionality from Base', function() {
		[input, pagination, section].forEach((item) => {
			expect(item.createInnerTemp).toBeDefined();
			expect(item.addListener).toBeDefined();
			expect(item.html).toBeDefined();
		});
	});

	it('should check for draw functionality', function() {
		spyOn(pagination, 'html');
		spyOn(section, 'html');

		pagination.drawPages();
		expect(pagination.html).toHaveBeenCalled();

		section.drawArticles([]);
		expect(section.html).toHaveBeenCalled();
	});
});
