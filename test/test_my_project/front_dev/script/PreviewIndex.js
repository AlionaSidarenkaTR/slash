import './../style/common.less';
import './../style/button.less';

(function() {
	'use strict';

	document.querySelector('#get-articles').addEventListener('click', function(e) {
		require.ensure(['./MainIndex'], function(require) {
			require('./MainIndex');
		});
	});
})();