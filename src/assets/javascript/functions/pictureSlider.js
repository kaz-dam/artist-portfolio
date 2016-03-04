var makeup = require('./Makeup');

makeup.prototype.pictureSlider = function() {
	var self = this;
			
	self.config.imgBack.on('click', function() {
		var topImg = self.config.galleryImg.filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = self.config.galleryImg.length;

		if ( topImgIndex > 0 ) {
			var prevImg = topImgIndex - 1;
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(prevImg).addClass('visible-image go-back');
				self.config.navDots.removeClass('top-image bounceIn').eq(prevImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(allImgs - 1).addClass('visible-image go-back');
				self.config.navDots.removeClass('top-image bounceIn').eq(allImgs - 1).addClass('top-image bounceIn');
			}, 600);
		}
	});

	self.config.imgForward.on('click', function() {
		var topImg = self.config.galleryImg.filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = self.config.galleryImg.length;

		if ( topImgIndex < allImgs - 1 ) {
			var nextImg = topImgIndex + 1;
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(nextImg).addClass('visible-image go-forward');
				self.config.navDots.removeClass('top-image bounceIn').eq(nextImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(0).addClass('visible-image go-forward');
				self.config.navDots.removeClass('top-image bounceIn').eq(0).addClass('top-image bounceIn');
			}, 600);
		}
	});

	self.config.navDots.on('click', function() {
		var clickedDotIndex = $(this).index(),
			topImgDot = self.config.navDots.filter('.top-image').index();

		if ( clickedDotIndex > topImgDot ) {
			self.config.galleryImg.removeClass().eq(clickedDotIndex).addClass('visible-image go-forward');
		} else {
			self.config.galleryImg.removeClass().eq(clickedDotIndex).addClass('visible-image go-back');
		}
		self.config.navDots.removeClass('top-image bounceIn');
		$(this).addClass('top-image bounceIn');
	});
};

module.exports = makeup;