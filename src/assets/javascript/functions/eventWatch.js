var makeup = require('./Makeup');

makeup.prototype.eventWatch = function() {
	var self = this;

	self.sliderNavigation.on('click', function() {
		self.selectedGallery = $(this);
		var selectedSlidePosition = self.selectedGallery.data('gallery-count'),
			selectedSlide = self.slider.children('li').eq(1),
			visibleSlide = self.retrieveVisibleSlide(self.slider),
			visibleSlidePosition = visibleSlide.index(),
			direction = 'gallery';
		self.positionBeforeGallery = self.config.windowObj.scrollTop();
		self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);

		self.renderGallery( selectedSlidePosition );
	});

	self.sliderBack.on('click', function(){
		var	selectedSlide = self.slider.children('li').eq(0),
			visibleSlide = self.retrieveVisibleSlide(self.slider),
			direction = 'home';
		self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);
	});

	self.sideMenuHide();

	if (self.config.windowObj.width() > 1040) {
		self.sliderNavigation.on('mouseenter', function(){
			var hoveredGallery = $(this),
				galleryName = hoveredGallery.find('h2');
			galleryName.animate({
				opacity: '1',
				letterSpacing: '4px'
			}, 400);
		});

		self.sliderNavigation.on('mouseleave', function() {
			var hoveredGallery = $(this),
				galleryName = hoveredGallery.find('h2');
			galleryName.animate({
				opacity: '0',
				letterSpacing: '15px'
			}, 400);
		});
	}

	self.slowAnchor();

	if (self.config.windowObj.width() > 1040) {
		self.config.jobDescriptionArrow.on('click', function() {
					
				var clickedElem = $(this),
					clickedElemIndex = self.config.jobDescriptionArrow.index(clickedElem),
					elemToShow = self.config.jobDescription.eq(clickedElemIndex - 1),
					currentElem = $('ul.description li.selected-description');

				if ( !elemToShow.hasClass('selected-description') ) {
					elemToShow.addClass('selected-description bounceInUp');
					currentElem.removeClass('bounceInUp').addClass('bounceOutDown');
					setTimeout(function() {
						self.config.jobDescription.not(elemToShow).removeClass();
					}, 200);
				} else {
					currentElem.removeClass('bounceInUp').addClass('bounceOutDown');
					setTimeout(function() {
						currentElem.removeClass();
					}, 400);
				}
		});
	}

	self.pictureSlider();

	self.jobSwipe();

	self.headerParallax();

	self.tapEvents();
};

module.exports = makeup;