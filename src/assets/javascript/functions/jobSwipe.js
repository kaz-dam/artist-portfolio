var makeup = require('./Makeup');

makeup.prototype.jobSwipe = function() {
	var self = this;

	$('section.jobs div.icon-wrapper').swipe({
		swipeLeft: function(event, direction, distance, duration, fingerCount) {
			var jobs = $('div.icon-wrapper div'),
				selectedDesc = $('ul.description li.selected-description').index();

			self.config.jobDescription.eq(selectedDesc).addClass('fadeOutLeft');
			jobs.eq(selectedDesc).addClass('fadeOutLeft');

			setTimeout(function() {
				if (selectedDesc < 2) {
					self.config.jobDescription.removeClass()
						.eq(selectedDesc + 1).addClass('fadeInRight selected-description');
					jobs.removeClass()
						.eq(selectedDesc + 1).addClass('fadeInRight chosen-job');
				} else {
					self.config.jobDescription.removeClass()
						.eq(0).addClass('fadeInRight selected-description');
					jobs.removeClass()
						.eq(0).addClass('fadeInRight chosen-job');
				}
			}, 500);
		},

		swipeRight: function(event, direction, distance, duration, fingerCount) {
			var jobs = $('div.icon-wrapper div'),
				selectedDesc = $('ul.description li.selected-description').index();

			self.config.jobDescription.eq(selectedDesc).addClass('fadeOutRight');
			jobs.eq(selectedDesc).addClass('fadeOutRight');

			setTimeout(function() {
				if (selectedDesc > 0) {
					self.config.jobDescription.removeClass()
						.eq(selectedDesc - 1).addClass('fadeInLeft selected-description');
					jobs.removeClass()
						.eq(selectedDesc - 1).addClass('fadeInLeft chosen-job');
				} else {
					self.config.jobDescription.removeClass()
						.eq(2).addClass('fadeInLeft selected-description');
					jobs.removeClass()
						.eq(2).addClass('fadeInLeft chosen-job');
				}
			}, 500);
		},

		tap: function(event, target) {
			console.log('tapped');
		},

		treshold: 0
	});
	
};

module.exports = makeup;