var makeup = require('./Makeup');

makeup.prototype.sideMenuHide = function() {

	var self = this;

	if ( self.config.windowObj.width() > 1040 ) {
		self.config.windowObj.on('scroll', function() {
			var position = self.config.windowObj.scrollTop();
			if ( position <= 440 || position === 0 ) {
				self.config.sideMenuScroll.css('right', -190);
			} else {
				self.config.sideMenuScroll.css('right', -160);
			}
		});

		self.config.sideMenuScroll.on('mouseenter', function() {
			self.config.sideMenuScroll.css('right', -20);
		})
		.on('mouseleave', function() {
			self.config.sideMenuScroll.css('right', -160);
		});
	}
	
};

module.exports = makeup;