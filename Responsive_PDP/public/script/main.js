(function() {
	$('.carousel').circleMircle({
		count: 4, 
		auto: false, 
		controls: '.control-squares', 
		speed: 4000
	});

	$('.menu-icon').on('click', function() {
		$('.top-menu').toggleClass('rotation');
		$(this).addClass('scaling-animation');
	});

	$('.menu-icon').on('webkitAnimationEnd', function() {
		$(this).removeClass('scaling-animation');
	});

	//ie 8 fix for bg-images and nth-childs
	if ($('html').is('.ie-lt-10')) {
		$('.carousel-container .carousel li').each(function(index, item) {
			$(item).addClass('bg-' + (index + 1));
		});
		
	} 

	$(window).scroll(function() {
		var wScroll = $(this).scrollTop();

		$('.text').css({
			'transform': 'translate(0px, ' + wScroll/10 + '%)'
		});

		$('.button').css({
			'transform': 'translate(-50%, ' + wScroll/4 + '%)'
		});

		if (wScroll > $('.companies').offset().top - $(window).height()) {
			$('.companies').css({'background-position': 'center ' + -wScroll/5 + 'px'});
		}
		if (!$('html').is('.ie-lt-10')) {
			if (wScroll > ($('.companies').offset().top - $(window).height()/1.5)) {
				$('.companies-logos li').each(function(index, item) {
					setTimeout(function() {
						item.classList.add('is-showing');
					}, 150 * (index + 1));
				});
			}
		}
	})
})()