let Base = require('../../front_dev/script/components/Base.js').default;
let mediator = {
	subscribe: jasmine.createSpy('subscribe')
};
let temp = '<div></div>';
let selector = 'div';

base = new Base({temp, selector});

describe('[BASE COMPONENT]', function()  {
	it('should init base properties', function() {
		expect(base.temp).toBe(temp);
		expect(base.selector).toBe(selector);
	});

	it('should check for base instance functionality', function() {
		spyOn(document, 'querySelectorAll');
		base.instance;
		expect(document.querySelectorAll).toHaveBeenCalledWith(base.selector);
	});

	it('should check for html functionality', function() {
		let pages = [{
			hide: true,
			classList: 'prev',
			value: 3
		}];

		let str = `
			<ul class=pages>
				${pages.map(page => base.html`
					<li class=${page.hide ? 'hide ' : ''}${page.classList}>${page.value}</li>
				`)}
			</ul>
		`;

		expect(base.html`${str}`.replace(/\s/gi, ''))
			.toBe('<ul class=pages><li class=hide prev>3</li></ul>'.replace(/\s/gi, ''));
	});

	it('should check for _htmlEscape functionality', function() {
		let str = "&><\"'`";

		str = base._htmlEscape(str);

		expect(str).toBe('&amp;&gt;&lt;&quot;&#39;&#96;')
	});
});
