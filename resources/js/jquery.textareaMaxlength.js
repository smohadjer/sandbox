/**
 * @name          textarea maxlength counter
 * @version       0.1
 * @lastmodified  2013-06-13
 * @package       html-css-js
 * @subpackage    jQuery plugin
 * @author        S.M.
 *
 * based on: http://jqueryboilerplate.com/
 */

;(function ($, window, document, undefined) {

	var pluginName = 'textareaMaxlength',
		defaults = {};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, defaults, options) ;
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// methods
	var methods = {
		init: function() {
			var pluginInstance = this;
			var $this = this.$element;
			$this.find('textarea').each(function() {
				var $textarea = $(this);
				var maxlength = parseInt($textarea.attr('maxlength'));
				var elm = $textarea.prevAll('.maxlength').find('span');

				//set initial value
				elm.text(maxlength);
				
				$textarea.on('keyup', function(e){
					var len = $textarea.val().length;		
					if (len > maxlength) {
					  $textarea.val($textarea.val().substring(0, maxlength));
					  elm.text(0);
					} else {
					  elm.text(maxlength - len);
					}			
				});
			});
			
		}
	};

	// event handlers
	var eventhandlers = {
		onEvent: function(e) {
		}
	};

	// build
	$.extend(Plugin.prototype, methods, eventhandlers);

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}

})(jQuery, window, document);