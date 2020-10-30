//Slider Class
function Slider(sliderDiv, options) {
	//settings
	var orientation = (options.orientation) ? options.orientation : 'horizontal';
	var startValue = (options.startValue) ? options.startValue : 0;
	var slide = (options.slide) ? options.slide : function() {};
	var start  = (options.start) ? options.start : function() {};
	var stop  = (options.stop) ? options.stop : function() {};	
	
	//private properties
	var handle = sliderDiv.find('.handle');
	var slider = sliderDiv.find('.slider_bar');
	var sliderDivLeft = sliderDiv.offset().left;
	var sliderDivTop = sliderDiv.offset().top;
	var sliderLength;
	
	//public properties
	this.sliderValue = startValue;
	this.isDragging = false;
	
	that = this; 
	
	handle.mousedown(function(e) {
		start(that.sliderValue);
		var left, top;
		that.isDragging = true;
		e.preventDefault();
		$(document).bind({
			'mousemove' : function(e) {
				if (orientation == 'horizontal') {
					left = e.pageX - slider.offset().left;							
					if (left < 0) left = 0;
					if (left > sliderLength) left = sliderLength;		
					handle.css('left', left + slider.position().left);
					that.sliderValue = Math.round(left/sliderLength * 100);
				} else {
					top = e.pageY - slider.offset().top;	
					if (top < 0) top = 0;
					if (top > sliderLength) top = sliderLength;
					handle.css('top', top + slider.position().top);							
					that.sliderValue = Math.round((sliderLength - top)/sliderLength * 100);
				}
				
				slide(that.sliderValue);
			},
			'mouseup' : function() {
				that.isDragging = false;
				stop(that.sliderValue);
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			}							
		});	
	});			

	var init = function() {
		if (orientation == 'horizontal') {
			sliderLength = slider.width() - handle.width();						
			handle.css('left', slider.width() * startValue/100 + slider.position().left);		
		} else {
			sliderLength = slider.height() - handle.height();
			handle.css('top', ( sliderLength * (1 - startValue/100) + slider.position().top ) );		
		}
		
		slide(that.sliderValue);				
	}	
	init();
}