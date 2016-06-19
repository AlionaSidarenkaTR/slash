let Helpers = require('../../src/helpers.js');

describe('[HELPERS COMPONENT]', function()  {
	beforeEach(() => {

	});

	it('should init helpers property', function() {
		expect(Helpers.$on).toBeDefined();
		expect(Helpers.qs).toBeDefined();
		expect(Helpers.qsa).toBeDefined();
		expect(Helpers.$delegate).toBeDefined();
		expect(Helpers.$parent).toBeDefined();
	});
});