//Code for pie model is based on http://raphaeljs.com/pie.html
Raphael.fn.chart = function (options) {
	var defaults = {
		x: 0, 
		y: 0, 
		radius: 100,
		data: null,
		id: undefined,
		type: 'pie',
		subtype: undefined,
		delta: 0,
		icon_width: 20,
		icon_height: 20,
		size_factor: undefined,
		init_callback: function() {}
	};
	$.extend(defaults, options);
	
	//private properties
	var paper = this,
		data = defaults.data,
		id = '#' + defaults.id,	
		rad = Math.PI / 180,
		total = 0,
		chart = this.set(),
		cx = defaults.x,
		cy = defaults.y,
		r = defaults.radius,
		angle = 0,
		IMG_W = defaults.icon_width,
		IMG_H = defaults.icon_height,
		delta = defaults.delta,
		size_factor = defaults.size_factor;
	
	//public methods
	this.total = function() {
		var temp = 0;
		for (var i = 0, ii = data.media.length; i < ii; i++) {
			temp += data.media[i].value;
		}	
		return temp;
	}
	
	//private methods
	var sector = function(cx, cy, r, startAngle, endAngle, params) {
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);						
		return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
	}
	
	var add_label = function(popangle, value) {			
		var txt_x = cx + (r + delta) * Math.cos(-popangle * rad);
		var txt_y = cy + (r + delta) * Math.sin(-popangle * rad);
		var txt_options = {fill: '#999', stroke: "none", opacity: 1, "font-size": 20};
		return paper.text(txt_x, txt_y, Math.round(value/total*100)).attr(txt_options);	
	}
	
	var collapse_nodes = function(nodes, delta) {
		$.each(nodes, function() {
			if ($(this).data('expanded')) {					
				var nodes = $(this).next('image').nextAll();	
				$.each(nodes, function() {
					$(this).attr('y', parseInt($(this).attr('y')) - delta);
				});
				$(this).data('expanded', false);					
				return false;
			}
		});
	}	
	
	var click_handler = function(e) {
		if (defaults.subtype == 'horizontal') {	
			//if there are any expanded elements close them first
			var delta = 110;
			collapse_nodes($(id + ' svg').children('rect'), delta);
			
			//push all svg elements below this element down or up				
			var nodes = $(this.node).next('image').nextAll();	
			if (!$(this.node).data('expanded')) {
				$.each(nodes, function() {
					$(this).attr('y', parseInt($(this).attr('y')) + delta);
				});
				$(this.node).data('expanded',true);	
			} else {
				$.each(nodes, function() {
					$(this).attr('y', parseInt($(this).attr('y')) - delta);
				});
				$(this.node).data('expanded', false);	
			}				
			$(id + ' ul').css({
				position: 'absolute',
				top: parseInt($(this.node).attr('y'))+40 +'px' 
			}).show();
		}		
	}
	
	var mouseover_handler = function(e) {
		if (defaults.subtype == 'circular') {		
			$(id + ' rect').each(function() {							
				$(this).attr('fill',shadeColor($(this).data('color'), -35));
			});							
			$(this.node).attr('fill', $(this.node).data('color'));
			$(id + ' p.total span').text($(this.node).data('value')).attr('id', $(this.node).data('name'));
		}
	}
	
	var mouseout_handler = function(event) {
		if (defaults.subtype == 'circular') {		
			//mouseout shouldn't be triggered when going over icon inside a graph		
			e = event.toElement || event.relatedTarget;			
			if (e.previousSibling == this.node || e == this) {
			   return;
			}	
			//reset colors
			$(id+ ' rect').each(function() {
				$(this).attr('fill', $(this).data('color'));
			});	
			$(id + ' p.total span').removeAttr('id').text(addCommas(total));
		}
	}
	
	var	darwGraph = function (i) {
		var media = data.media[i],
			value = media.value,
			angleplus = 360 * value / total,
			popangle = angle + (angleplus / 2),														
			ms = 500,
			color = "#" + media.color,
			stroke = "#2b2b2c",
			icon = options.icons_path + media.icon,
			media_id = media.id;		
			
			if ($('.legend').length) {
				$(id + ' .legend').append('<tr><td>' + media.name + '</td><td>' + Math.round(value/total*100) + '%</td></tr>');
			}			
			
		if (defaults.type == 'pie') {
			var p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 6, "stroke-linejoin": "round"});
			var txt = add_label(popangle, value);
			
			//storing fill color in rect node's data for later use in mouseover handler
			//note use of $(rect.node) instead of $(rect) due to Raphael's not keeping data in DOM due to VML support
			$(p.node).data({
				value: addCommas(media.value),
				name: media_id
			});				
			//event handlers
			p.mouseover(function () {
				this.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
				$(id + ' p span').text($(this.node).data('value'))
					.attr('id', $(this.node).data('name'));
			}).mouseout(function (event) {
				//mouseout shouldn't be triggered when going over icon inside a graph		
				e = event.toElement || event.relatedTarget;			
				if (e.previousSibling == this.node || e == this) {
				   return;
				}				
				this.stop().animate({transform: ""}, ms, "elastic");
				$(id + ' p span').removeAttr('id').text(addCommas(total));
			});
			
			angle += angleplus;
			chart.push(p);
			chart.push(txt);
			
			//add icon to each slice
			var icon_x = cx + (r - delta*3/2) * Math.cos(-popangle * rad) - IMG_W/2;
			var icon_y =  cy + (r - delta*3/2) * Math.sin(-popangle * rad) - IMG_H/2;
			var _icon = paper.image(icon, icon_x, icon_y, IMG_W, IMG_H);				
			chart.push(_icon);			
		} 
		else if (defaults.type == 'bar') {
			var rec_y =  (defaults.subtype == 'horizontal') ? options.y + i * (options.bar_height + delta) :  options.y,
				rec_width = value * size_factor/total,
				rect = paper.rect(options.x, rec_y, rec_width, options.bar_height, options.corner_radius ).attr({
				fill: color,
				"stroke-width": 0
			});					
				
			if (defaults.subtype == 'circular') {
				angle = options.start_angle + (i * -360 / data.media.length);
				var trans = "r"+ angle + "," + (options.x + options.corner_radius) + "," + (options.y + options.corner_radius);
				rect.attr({transform: trans});
			}
			
			//note use of $(rect.node) instead of $(rect) due to Raphael's not 
			//keeping data in DOM due to VML support
			$(rect.node).data({
				color: color,
				value: addCommas(value),
				name: media.id
			});				
			
			//add event handlers
			rect.click(click_handler);
			rect.mouseover(mouseover_handler);
			rect.mouseout(mouseout_handler);
			
			//add icon to each graph
			var icon_x = (defaults.subtype == 'circular') ? options.x + 10 + Math.cos(angle * rad) * (value * size_factor/total - IMG_W - delta) : options.x + delta;
			var icon_y = (defaults.subtype == 'circular') ? options.y + 10 + Math.sin(angle * rad) * (value * size_factor/total - IMG_H - delta) : rec_y + delta;
			var _icon = paper.image(icon, icon_x, icon_y, IMG_W, IMG_H);	
			chart.push(rect);
			chart.push(_icon);
		}
	};	
	
	//for hiding center of merging bars in circular bars
	var add_mask = function() {
		paper.circle((options.x + options.corner_radius), (options.y + options.corner_radius), options.corner_radius+1).attr({
			fill: "#333",
			"stroke-width": 0
		});		
	}
		
	var init = function() {		
		total = paper.total();
		for (var i = 0, ii = data.media.length; i < ii; i++) {
			darwGraph(i);
		}
		
		if (defaults.type == 'bar' && defaults.subtype == 'circular') add_mask();
		defaults.init_callback(paper);
	}
	
	init();
	
	return chart;
};