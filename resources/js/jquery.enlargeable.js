/**
 * @name          enlargeable
 * @version       0.1
 * @package       js
 * @subpackage    jQuery plugin
 * @author        VI
 *
 *
 */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'enlargeable',
		defaults = {};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	// methods
	var methods = {
		init: function() {
			var pluginInstance = this;
			//var $slider = pluginInstance.$element.find('.bxslider');

			/*
			if ($slider.length) {
				pluginInstance.hasSlider = true;
				pluginInstance.$slider = $slider;
			}
			*/

			//add close button
			/*
			if (pluginInstance.$element.attr('data-close')) {
				var $figure = pluginInstance.$element.find('> figure');
				var close = pluginInstance.$element.data('close');
				var closeButton = '<span class="icon-close">' + close + '</span>';

				if ($figure.hasClass('slider-poster')) {
					pluginInstance.$element.find('.image-slider').append(closeButton);
				} else {
					$figure.append(closeButton);
				}

				pluginInstance.$close = pluginInstance.$element.find('.icon-close');

			}
			*/

			pluginInstance.$element.on('transitionend', function(e) {
				if (e.originalEvent.propertyName !== 'width') {
					return;
				}

				pluginInstance.resize();
			});

			pluginInstance.$element.on('click', function() {
				if ($(window).width() < 600) {
					return;
				}

				if (pluginInstance.$element.hasClass('page-wide')) {
					pluginInstance.$element.addClass('is-resizing').removeClass('page-wide');

					var $video = pluginInstance.$element.find('video');

					if ($video.length) {
						$video.trigger('pause');
					}


				} else {
					pluginInstance.$element.addClass('page-wide is-resizing');

					/*
					if (!Modernizr.csstransitions) {
						pluginInstance.resize();
					}
					*/
				}
			});

			/*
			pluginInstance.$element.on('click', '.icon-close', function(e) {
				e.stopPropagation(); //to avoid triggerling click on .enlargeable

				pluginInstance.$element.addClass('is-resizing').removeClass('page-wide');

				var $video = pluginInstance.$element.find('video');

				if ($video.length) {
					$video.trigger('pause');
				}
			});

			if (pluginInstance.hasSlider) {
				$(window).on('resize', function() {
					//we use setTimeout to make sure bxslider has already resized
					setTimeout(function() {
						pluginInstance.positionCloseButton();
					}, 100);
				});

				pluginInstance.$element.on('onSlideBefore', function(e, $slider, oldIndex, newIndex, slideDirection) {
					var infiniteLoop = (pluginInstance.$element.find('.bxslider').data('endless') !== false);

					oldIndex = infiniteLoop ? oldIndex + 1 : oldIndex;
					var $currentSlide = $slider.find('.slider-element').eq(oldIndex);
					var $targetSlide = $currentSlide.next('.slider-element');

					if (slideDirection === 'backward') {
						$currentSlide.find('figcaption').fadeOut(300);
					} else {
						$targetSlide.find('figcaption').hide().delay(500).fadeIn(500);
					}

					pluginInstance.positionCloseButton(newIndex);
				});

				pluginInstance.$element.on('onSlideAfter', function(e, $slider, oldIndex, newIndex) {
					$slider.find('.slider-element figcaption').show();
				});
			}
			*/
		},

		/*
		positionCloseButton: function(index) {
			var pluginInstance = this;
			var $slides = pluginInstance.$slider.find('.slider-element').not('.bx-clone');
			var $currentSlide = $slides.eq(index);

			pluginInstance.$close.css({
				top: $currentSlide.find('figure img').height(),
				bottom: 'auto'
			});
		},
		*/

		resize: function() {
			var pluginInstance = this;

			pluginInstance.$element.removeClass('is-resizing');

			if (pluginInstance.$element.hasClass('page-wide')) {
				pluginInstance.$element.addClass('is-enlarged');

				/*
				if (pluginInstance.hasSlider) {
					pluginInstance.$slider.data('slider').reloadSlider();
					pluginInstance.positionCloseButton(0);
				}
				*/
			} else {
				pluginInstance.$element.removeClass('is-enlarged');
			}
		}
	};

	// build
	$.extend(Plugin.prototype, methods);

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
