let Helper = require('../../front_dev/script/components/Helper.js').default;

describe('[HELPER COMPONENT]', function()  {
	it('should check for formatDate functionality', function() {
		let date = '2016-06-04T00:00:00Z';

		Helper.formatDate(date)
		expect(Helper.formatDate(date)).toBe('4/6/2016');
	});
});
