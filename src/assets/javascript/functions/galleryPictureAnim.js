var makeup = require('./Makeup');

makeup.prototype.galleryPictureAnim = function() {
	var counter = 0,
		self = this,
		bgWedding = [
			'assets/images/wedding-big/wedding1.jpg',
			'assets/images/wedding-big/wedding2.jpg',
			'assets/images/wedding-big/wedding3.jpg'
		],
		bgFashion = [
			'assets/images/fashion/fashion1.jpg',
			'assets/images/fashion/fashion2.jpg',
			'assets/images/fashion/fashion3.jpg'
		],
		bgBeauty = [
			'assets/images/beauty/beauty1.jpg',
			'assets/images/beauty/beauty2.jpg',
			'assets/images/beauty/beauty3.jpg'
		],
		bgContest = [
			'assets/images/contest/contest1.jpg',
			'assets/images/contest/contest2.jpg',
			'assets/images/contest/contest3.jpg'
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
}

module.exports = makeup;