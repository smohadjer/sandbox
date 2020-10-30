$(document).ready(function() {
	'use strict';

	var $header = $('header');
	var navItems = $('nav.secondary li a');

	var mouseoutId;
	var lastSctop = 0;
	var didScroll = false;
	var topPositionsArray = getTopPositions(navItems);

	setHandlers();

	setInterval(function() {
		if (didScroll) {
			didScroll = false;
			var scTop = $(window).scrollTop();
			var scrollDirection = (scTop > lastSctop) ? 'down' : 'up';
			lastSctop = scTop;
			scrollHandler(scTop, scrollDirection);
		}
	}, 250);

	function setHandlers() {
		$header.on('click', 'nav.secondary a', function(e) {
			e.preventDefault();
			scrollToHash($(this).attr('href'), $('html, body'));
		}).on('mouseenter', function() {
			clearTimeout(mouseoutId);
			$header.addClass('expanded');
		}).on('mouseleave', function() {
			mouseoutId = setTimeout(function() {
				$header.removeClass('expanded');
			}, 1000);
		});

		$(window).on('scroll', function() {
			didScroll = true;
		}).on('resize', function() {
			topPositionsArray.length = 0;
			topPositionsArray = getTopPositions(navItems);
		});
	}

	function scrollHandler(sctop, scrollDirection) {
		if (sctop > 10 && scrollDirection === 'down') {
			if ($header.hasClass('expanded')) {
				$header.removeClass('expanded');
			}
		} else {
			$header.addClass('expanded');
		}

		var index = getIndex(sctop, topPositionsArray);
		updateSelectedNavItem($('nav.secondary li'), index);
	}

	function scrollToHash(hash, $root) {
		var	sctop = $(hash).offset().top;

		$root.stop().animate({
			scrollTop: sctop
		}, 1000, 'easeOutCubic', function() {
			location.hash = hash;
		});
	}

	function getIndex(sctop, myArray) {
		var index = undefined;

		$(myArray).each(function(key, value) {
			if (sctop >= value) {
				if (key === myArray.length - 1) {
					index = key;
					return false;
				} else if (sctop < myArray[key+1]) {
					index = key;
					return false;
				}
			}
		});

		return index;
	}

	function updateSelectedNavItem($items, index) {
		if (index === undefined) {
			$items.removeClass('selected');
		} else {
			$items.eq(index).addClass('selected')
				.siblings().removeClass('selected');
		}
	}

	function getTopPositions($items) {
		var myArray = [];

		$items.each(function() {
			var hash = $(this).attr('href');
			var $selector = $(hash);

			if ($selector.length > 0) {
				myArray.push(parseInt($selector.offset().top));
			}
		});

		return myArray;
	}
});
