var makeup = require('./Makeup');

makeup.prototype.jobSwipe = function() {
	var self = this;

	$('#icon-wrapper').swipe({
		swipeLeft: function(event, direction, distance, duration, fingerCount) {
			// self.config.jobDescription.eq(0)
			console.log('swiped left');
		},

		swipeRight: function(event, direction, distance, duration, fingerCount) {
			console.log('swiped right');
		},

		tap: function(event, target) {
			console.log('tapped');
		},

		treshold: 0
	});
	
};

module.exports = makeup;