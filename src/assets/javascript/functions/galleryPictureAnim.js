var makeup = require('./Makeup');

makeup.prototype.galleryPictureAnim = function() {
	var counter = 0,
		self = this,
		bgWedding = [
			'assets/images/wedding/wedding1-small.jpg',
			'assets/images/wedding/wedding2-small.jpg',
			'assets/images/wedding/wedding3-small.jpg'
		],
		bgFashion = [
			'assets/images/fashion/fashion1-small.jpg',
			'assets/images/fashion/fashion2-small.jpg',
			'assets/images/fashion/fashion3-small.jpg'
		],
		bgBeauty = [
			'assets/images/beauty/beauty1-small.jpg',
			'assets/images/beauty/beauty2-small.jpg',
			'assets/images/beauty/beauty3-small.jpg'
		],
		bgContest = [
			'assets/images/contest/contest1-small.jpg',
			'assets/images/contest/contest2-small.jpg',
			'assets/images/contest/contest3-small.jpg'
		];

		self.config.galleryImagesSmall.first().css({
			backgroundImage: 'url(' + bgWedding[counter] + ')'
		}).next().css({
			backgroundImage: 'url(' + bgFashion[counter] + ')'
		}).next().css({
			backgroundImage: 'url(' + bgBeauty[counter] + ')'
		}).next().css({
			backgroundImage: 'url(' + bgContest[counter] + ')'
		});
		++counter;

		setInterval(function() {
			if ( counter > 2 ) {
				counter = 0;
			}

			self.config.galleryImagesSmall.first().css({
				backgroundImage: 'url(' + bgWedding[counter] + ')'
			}).next().delay(2500).css({
				backgroundImage: 'url(' + bgFashion[counter] + ')'
			}).next().delay(2500).css({
				backgroundImage: 'url(' + bgBeauty[counter] + ')'
			}).next().delay(2500).css({
				backgroundImage: 'url(' + bgContest[counter] + ')'
			});
			++counter;
		}, 2500);
};

module.exports = makeup;