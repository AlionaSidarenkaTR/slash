(function($){
	jQuery.fn.circleMircle = function(options) {
		var carousel = $(this[0]);
		var marginLeft = 0;
		var count = 0;
		var interval;
		var controlsContainer = $(options.controls);
		var controls = controlsContainer.children();
		var timer = null;
		var speed = options.speed || 4000;
		var timeoutSpeed = speed/2;
		var transition = timeoutSpeed/1000;


		function intervalFunc() {
			
			return setInterval(function() {
				if (count === options.count - 1) {
					marginLeft = 100;
					count = -1;
				}

				count++;
				marginLeft-= 100;
				carousel.css({'margin-left': marginLeft + '%'});
				setActiveControl();
			}, speed);
		}

		function setActiveControl() {
			controlsContainer.find('.active').toggleClass('active');
			controls.eq(count).addClass('active');
		}

		carousel.css({'transition': 'all ' + transition + 's ease'});

		if (options.auto) {
			interval = intervalFunc();
		}

		controlsContainer.on('click', 'li', function(e) {
			clearInterval(interval);

			count = controls.index(e.currentTarget);
			marginLeft = (-1) * (count * 100);

			if ($('html').is('.ie-lt-10')) {
				carousel.animate({'margin-left': marginLeft + '%'}, 200, function() {
				});
			} else {				
				carousel.css({'margin-left': marginLeft + '%'});
			}

			setActiveControl();

			if (!timer && options.auto) {
				timer = setTimeout(function() {
					interval = intervalFunc();
					timer = null;
				}, timeoutSpeed);
			}
		});
	};
})(jQuery);