/*
 * @name          pluginTemplate
 * @version       1.0
 * @lastmodified  2016-11-22
 * @author        Saeid Mohadjer
 *
 * Licensed under the MIT License
 */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'pluginTemplate',
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
