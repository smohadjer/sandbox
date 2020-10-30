function sendRequest(url, callback, postData) {
	var req = createXMLHTTPObject();
	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method,url,true);
	// User-Agent header does not seem to work on Firefox, so we set a custom header
	req.setRequestHeader("X-Requested-With", "XMLHTTP/1.0");
	req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	if (postData) {
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		req.setRequestHeader("Content-length", postData.length);
		req.setRequestHeader("Connection", "close");
  }

	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
			alert('HTTP error ' + req.status);
			return;
		}
		callback(req);
	}
	if (req.readyState == 4) return;
	req.send(postData);
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")},
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++)
	{
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function serialize(form) {
	
	var str = '';
	// if form provided as object
	if (typeof(form) == 'object') {
	} else {
		// if form provided as id
		form = document.getElementById(form);
	}
	var inputs = form.getElementsByTagName('input');
	
	for (var i=0; i<inputs.length; i++) {
		type = inputs[i].getAttribute('type');
		radio = (type == 'radio' && inputs[i].checked) ? true : false;
		checkbox = (type == 'checkbox' && inputs[i].checked) ? true : false;
		if (type == 'text' || type == 'hidden' || radio || checkbox) {
			str = str + inputs[i].getAttribute('name') + '=' + encodeURIComponent(inputs[i].value) + '&';
		}
	}

	var textareas = form.getElementsByTagName('textarea');
	for (var i=0; i<textareas.length; i++) {
		str = str + textareas[i].getAttribute('name') + '=' + encodeURIComponent(textareas[i].value) + '&';
	}
	
	var selects = form.getElementsByTagName('select');
	for (var i=0; i<selects.length; i++) {
		str = str + selects[i].getAttribute('name') + '=' + encodeURIComponent(selects[i].options[selects[i].selectedIndex].value) + '&';
	}

	return str.substr(0, str.length - 1);
}

// trim space from textareas
function trim_textareas(form_id) {
	var form = document.getElementById(form_id);
	var textareas =form.getElementsByTagName('textarea');
	for (var i=0; i<textareas.length; i++) {
		textareas[i].value = trim(textareas[i].value);
	}
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function showPreloader(options) {
	var preloader = '<div id="preloader"><img src="' + options.source + '" /></div>';
	$('#' + options.id).prepend(preloader);
}

function hidePreloader() {
	if ($('#preloader').length > 0) {
		$('#preloader').remove();
	}
}
