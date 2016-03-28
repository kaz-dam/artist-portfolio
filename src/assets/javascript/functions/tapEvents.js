var makeup = require('./Makeup');

makeup.prototype.tapEvents = function() {
	var self = this;

	if (self.config.windowObj.width() < 1040) {
		$('div.images div.gallery').swipe({
			tap: function(event, target) {
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

			treshold: 50
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
					setTimeout(function() {
						menuItems.removeClass();
					}, 600);
				} else {
					menuLines.eq(1).addClass('fadeOut');
					menuLines.first().css({
						'transform': 'rotateZ(-45deg) translate(-7px, 11px)'
					});

					menuLines.last().css({
						'transform': 'rotateZ(45deg) translate(-9px, -12px)'
					});

					menuItems.addClass('show-menu flipInX');
				}
			}
		});

		$('ul.menu li.show-menu a').swipe({
			tap: function(event, target) {
				console.log('tapped anchor');
				var menuItems = $('div.menu ul.menu li'),
					menuLines = $('div.menu div.small-width span');

				menuLines.eq(1).removeClass();
				menuLines.first().css({
					'transform': 'none'
				});

				menuLines.last().css({
					'transform': 'none'
				});

				menuItems.removeClass('flipInX').addClass('flipOutX');
				// setTimeout(function() {
					menuItems.removeClass();
				// }, 600);
			}
		});
	}
};

module.exports = makeup;