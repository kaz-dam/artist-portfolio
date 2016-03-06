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
		self.galleryImg.first().addClass('visible-image');
		self.navDots.first().addClass('top-image');
	});

	self.sliderBack.on('click', function(){
		var	selectedSlide = self.slider.children('li').eq(0),
			visibleSlide = self.retrieveVisibleSlide(self.slider),
			direction = 'home';
		self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);
	});

	self.sideMenuHide();

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

	self.slowAnchor();

	self.config.jobDescriptionArrow.on('click', function() {
				
			var clickedElem = $(this),
				clickedElemIndex = self.config.jobDescriptionArrow.index(clickedElem),
				elemToShow = self.config.jobDescription.eq(clickedElemIndex);

			if ( !elemToShow.hasClass('selected-description') ) {
				elemToShow.addClass('selected-description');
				self.config.jobDescription.not(elemToShow).removeClass('selected-description');
			} else {
				elemToShow.removeClass('selected-description');
			}
	});

	self.pictureSlider();

	self.headerParallax();
};

module.exports = makeup;