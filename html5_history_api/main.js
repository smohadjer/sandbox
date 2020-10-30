$(document).ready(function() {	
	//console.log(window.history);	
	
	//update history state that is pushed by browser
	(function() {
		var index = $('nav a.selected').index();
		if (window.history && window.history.pushState)	{
			history.replaceState({index: index}, "Page Title", window.location.href);		
		}	
	})();

	//click handler for nav links
	$('nav a[data-ajaxify]').on('click', function(e) {
		e.preventDefault();
		updatePage($(this).index());
		
		if (window.history && window.history.pushState)	{
			history.pushState({index: $(this).index()}, "Page Title", $(this).attr('href'));		
		}		
	});

	function updatePage(index) {		
		//update nav
		$('nav a').removeClass('selected').eq(index).addClass('selected');
		
		//update content
		var href = $('nav a').eq(index).attr('href');		
		$('.wrapper').fadeOut(750, function() {
			$('#content').remove();
			$('.wrapper').load(href + ' #content', function() {
				$('.wrapper').fadeIn();							
			});
		});				
	}

	//popstate handler
	if (window.history && window.history.pushState)	{
		window.addEventListener("popstate", function(e) {
			if (e.state) {
				updatePage(e.state.index);	
			}
		});					
	}
});