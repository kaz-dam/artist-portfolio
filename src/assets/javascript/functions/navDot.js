var makeup = require('./Makeup');

makeup.prototype.navDot = function() {
	$('#tmpl-wrapper div.nav-dots span').on('click', function() {
		var clickedDotIndex = $(this).index(),
			topImgDot = $('#tmpl-wrapper div.nav-dots span').filter('.top-image').index();
		if ( clickedDotIndex > topImgDot ) {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-forward');
		} else {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-back');
		}
		$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn');
		$(this).addClass('top-image bounceIn');
	}); 
};

module.exports = makeup;