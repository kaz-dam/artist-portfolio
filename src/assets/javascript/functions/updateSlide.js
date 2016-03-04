var makeup = require('./Makeup');

makeup.prototype.updateSlide = function( oldSlide, newSlide, direction, svgCoverLayer, paths, svgPath ) {
	var path1 = 0,
		path2 = 0,
		path3 = 0,
		path4 = 0,
		path5 = 0;

	if ( direction === 'gallery') {
		path1 = paths[0];
		path2 = paths[2];
		path3 = paths[4];
		path4 = paths[6];
		path5 = paths[8];
	} else {
		path1 = paths[1];
		path2 = paths[3];
		path3 = paths[5];
		path4 = paths[7];
		path5 = paths[9];
	}

	var self = this;

	svgCoverLayer.addClass('is-animating');
	svgPath.attr('d', path1);
	svgPath.animate({'d': path2}, self.config.duration, this.firstAnimation, function() {
		svgPath.animate({'d': path3}, self.config.duration, this.secondAnimation, function() {
			oldSlide.removeClass('visible');
			newSlide.addClass('visible');
			if ( self.config.mainSlide.hasClass('visible') ) {
				self.config.windowObj.scrollTop(self.positionBeforeGallery);
			}
			setTimeout(function(){
				svgPath.animate({'d': path4}, self.config.duration, this.firstAnimation, function() {
					svgPath.animate({'d': path5}, self.config.duration, this.secondAnimation, function() {
						svgCoverLayer.removeClass('is-animating');
					});
				});
			}, self.config.delay);
		});
	});
};

module.exports = makeup;