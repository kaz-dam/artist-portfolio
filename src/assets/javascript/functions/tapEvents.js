var makeup = require('./Makeup');

makeup.prototype.tapEvents = function() {
	var self = this;

	if (self.config.windowObj.width() < 1040) {
		$('div.images div.gallery').swipe({
			doubleTap: function(event, target) {
				self.selectedGallery = $(target);
				var selectedSlidePosition = self.selectedGallery.data('gallery-count'),
					selectedSlide = self.slider.children('li').eq(1),
					visibleSlide = self.retrieveVisibleSlide(self.slider),
					visibleSlidePosition = visibleSlide.index(),
					direction = 'gallery';
				self.positionBeforeGallery = self.config.windowObj.scrollTop();
				self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);

				self.renderGallery( selectedSlidePosition );
			},

			treshold: 50,
			preventDefaultEvents: false
		});

		$('div.menu div.small-width').swipe({
			tap: function(event, target) {
				var menuItems = $('div.menu ul.menu li'),
					menuLines = $('div.menu div.small-width span');

				if (menuItems.hasClass('show-menu')) {
					menuLines.eq(1).removeClass();
					menuLines.first().css({
						'transform': 'none'
					});

					menuLines.last().css({
						'transform': 'none'
					});

					menuItems.removeClass('flipInX').addClass('flipOutX');
					self.config.menuDiv.css('background-color', 'rgba(0,0,0,0.5)');
					setTimeout(function() {
						menuItems.removeClass().css('background-color', 'rgba(0,0,0,0.5)');
					}, 600);
				} else {
					menuLines.eq(1).addClass('fadeOut');
					menuLines.first().css({
						'transform': 'rotateZ(-45deg) translate(-7px, 11px)'
					});

					menuLines.last().css({
						'transform': 'rotateZ(45deg) translate(-9px, -12px)'
					});
					self.config.menuDiv.css('background-color', 'rgba(0,0,0,1)');
					menuItems.addClass('show-menu flipInX').css('background-color', 'rgba(0,0,0,1)');
				}
			}
		});

		$('li.gallery div.back-mobile').swipe({
			tap: function(event, target) {
				console.log(event);
				var	selectedSlide = self.slider.children('li').eq(0),
					visibleSlide = self.retrieveVisibleSlide(self.slider),
					direction = 'home';
				self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);
			}
		});
	}
};

module.exports = makeup;