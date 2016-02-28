var makeup = require('./Makeup');

makeup.prototype.brandsRandomAnim = function() {
	var self = this;
	setInterval(function() {
		var randomNum = Math.floor(Math.random() * 6);
		self.config.brandSpans.eq(randomNum).addClass('brand-anim')
			.siblings().removeClass('brand-anim');
	}, 3000);
}

module.exports = makeup;