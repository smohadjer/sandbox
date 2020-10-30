$(document).ready(function() {
	$('.sticky').sticky();

	var $root = $('html, body');

	$('nav.secondary').on('click', 'a', function(e) {
		e.preventDefault();

		var sctop = 0;

		if (!$(this).parent('li').hasClass('top')) {
			sctop = $( $.attr(this, 'href') ).offset().top;
		}

		scrollToHash($(this).attr('href'), sctop);
	});

	function scrollToHash(hash, sctop) {
		$root.stop().animate({
			scrollTop: sctop
		}, 1000, 'easeOutCubic', function() {
			console.log($(window).scrollTop());
			window.location.hash = hash;
		});
	}
});

$.fn.sticky = function() {
	var $this = $(this);
	var top = $this.offset().top;
	var $topLink = $('li.top');

	$(window).on('scroll', function() {
		if ($(window).scrollTop() > top) {
			$this.addClass('fixed');
			$topLink.fadeIn('fast');
		} else {
			$this.removeClass('fixed');
			$topLink.fadeOut('fast');
		}
	});
};
