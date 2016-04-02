var makeup = require('./Makeup');

makeup.prototype.jobSwipe = function() {
	var self = this;

	if (self.config.windowObj.width() < 710) {

		self.config.jobDescription.first().addClass('selected-description');
		$('div.icon-wrapper div').first().addClass('chosen-job');

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

			treshold: 0,
			preventDefaultEvents: false
		});

		$('div.borders div.icon-wrapper .arrow').first().swipe({
			tap: function(event, target) {
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

			treshold: 50
		});

		$('div.borders div.icon-wrapper .arrow').last().swipe({
			tap: function(event, target) {
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

			treshold: 50
		});
	}
	
};

module.exports = makeup;