var name = "sfdasdf";

// Avoid console errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

//adds target="_blank" to links with rel="external"
function external_links() {
	$('a[rel]').each(function() {
		var rel = $(this).attr('rel');
		if (rel == 'external') {
			$(this).attr('target','_blank');
		}	
	});
}

//http://jacklmoore.com/notes/form-placeholder-text/
function placeholder_support_for_old_browsers() {
	var add = function() {
		if($(this).val() == ''){
			$(this).val($(this).attr('placeholder')).addClass('placeholder');
		}           
	}

	var remove = function() {
		if ( $(this).val() == $(this).attr('placeholder') ) {
			$(this).val('').removeClass('placeholder');
		}
	}

	// Create a dummy element for feature detection
	if ( !('placeholder' in $('<input>')[0]) ) {
		// Select the elements that have a placeholder attribute
		$('input[placeholder], textarea[placeholder]').blur(add).focus(remove).each(add);

		// Remove the placeholder text before the form is submitted
		$('form').submit(function(e){
			$(this).find('input[placeholder], textarea[placeholder]').each(remove);
		});
	}			
}

//Get URL query string values with javascript
// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
function getParameterByName(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
	return "";
	else
	return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Change URL parameters with jquery
//source: http://stackoverflow.com/questions/1090948/change-url-parameters-with-jquery
//Function call: var newURL = updateURL(window.location.href, 'locId', 'newLoc');
function updateURL(currUrl, param, paramVal){
    var url = currUrl
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var aditionalURL = tempArray[1]; 
    var temp = "";
    if(aditionalURL)
    {
        var tempArray = aditionalURL.split("&");
        for ( i=0; i<tempArray.length; i++ ){
            if( tempArray[i].split('=')[0] != param ){
                newAdditionalURL += temp+tempArray[i];
                temp = "&";
            }
        }
    }
    var rows_txt = temp+""+param+"="+paramVal;
    var finalURL = baseURL+"?"+newAdditionalURL+rows_txt;
    return finalURL;
}

//preloading images
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

//Function to convert rgb color to hex
//http://wowmotty.blogspot.de/2009/06/convert-jquery-rgb-output-to-hex-color.html
function rgb2hex(rgb){
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

//Darken or lighten a color (in hex format) by percentage (use - to darken + to lighten)
// http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color			
function shadeColor(color, porcent) {
	var R = parseInt(color.substring(1,3),16)
	var G = parseInt(color.substring(3,5),16)
	var B = parseInt(color.substring(5,7),16);

	R = parseInt(R * (100 + porcent) / 100);
	G = parseInt(G * (100 + porcent) / 100);
	B = parseInt(B * (100 + porcent) / 100);

	R = (R<255)?R:255;  
	G = (G<255)?G:255;  
	B = (B<255)?B:255;  

	var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	return "#"+RR+GG+BB;
}

//Adds comma to a number
//http://www.mredkj.com/javascript/nfbasic.html
function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

