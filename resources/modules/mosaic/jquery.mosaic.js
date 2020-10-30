/**
 * @name				Purpose Statement Mosaic
 * @version				0.1
 * @lastmodified		2013-07-29
 * @package				html-css-js
 * @subpackage			jQuery plugin
 * @author				SM, VI
*/

;(function ($, window, document, undefined) {

	var pluginName = 'mosaic',
		defaults = {};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, defaults, options) ;
		this._defaults = defaults;
		this._name = pluginName;
		this.tileHeight;
		this.banner = this.$element.find('#banner');
		this.init();		
	}

	// methods
	var methods = {
		init: function() {
			var pluginInstance = this;
			var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
			pluginInstance.$element.find('.tile').not('#banner').last().addClass('last');			
			
			//window resize
			$(window).on('resize', function() {
				pluginInstance.setTilesHeight();
				pluginInstance.$element.find('.tile:not(#see_all) .detail').hide();
				if (isSafari) pluginInstance.fixSafariSubpixelBug();
			});	
			pluginInstance.setTilesHeight();
				
			
			//add close button to detail layer
			pluginInstance.$element.find('.tile:not(#see_all) .detail').each(function() {
				$(this).prepend('<span class="icon-close"></span>');
			});
									
			//set media queries
			(function() {
				var mql0 = window.matchMedia('screen and (max-width: 599px)');
				var mql1 = window.matchMedia('screen and (min-width: 600px) and (max-width:767px)');
				var mql2 = window.matchMedia('screen and (min-width: 768px)');	
				var mql3 = window.matchMedia('screen and (min-width: 600px)');				
				
				mql0.addListener(function(obj) {
					pluginInstance.matchMediaHandler0_599(obj);
				});
				mql1.addListener(function(obj) {
					pluginInstance.matchMediaHandler600_767(obj);
				});
				mql2.addListener(function(obj) {
					pluginInstance.matchMediaHandler768(obj);
				});
				mql3.addListener(function(obj) {
					pluginInstance.matchMediaHandler600_(obj);
				});
				
				pluginInstance.matchMediaHandler0_599(mql0);
				pluginInstance.matchMediaHandler600_767(mql1);
				pluginInstance.matchMediaHandler768(mql2);	
				pluginInstance.matchMediaHandler600_(mql3);					
			})();
			
			pluginInstance.$element.find('.tile').css({
				visibility: 'visible'
			});
			
			if (isSafari) pluginInstance.fixSafariSubpixelBug(); 			
		},
		
		fixSafariSubpixelBug: function() {	
			var mql0 = window.matchMedia('screen and (max-width: 599px)');
			var mql1 = window.matchMedia('screen and (min-width: 600px) and (max-width:767px)');
			var mql2 = window.matchMedia('screen and (min-width: 768px)');	
				
			var stageW = $('#mosaic').width();			
			var tileSize = 0;
			var minTileWidth = 0;
			var rem = 0;
			var bannerSizeFactor = 0;
			var rows = [];
			var rowCount = 0;
			var $tiles = $('.wrapper .tile');

			if (mql0.matches) { 
				tileSize = 25/100; 
				tilesInRow = 4;				
				bannerSizeFactor = 4; 
				rowCount = 2;
				rows = [[],[]];
				
				//put tiles in array
				$tiles.each(function(index) {
					if (index < 4) {
						rows[0].push($(this));
					} else if (index < 8) {
						rows[1].push($(this));
					} 
				});
				
				$('#banner').width('100%');
			}			
			
			if (mql1.matches) { 
				tileSize = 1/3; 
				tilesInRow = 3;				
				bannerSizeFactor = 2; 
				rowCount = 3;
				rows = [[],[],[]];
				
				//put tiles in array
				$tiles.each(function(index) {
					if (index < 3) {
						rows[0].push($(this));
					} else if (index < 5) {
						rows[1].push($(this));
					} else if (index < 8) {
						rows[2].push($(this));
					}
				});
			}
			
			if (mql2.matches) { 
				tileSize = 20/100; 
				tilesInRow = 5;
				bannerSizeFactor = 3; 
				rowCount = 2;
				rows = [[],[]];
				
				//put tiles in array
				$tiles.each(function(index) {
					if (index < 5) {
						rows[0].push($(this));
					} else if (index < 8) {
						rows[1].push($(this));
					}
				});
			}
			
			minTileWidth = Math.floor(stageW * tileSize);
			rem = stageW % tilesInRow;
			$tiles.width(minTileWidth);
			$tiles.filter('#banner').width(minTileWidth * bannerSizeFactor);			
	
			if (rem != 0) {
				for (var i=0; i<rows.length; i++) {
					fixRow(rows[i], rem);					
				}				
			} 			
			$tiles.height(minTileWidth);
			
			function fixRow(row, rem) {	
				var rowHasBanner = false;
				$.each(row, function(index, value) {
					if (value.attr('id') == 'banner') {
						rowHasBanner = true;
						return false;
					}
				});
				
				if (!rowHasBanner) {	
					var count = 0;	
					while (rem > 0) {
						row[count].width(minTileWidth+1);
						count++;
						rem--;
					}
				} else {
					$tiles.filter('#banner').width(minTileWidth * bannerSizeFactor + rem);
				}
			}
		},	
		
		showDetailLayer: function($tile, isFullSize) {
			var pluginInstance = this;
			
			if ( $tile.attr('id') != 'banner' ) {					
				$tile.find('.detail').css({
					top: isFullSize ? pluginInstance.$element.find('.wrapper').height() : pluginInstance.tileHeight,
					display: 'block'
				}).stop().animate({
					top: 0
				}, 500, 'easeOutCubic');
			}		
		},
		
		hideDetailLayer: function($tile, isFullSize) {
			var pluginInstance = this;
			if ( $tile.attr('id') != 'banner' ) {
				$tile.find('.detail').stop().animate({
					top: isFullSize ? pluginInstance.$element.find('.wrapper').height() : pluginInstance.tileHeight
				}, 500, 'easeOutCubic');
			}		
		},
		
		setTilesHeight: function() {
			var pluginInstance = this;
			pluginInstance.tileHeight = Math.floor(pluginInstance.$element.find('.tile').first().width());
			pluginInstance.$element.find('.wrapper .tile').height(pluginInstance.tileHeight-1); //-1 to avoid decimal issues
		},
		
		matchMediaHandler0_599 : function(mql) {
			//console.log('below 599');
			var pluginInstance = this;
			
			if (mql.matches) {
				//move banner below tiles
				pluginInstance.banner.css({'height':'auto'}).insertAfter($('#mosaic .wrapper'));				
				
				//remove hover handlers from tiles
				pluginInstance.$element.off('mouseenter mouseleave');				
				
				//add click handler for tiles
				pluginInstance.$element.on('click', '.tile:not(#see_all)', function(e) {
					e.stopPropagation();
					pluginInstance.showDetailLayer($(this), true);
				});
				
				//stop clicks on detail layer from propagating to tile
				pluginInstance.$element.on('click', '.detail', function(e) {
					e.stopPropagation();
				});				
				
				//click handler for close button
				pluginInstance.$element.on('click', '.detail .icon-close', function(e) {
					e.stopPropagation();
					pluginInstance.hideDetailLayer($(this).closest('.tile'), true);
				});
			}		
		},
		
		matchMediaHandler600_ : function(mql) {
			//console.log('above 600');
			var pluginInstance = this;
			
			if (mql.matches) {						
				//remove click handlers from tiles
				pluginInstance.$element.off('click');
				
				//add hover handler to tiles
				pluginInstance.$element.on('mouseenter', '.tile:not(#see_all)', function() {
					pluginInstance.showDetailLayer($(this), false);
				}).on('mouseleave', '.tile:not(#see_all)', function() {
					pluginInstance.hideDetailLayer($(this), false);
				});
			}		
		},	
		
		matchMediaHandler600_767 : function(mql) {
			//console.log('600-768');
			var pluginInstance = this;
			
			if (mql.matches) {
				pluginInstance.banner.insertAfter($('.tile:not(#banner):eq(2)'));
			}	
		},
		
		matchMediaHandler768 : function(mql) {
			//console.log('above 768');
			var pluginInstance = this;	
			
			if (mql.matches) {
				pluginInstance.banner.insertAfter($('.tile:not(#banner):eq(4)'));
			}		
		}
	};
	
	// event handlers
	var eventhandlers = {};

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