(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = 

	function Makeup() {
		var self = this;

		self.slider = {};
		self.sliderNavigation = {};
		self.sliderBack = {};
		self.svgCoverLayer = {};
		self.svgPath = {};
		self.firstAnimation = {};
		self.secondAnimation = {};
		self.pathArray = [];
		self.selectedGallery = {};
		self.positionBeforeGallery = {};
		self.selectedPictures = [];

		self.config = {
			windowObj: $(window),
			documentObj: $(document),
			menu: $('ul.menu li a'),
			sideMenuScroll: $('div.scroll-menu'),
			sliderWrapper: $('div.slider-wrapper'),
			mainSlide: $('ul.slider li:first-child'),
			duration: 300,
			delay: 300,
			allAnchor: $('a[href*=\\#]:not([href=\\#])'),
			topMenu: $('ul.menu'),
			menuDiv: $('section.header div.menu'),
			mainHeadingDiv: $('div.heading'),
			mainHeading: $('div.heading h1'),
			mainHeadingPar: $('div.heading p'),
			headerCta: $('div.cta-header'),
			jobDescriptionArrow: $('div.icon-wrapper svg.arrow'),
			jobDescription: $('ul.description li'),
			galleryImagesSmall: $('div.slider-nav div.images'),
			brandSpans: $('section.about p span.brands'),
			brandPopup: $('section.about p span.popup'),
			// galleryImg: $('#tmpl-wrapper ul.gallery-images li'),	not defined
			// navDots: $('#tmpl-wrapper div.nav-dots span'),	not defined
			imgBack: $('li.gallery div.backward'),
			imgForward: $('li.gallery div.forward'),
			aboutSection: $('section.about'),
			contactSection: $('section.contact'),
			footerSection: $('section.footer')
		};

		var epsilon = (1000 / 60 / self.config.duration) / 4;
		self.firstAnimation = self.bezier(0.42,0,0.58,1, epsilon);
		self.secondAnimation = self.bezier(0.42,0,1,1, epsilon);
		self.config.sliderWrapper.each( function() {
			self.initSlider( $(this) );
		});
		self.eventWatch();
		self.galleryPictureAnim();
		self.brandsRandomAnim();
		self.brandsLogoBox();
		self.scrollSpeed( 100, 500 );

	};
},{}],2:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.brandsLogoBox = function() {

	var mouseX = 0,
		mouseY = 0,
		self = this;

	self.config.documentObj.on('mousemove', function( e ) {
		mouseX = e.pageX;
		mouseY = e.pageY;

		self.config.brandSpans.on('mouseenter', function() {
			$(this).next().css({
				'top': mouseY + 15,
				'left': mouseX + 5
			}).show();
		});

		self.config.brandSpans.on('mouseleave', function() {
			$(this).next().hide();
		});
	});
	
};

module.exports = makeup;
},{"./Makeup":1}],3:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.brandsRandomAnim = function() {
	var self = this;
		setInterval(function() {
			var randomNum = Math.floor(Math.random() * 6);
			self.config.brandSpans.eq(randomNum).addClass('brand-anim')
				.siblings().removeClass('brand-anim');
		}, 3000);
};

module.exports = makeup;
},{"./Makeup":1}],4:[function(require,module,exports){
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

	if (self.config.windowObj.width() > 710) {
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

	self.imageSwipe();
};

module.exports = makeup;
},{"./Makeup":1}],5:[function(require,module,exports){
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

		if (self.config.windowObj.width() > 1040) {
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
		
};

module.exports = makeup;
},{"./Makeup":1}],6:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.headerParallax = function() {

	var self = this;

	if (self.config.windowObj.width() < 1040) {
		self.config.contactSection.css({
			'z-index': -2
			// 'opacity': 0
		});
	}

	self.config.windowObj.on('scroll', function() {
		var topPos = self.config.windowObj.scrollTop();
				
		if ( self.config.windowObj.width() > 1040 ) {
			self.config.menuDiv.css('top', topPos);
		}

		if (topPos >= 440 && self.config.windowObj.width() < 1040) {
			self.config.contactSection.css({
				'z-index': -1
			});
			self.config.footerSection.css({
				'z-index': -1
			});
		} else {
			self.config.contactSection.css({
				'z-index': -2
			});
			self.config.footerSection.css({
				'z-index': -2
			});
		}

		if ( topPos >= 440 && self.config.windowObj.width() > 1040 ) {
			self.config.menuDiv.css('top', 440 - (topPos / 200) );
		}

		self.config.mainHeadingDiv.css({
			'opacity': 1 - ( topPos / 300 ),
			'margin-top': 207 - (topPos / 5)
		});

		self.config.headerCta.css({
			'opacity': 1 - ( topPos / 300 ),
			'margin-top': 15 - (topPos / 13)
		});
	});
};

module.exports = makeup;
},{"./Makeup":1}],7:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.imageSwipe = function() {
	var self = this;

	// if (self.config.windowObj.width() < 1040 && $('ul.slider li').hasClass('visible')) {
		$('#tmpl-wrapper').swipe({
			swipeRight: function(event, direction, distance, duration, fingerCount) {
				var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
					topImgIndex = topImg.index(),
					allImgs = $('#tmpl-wrapper ul.gallery-images li').length,
					desc = $('#tmpl-wrapper div.picture-description');

				if ( topImgIndex > 0 ) {
					var prevImg = topImgIndex - 1;
					setTimeout(function() {
						topImg.removeClass('go-back').addClass('bounceOutRight');
					}, 400);
					desc.removeClass('go-back').addClass('bounceOutRight');
					setTimeout(function() {
						$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(prevImg).addClass('visible-image go-back');
						$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(prevImg).addClass('top-image bounceIn');
						setTimeout(function() {
							desc.removeClass('current-description go-back bounceOutRight').eq(prevImg).addClass('current-description go-back');
						}, 300);
					}, 1000);
				} else {
					setTimeout(function() {
						topImg.removeClass('go-back').addClass('bounceOutRight');
					}, 400);
					desc.removeClass('go-back').addClass('bounceOutRight');
					setTimeout(function() {
						$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(allImgs - 1).addClass('visible-image go-back');
						$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(allImgs - 1).addClass('top-image bounceIn');
						setTimeout(function() {
							desc.removeClass('current-description go-back bounceOutRight').eq(allImgs - 1).addClass('current-description go-back');
						}, 300);
					}, 1000);
				}
			},

			swipeLeft: function(event, direction, distance, duration, fingerCount) {
				var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
					topImgIndex = topImg.index(),
					allImgs = $('#tmpl-wrapper ul.gallery-images li').length,
					desc = $('#tmpl-wrapper div.picture-description');

				if ( topImgIndex < allImgs - 1 ) {
					var nextImg = topImgIndex + 1;
					setTimeout(function() {
						topImg.removeClass('go-forward').addClass('bounceOutLeft');
					}, 400);
					desc.removeClass('go-forward').addClass('bounceOutLeft');
					setTimeout(function() {
						$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(nextImg).addClass('visible-image go-forward');
						$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(nextImg).addClass('top-image bounceIn');
						setTimeout(function() {
							desc.removeClass('current-description bounceOutLeft').eq(nextImg).addClass('current-description go-forward');
						}, 300);
					}, 1000);
				} else {
					setTimeout(function() {
						topImg.removeClass('go-forward').addClass('bounceOutLeft');
					}, 400);
					desc.removeClass('go-forward').addClass('bounceOutLeft');
					setTimeout(function() {
						$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(0).addClass('visible-image go-forward');
						$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(0).addClass('top-image bounceIn');
						setTimeout(function() {
							desc.removeClass('current-description bounceOutLeft').eq(0).addClass('current-description go-forward');
						}, 300);
					}, 1000);
				}
			},

			treshold: 0
		});
	// }

};

module.exports = makeup;
},{"./Makeup":1}],8:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.initSlider = function( sliderWrapper ) {

	var self = this;

	self.slider = sliderWrapper.find('ul.slider');
	self.sliderNavigation = sliderWrapper.find('div.slider-nav').find('div.gallery');
	self.sliderBack = sliderWrapper.find('div.back-button');
	self.svgCoverLayer = sliderWrapper.find('div.svg-cover');
	var pathId = self.svgCoverLayer.find('path').attr('id');
	self.svgPath = new Snap('#' + pathId);

	self.pathArray[0] = self.svgCoverLayer.data('step1');
	self.pathArray[1] = self.svgCoverLayer.data('step6');
	self.pathArray[2] = self.svgCoverLayer.data('step2');
	self.pathArray[3] = self.svgCoverLayer.data('step7');
	self.pathArray[4] = self.svgCoverLayer.data('step3');
	self.pathArray[5] = self.svgCoverLayer.data('step8');
	self.pathArray[6] = self.svgCoverLayer.data('step4');
	self.pathArray[7] = self.svgCoverLayer.data('step9');
	self.pathArray[8] = self.svgCoverLayer.data('step5');
	self.pathArray[9] = self.svgCoverLayer.data('step10');

};

module.exports = makeup;
},{"./Makeup":1}],9:[function(require,module,exports){
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
},{"./Makeup":1}],10:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.navDot = function() {
	$('#tmpl-wrapper div.nav-dots span').on('click', function() {
		var clickedDotIndex = $(this).index(),
			topImgDot = $('#tmpl-wrapper div.nav-dots span').filter('.top-image').index(),
			desc = $('#tmpl-wrapper div.picture-description'),
			allClasses = 'current-description bounceOutLeft bounceOutRight go-forward go-back';

		if ( clickedDotIndex > topImgDot ) {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-forward');
			desc.removeClass(allClasses);
			setTimeout(function() {
				desc.eq(clickedDotIndex).addClass('current-description go-forward');
			}, 300);
		} else {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-back');
			desc.removeClass(allClasses);
			setTimeout(function() {
				desc.eq(clickedDotIndex).addClass('current-description go-back');
			}, 300);
		}
		$('#tmpl-wrapper div.nav-dots span').removeClass('top-image');
		$(this).addClass('top-image bounceIn');
		setTimeout(function() {
			$('#tmpl-wrapper div.nav-dots span').removeClass('bounceIn');
		}, 1000);
	}); 
};

module.exports = makeup;
},{"./Makeup":1}],11:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.pictureSlider = function() {
	var self = this;
			
	self.config.imgBack.on('click', function() {
		var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = $('#tmpl-wrapper ul.gallery-images li').length,
			desc = $('#tmpl-wrapper div.picture-description');

		if ( topImgIndex > 0 ) {
			var prevImg = topImgIndex - 1;
			setTimeout(function() {
				topImg.removeClass('go-back').addClass('bounceOutRight');
			}, 400);
			desc.removeClass('go-back').addClass('bounceOutRight');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(prevImg).addClass('visible-image go-back');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(prevImg).addClass('top-image bounceIn');
				setTimeout(function() {
					desc.removeClass('current-description go-back bounceOutRight').eq(prevImg).addClass('current-description go-back');
				}, 300);
			}, 1000);
		} else {
			setTimeout(function() {
				topImg.removeClass('go-back').addClass('bounceOutRight');
			}, 400);
			desc.removeClass('go-back').addClass('bounceOutRight');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(allImgs - 1).addClass('visible-image go-back');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(allImgs - 1).addClass('top-image bounceIn');
				setTimeout(function() {
					desc.removeClass('current-description go-back bounceOutRight').eq(allImgs - 1).addClass('current-description go-back');
				}, 300);
			}, 1000);
		}
	});

	self.config.imgForward.on('click', function() {
		var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = $('#tmpl-wrapper ul.gallery-images li').length,
			desc = $('#tmpl-wrapper div.picture-description');

		if ( topImgIndex < allImgs - 1 ) {
			var nextImg = topImgIndex + 1;
			setTimeout(function() {
				topImg.removeClass('go-forward').addClass('bounceOutLeft');
			}, 400);
			desc.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(nextImg).addClass('visible-image go-forward');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(nextImg).addClass('top-image bounceIn');
				setTimeout(function() {
					desc.removeClass('current-description bounceOutLeft').eq(nextImg).addClass('current-description go-forward');
				}, 300);
			}, 1000);
		} else {
			setTimeout(function() {
				topImg.removeClass('go-forward').addClass('bounceOutLeft');
			}, 400);
			desc.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(0).addClass('visible-image go-forward');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(0).addClass('top-image bounceIn');
				setTimeout(function() {
					desc.removeClass('current-description bounceOutLeft').eq(0).addClass('current-description go-forward');
				}, 300);
			}, 1000);
		}
	});
};

module.exports = makeup;
},{"./Makeup":1}],12:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.retrieveVisibleSlide = function( slider ) {
	return this.slider.find('li.visible');
};

module.exports = makeup;
},{"./Makeup":1}],13:[function(require,module,exports){
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
},{"./Makeup":1}],14:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.tapEvents = function() {
	var self = this;

	if (self.config.windowObj.width() < 1040) {
		$('div.images div.gallery').swipe({
			doubleTap: function(event, target) {
				self.selectedGallery = $(target);
				var selectedSlidePosition = self.selectedGallery.data('gallery-count'),
					selectedSlide = self.slider.children('li').eq(1),
					visibleSlide = self.retrieveVisibleSlide(self.slider),
					visibleSlidePosition = visibleSlide.index(),
					direction = 'gallery';
				self.positionBeforeGallery = self.config.windowObj.scrollTop();
				self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);

				self.renderGallery( selectedSlidePosition );
			},

			treshold: 50,
			preventDefaultEvents: false
		});

		$('div.menu div.small-width').swipe({
			tap: function(event, target) {
				var menuItems = $('div.menu ul.menu li'),
					menuLines = $('div.menu div.small-width span');

				if (menuItems.hasClass('show-menu')) {
					menuLines.eq(1).removeClass();
					menuLines.first().css({
						'transform': 'none'
					});

					menuLines.last().css({
						'transform': 'none'
					});

					menuItems.removeClass('flipInX').addClass('flipOutX');
					self.config.menuDiv.css('background-color', 'rgba(0,0,0,0.5)');
					setTimeout(function() {
						menuItems.removeClass().css('background-color', 'rgba(0,0,0,0.5)');
					}, 600);
				} else {
					menuLines.eq(1).addClass('fadeOut');
					menuLines.first().css({
						'transform': 'rotateZ(-45deg) translate(-7px, 11px)'
					});

					menuLines.last().css({
						'transform': 'rotateZ(45deg) translate(-9px, -12px)'
					});
					self.config.menuDiv.css('background-color', 'rgba(0,0,0,1)');
					menuItems.addClass('show-menu flipInX').css('background-color', 'rgba(0,0,0,1)');
				}
			}
		});

		$('li.gallery div.back-mobile').swipe({
			tap: function(event, target) {
				console.log(event);
				var	selectedSlide = self.slider.children('li').eq(0),
					visibleSlide = self.retrieveVisibleSlide(self.slider),
					direction = 'home';
				self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);
			}
		});
	}
};

module.exports = makeup;
},{"./Makeup":1}],15:[function(require,module,exports){
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
},{"./Makeup":1}],16:[function(require,module,exports){
var Makeup = require('./functions/Makeup');
var initSlider = require('./functions/initSlider');
var retrieveVisibleSlide = require('./functions/retrieveVisibleSlide');
var headerParallax = require('./functions/headerParallax');
var updateSlide = require('./functions/updateSlide');
var eventWatch = require('./functions/eventWatch');
var galleryPictureAnim = require('./functions/galleryPictureAnim');
var pictureSlider = require('./functions/pictureSlider');
var brandsRandomAnim = require('./functions/brandsRandomAnim');
var brandsLogoBox = require('./functions/brandsLogoBox');
var sideMenuHide = require('./functions/sideMenuHide');
var slowAnchor = require('./tools/slowAnchor');
var bezier = require('./tools/bezier');
var scrollSpeed = require('./tools/scrollSpeed');
var tmplConfig = require('./templates/tmplConfig');
var renderGallery = require('./templates/renderGallery');
var gallery = require('./templates/templates');
var navDot = require('./functions/navDot');
var helpers = require('./templates/helpers');
var jobSwipe = require('./functions/jobSwipe');
var tapEvents = require('./functions/tapEvents');
var imageSwipe = require('./functions/imageSwipe');

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/imageSwipe":7,"./functions/initSlider":8,"./functions/jobSwipe":9,"./functions/navDot":10,"./functions/pictureSlider":11,"./functions/retrieveVisibleSlide":12,"./functions/sideMenuHide":13,"./functions/tapEvents":14,"./functions/updateSlide":15,"./templates/helpers":17,"./templates/renderGallery":18,"./templates/templates":19,"./templates/tmplConfig":20,"./tools/bezier":21,"./tools/scrollSpeed":22,"./tools/slowAnchor":23}],17:[function(require,module,exports){
module.exports = Handlebars.registerHelper('descriptionHelper', function(arg) {
	var openTag = "<p>",
		closeTag = "</p>\r\n";
	if (arg) {
		return new Handlebars.SafeString(
		openTag
		+ arg.fn(this)
		+ closeTag);
	}
});
},{}],18:[function(require,module,exports){
var makeup = require('../functions/Makeup');
var gallery = require('../templates/templates');

makeup.prototype.renderGallery = function( arg ) {
	var self = this;
	self.selectedPictures = [];

	for (var i = 0; i < self.pictures.length; i++) {
		if ( Number(self.pictures[i].id) === arg ) {
			self.selectedPictures.push(self.pictures[i]);
		}
	}
	
	var renderedPics = gallery.gallery({pics: self.selectedPictures});
	$('#tmpl-wrapper').html(renderedPics);

	$('#tmpl-wrapper ul.gallery-images li').first().addClass('visible-image');
	$('#tmpl-wrapper div.nav-dots span').first().addClass('top-image');
	$('#tmpl-wrapper div.picture-description').first().addClass('current-description');
	
	self.navDot();
};

module.exports = makeup;
},{"../functions/Makeup":1,"../templates/templates":19}],19:[function(require,module,exports){
module.exports["gallery"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "			<li><img src=\"assets/images/"
    + alias3(((helper = (helper = helpers.filePath || (depth0 != null ? depth0.filePath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filePath","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"></li>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "		<span></span>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", alias3=helpers.blockHelperMissing, buffer = 
  "	<div class=\"picture-description\">\r\n		";
  stack1 = ((helper = (helper = helpers.descriptionHelper || (depth0 != null ? depth0.descriptionHelper : depth0)) != null ? helper : alias1),(options={"name":"descriptionHelper","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.descriptionHelper) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n		";
  stack1 = ((helper = (helper = helpers.descriptionHelper || (depth0 != null ? depth0.descriptionHelper : depth0)) != null ? helper : alias1),(options={"name":"descriptionHelper","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.descriptionHelper) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n		";
  stack1 = ((helper = (helper = helpers.descriptionHelper || (depth0 != null ? depth0.descriptionHelper : depth0)) != null ? helper : alias1),(options={"name":"descriptionHelper","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.descriptionHelper) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.firstLine || (depth0 != null ? depth0.firstLine : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"firstLine","hash":{},"data":data}) : helper)));
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.secondLine || (depth0 != null ? depth0.secondLine : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"secondLine","hash":{},"data":data}) : helper)));
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.thirdLine || (depth0 != null ? depth0.thirdLine : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"thirdLine","hash":{},"data":data}) : helper)));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"gallery-images\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\r\n<div class=\"nav-dots\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pics : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pics : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
},{}],20:[function(require,module,exports){
var makeup = require('../functions/Makeup');

function Picture(id, filePath, firstLine, secondLine, thirdLine, bgDark) {
	this.id = id;
	this.filePath = filePath;
	this.firstLine = firstLine;
	this.secondLine = secondLine;
	this.thirdLine = thirdLine;
	this.bgDark = bgDark;
}

makeup.prototype.pictures = [
	new Picture('1', 'wedding/wedding1.jpg', 'Treszkai Anett', '', '', false),
	new Picture('1', 'wedding/wedding2.jpg', 'Szabó Csilla', 'Csillagkép', '', false),
	new Picture('1', 'wedding/wedding3.jpg', 'Laca Soós', 'Photography', '', false),
	new Picture('1', 'wedding/wedding4.jpg', 'Gábor Gibbó Kiss', 'GibbóArt Photograpy', '', false),
	new Picture('1', 'wedding/wedding5.jpg', 'Bertók Video & Photo', '', '', false),
	new Picture('4', 'contest/contest1.jpg', 'Mátéfy Szabolcs', 'Sunbloom', '', false),
	new Picture('4', 'contest/contest2.jpg', 'Mátéfy Szabolcs', 'Meyer Eszter-Virág', '', false),
	new Picture('4', 'contest/contest3.jpg', 'Prokop Kata Sminkiskola', 'sminkversenye', '', false),
	new Picture('2', 'fashion/fashion1.jpg', 'Bányai Bálint', 'Csorján Kriszta', '', false),
	new Picture('2', 'fashion/fashion2.jpg', 'Fotó Bazsa Kis-Horváth', 'Hári Hajna', '', false),
	new Picture('2', 'fashion/fashion3.jpg', 'Kaunitz Tamás', 'Tóth Alexandra', '', false),
	new Picture('2', 'fashion/fashion4.jpg', 'Nyers Attila', 'Styaszni Dorina', 'Siira kollekció', true),
	new Picture('2', 'fashion/fashion5.jpg', 'Nyers Attila', 'Styaszni Dorina', 'Siira kollekció', true),
	new Picture('2', 'fashion/fashion6.jpg', 'Nyers Attila', 'Tauber Kinga', 'Siira kollekció', true),
	new Picture('2', 'fashion/fashion7.jpg', 'Nyers Attila', 'Tauber Kinga', 'Siira kollekció', true),
	new Picture('2', 'fashion/fashion8.jpg', 'Zemse SAURIA kollekció', 'Mátéfy Szabolcs', 'Sztyehlik Ildikó', false),
	new Picture('2', 'fashion/fashion9.jpg', 'Zemse SAURIA kollekció', 'Mátéfy Szabolcs', 'Vencel Krisztina', false),
	new Picture('3', 'beauty/beauty1.jpg', 'Debreczi János', 'Debreczi János Fotográfia', 'Sándor Noémi', true),
	new Picture('3', 'beauty/beauty2.jpg', 'Gabriella Baranyi', 'Modell Viktoria Saletros', '', true),
	new Picture('3', 'beauty/beauty3.jpg', 'Mátéfy Szabolcs', 'Sunbloom', '', false),
	new Picture('3', 'beauty/beauty4.jpg', 'Mátéfy Szabolcs', 'Meyer Eszter-Virág', '', false),
	new Picture('3', 'beauty/beauty5.jpg', 'Mátéfy Szabolcs', 'Szűcs Krisztina', '', false),
	new Picture('3', 'beauty/beauty6.jpg', 'Szabo Miklos', 'Schellenberger Zsuzsanna', '', false),
	new Picture('3', 'beauty/beauty7.jpg', 'Sziszik Dániel', 'Fügedi Dóra Tímea', '', false)
];

module.exports = makeup;
},{"../functions/Makeup":1}],21:[function(require,module,exports){
var makeup = require('../functions/Makeup');

makeup.prototype.bezier = function( x1, y1, x2, y2, epsilon ) {

	var curveX = function(t){
		var v = 1 - t;
		return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	};

	var curveY = function(t){
		var v = 1 - t;
		return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	};

	var derivativeCurveX = function(t){
		var v = 1 - t;
		return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
	};

	return function(t){

		var x = t, t0, t1, t2, x2, d2, i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++){
			x2 = curveX(t2) - x;
			if (Math.abs(x2) < epsilon) return curveY(t2);
			d2 = derivativeCurveX(t2);
			if (Math.abs(d2) < 1e-6) break;
			t2 = t2 - x2 / d2;
		}

		t0 = 0; t1 = 1; t2 = x;

		if (t2 < t0) return curveY(t0);
		if (t2 > t1) return curveY(t1);

		// Fallback to the bisection method for reliability.
		while (t0 < t1){
			x2 = curveX(t2);
			if (Math.abs(x2 - x) < epsilon) return curveY(t2);
			if (x > x2) t0 = t2;
			else t1 = t2;
			t2 = (t1 - t0) * 0.5 + t0;
		}

		// Failure
		return curveY(t2);

	};

};

module.exports = makeup;
},{"../functions/Makeup":1}],22:[function(require,module,exports){
var makeup = require('../functions/Makeup');

	makeup.prototype.scrollSpeed = function(step, speed, easing) {
        
        var $document = $(document),
            $window = $(window),
            $body = $('html, body'),
            option = easing || 'default',
            root = 0,
            scroll = false,
            scrollY,
            scrollX,
            view;
            
        if (window.navigator.msPointerEnabled)
        
            return false;
            
        $window.on('mousewheel DOMMouseScroll', function(e) {
            
            var deltaY = e.originalEvent.wheelDeltaY,
                detail = e.originalEvent.detail;
                scrollY = $document.height() > $window.height();
                scrollX = $document.width() > $window.width();
                scroll = true;
            
            if (scrollY) {
                
                view = $window.height();
                    
                if (deltaY < 0 || detail > 0)
            
                    root = (root + view) >= $document.height() ? root : root += step;
                
                if (deltaY > 0 || detail < 0)
            
                    root = root <= 0 ? 0 : root -= step;
                
                $body.stop().animate({
            
                    scrollTop: root
                
                }, speed, option, function() {
            
                    scroll = false;
                
                });
            }
            
            if (scrollX) {
                
                view = $window.width();
                    
                if (deltaY < 0 || detail > 0)
            
                    root = (root + view) >= $document.width() ? root : root += step;
                
                if (deltaY > 0 || detail < 0)
            
                    root = root <= 0 ? 0 : root -= step;
                
                $body.stop().animate({
            
                    scrollLeft: root
                
                }, speed, option, function() {
            
                    scroll = false;
                
                });
            }
            
            return false;
            
        }).on('scroll', function() {
            
            if (scrollY && !scroll) root = $window.scrollTop();
            if (scrollX && !scroll) root = $window.scrollLeft();
            
        }).on('resize', function() {
            
            if (scrollY && !scroll) view = $window.height();
            if (scrollX && !scroll) view = $window.width();
            
        });
        
        $.easing.default = function (x,t,b,c,d) {
    
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        };
    };

module.exports = makeup;
},{"../functions/Makeup":1}],23:[function(require,module,exports){
var makeup = require('../functions/Makeup');

makeup.prototype.slowAnchor = function() {

	this.config.allAnchor.on('click', function() {
		if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if ( target.length ) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
	
};

module.exports = makeup;
},{"../functions/Makeup":1}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW1hZ2VTd2lwZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvam9iU3dpcGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL25hdkRvdC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdGFwRXZlbnRzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9oZWxwZXJzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBcclxuXHJcblx0ZnVuY3Rpb24gTWFrZXVwKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHNlbGYuc2xpZGVyID0ge307XHJcblx0XHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyQmFjayA9IHt9O1xyXG5cdFx0c2VsZi5zdmdDb3ZlckxheWVyID0ge307XHJcblx0XHRzZWxmLnN2Z1BhdGggPSB7fTtcclxuXHRcdHNlbGYuZmlyc3RBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2Vjb25kQW5pbWF0aW9uID0ge307XHJcblx0XHRzZWxmLnBhdGhBcnJheSA9IFtdO1xyXG5cdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0ge307XHJcblx0XHRzZWxmLnNlbGVjdGVkUGljdHVyZXMgPSBbXTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZyA9IHtcclxuXHRcdFx0d2luZG93T2JqOiAkKHdpbmRvdyksXHJcblx0XHRcdGRvY3VtZW50T2JqOiAkKGRvY3VtZW50KSxcclxuXHRcdFx0bWVudTogJCgndWwubWVudSBsaSBhJyksXHJcblx0XHRcdHNpZGVNZW51U2Nyb2xsOiAkKCdkaXYuc2Nyb2xsLW1lbnUnKSxcclxuXHRcdFx0c2xpZGVyV3JhcHBlcjogJCgnZGl2LnNsaWRlci13cmFwcGVyJyksXHJcblx0XHRcdG1haW5TbGlkZTogJCgndWwuc2xpZGVyIGxpOmZpcnN0LWNoaWxkJyksXHJcblx0XHRcdGR1cmF0aW9uOiAzMDAsXHJcblx0XHRcdGRlbGF5OiAzMDAsXHJcblx0XHRcdGFsbEFuY2hvcjogJCgnYVtocmVmKj1cXFxcI106bm90KFtocmVmPVxcXFwjXSknKSxcclxuXHRcdFx0dG9wTWVudTogJCgndWwubWVudScpLFxyXG5cdFx0XHRtZW51RGl2OiAkKCdzZWN0aW9uLmhlYWRlciBkaXYubWVudScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ0RpdjogJCgnZGl2LmhlYWRpbmcnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmc6ICQoJ2Rpdi5oZWFkaW5nIGgxJyksXHJcblx0XHRcdG1haW5IZWFkaW5nUGFyOiAkKCdkaXYuaGVhZGluZyBwJyksXHJcblx0XHRcdGhlYWRlckN0YTogJCgnZGl2LmN0YS1oZWFkZXInKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb25BcnJvdzogJCgnZGl2Lmljb24td3JhcHBlciBzdmcuYXJyb3cnKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb246ICQoJ3VsLmRlc2NyaXB0aW9uIGxpJyksXHJcblx0XHRcdGdhbGxlcnlJbWFnZXNTbWFsbDogJCgnZGl2LnNsaWRlci1uYXYgZGl2LmltYWdlcycpLFxyXG5cdFx0XHRicmFuZFNwYW5zOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5icmFuZHMnKSxcclxuXHRcdFx0YnJhbmRQb3B1cDogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4ucG9wdXAnKSxcclxuXHRcdFx0Ly8gZ2FsbGVyeUltZzogJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0Ly8gbmF2RG90czogJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0aW1nQmFjazogJCgnbGkuZ2FsbGVyeSBkaXYuYmFja3dhcmQnKSxcclxuXHRcdFx0aW1nRm9yd2FyZDogJCgnbGkuZ2FsbGVyeSBkaXYuZm9yd2FyZCcpLFxyXG5cdFx0XHRhYm91dFNlY3Rpb246ICQoJ3NlY3Rpb24uYWJvdXQnKSxcclxuXHRcdFx0Y29udGFjdFNlY3Rpb246ICQoJ3NlY3Rpb24uY29udGFjdCcpLFxyXG5cdFx0XHRmb290ZXJTZWN0aW9uOiAkKCdzZWN0aW9uLmZvb3RlcicpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBlcHNpbG9uID0gKDEwMDAgLyA2MCAvIHNlbGYuY29uZmlnLmR1cmF0aW9uKSAvIDQ7XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDAuNTgsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwxLDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5jb25maWcuc2xpZGVyV3JhcHBlci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5pbml0U2xpZGVyKCAkKHRoaXMpICk7XHJcblx0XHR9KTtcclxuXHRcdHNlbGYuZXZlbnRXYXRjaCgpO1xyXG5cdFx0c2VsZi5nYWxsZXJ5UGljdHVyZUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzUmFuZG9tQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNMb2dvQm94KCk7XHJcblx0XHRzZWxmLnNjcm9sbFNwZWVkKCAxMDAsIDUwMCApO1xyXG5cclxuXHR9OyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNMb2dvQm94ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBtb3VzZVggPSAwLFxyXG5cdFx0bW91c2VZID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5kb2N1bWVudE9iai5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRtb3VzZVggPSBlLnBhZ2VYO1xyXG5cdFx0bW91c2VZID0gZS5wYWdlWTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmNzcyh7XHJcblx0XHRcdFx0J3RvcCc6IG1vdXNlWSArIDE1LFxyXG5cdFx0XHRcdCdsZWZ0JzogbW91c2VYICsgNVxyXG5cdFx0XHR9KS5zaG93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc1JhbmRvbUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLmVxKHJhbmRvbU51bSkuYWRkQ2xhc3MoJ2JyYW5kLWFuaW0nKVxyXG5cdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdicmFuZC1hbmltJyk7XHJcblx0XHR9LCAzMDAwKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5ldmVudFdhdGNoID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWRTbGlkZVBvc2l0aW9uID0gc2VsZi5zZWxlY3RlZEdhbGxlcnkuZGF0YSgnZ2FsbGVyeS1jb3VudCcpLFxyXG5cdFx0XHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMSksXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGVQb3NpdGlvbiA9IHZpc2libGVTbGlkZS5pbmRleCgpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblxyXG5cdFx0c2VsZi5yZW5kZXJHYWxsZXJ5KCBzZWxlY3RlZFNsaWRlUG9zaXRpb24gKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdFx0Z2FsbGVyeU5hbWUgPSBob3ZlcmVkR2FsbGVyeS5maW5kKCdoMicpO1xyXG5cdFx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0XHRvcGFjaXR5OiAnMScsXHJcblx0XHRcdFx0bGV0dGVyU3BhY2luZzogJzRweCdcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdFx0Z2FsbGVyeU5hbWUuYW5pbWF0ZSh7XHJcblx0XHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRcdGxldHRlclNwYWNpbmc6ICcxNXB4J1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnNsb3dBbmNob3IoKTtcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gNzEwKSB7XHJcblx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGNsaWNrZWRFbGVtID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRcdGVsZW1Ub1Nob3cgPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShjbGlja2VkRWxlbUluZGV4IC0gMSksXHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbSA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0XHRcdGlmICggIWVsZW1Ub1Nob3cuaGFzQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJykgKSB7XHJcblx0XHRcdFx0XHRlbGVtVG9TaG93LmFkZENsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbiBib3VuY2VJblVwJyk7XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygnYm91bmNlSW5VcCcpLmFkZENsYXNzKCdib3VuY2VPdXREb3duJyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5ub3QoZWxlbVRvU2hvdykucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdFx0XHRcdH0sIDIwMCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtLnJlbW92ZUNsYXNzKCdib3VuY2VJblVwJykuYWRkQ2xhc3MoJ2JvdW5jZU91dERvd24nKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRFbGVtLnJlbW92ZUNsYXNzKCk7XHJcblx0XHRcdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuam9iU3dpcGUoKTtcclxuXHJcblx0c2VsZi5oZWFkZXJQYXJhbGxheCgpO1xyXG5cclxuXHRzZWxmLnRhcEV2ZW50cygpO1xyXG5cclxuXHRzZWxmLmltYWdlU3dpcGUoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCBjb3VudGVyID4gMiApIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQrK2NvdW50ZXI7XHJcblx0XHRcdH0sIDI1MDApO1xyXG5cdFx0fVxyXG5cdFx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaGVhZGVyUGFyYWxsYXggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPCAxMDQwKSB7XHJcblx0XHRzZWxmLmNvbmZpZy5jb250YWN0U2VjdGlvbi5jc3Moe1xyXG5cdFx0XHQnei1pbmRleCc6IC0yXHJcblx0XHRcdC8vICdvcGFjaXR5JzogMFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLmNvbmZpZy53aW5kb3dPYmoub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcFBvcyA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRcclxuXHRcdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgdG9wUG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodG9wUG9zID49IDQ0MCAmJiBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdFx0c2VsZi5jb25maWcuY29udGFjdFNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0xXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5mb290ZXJTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLmNvbnRhY3RTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMlxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5jb25maWcuZm9vdGVyU2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW1hZ2VTd2lwZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0Ly8gaWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgMTA0MCAmJiAkKCd1bC5zbGlkZXIgbGknKS5oYXNDbGFzcygndmlzaWJsZScpKSB7XHJcblx0XHQkKCcjdG1wbC13cmFwcGVyJykuc3dpcGUoe1xyXG5cdFx0XHRzd2lwZVJpZ2h0OiBmdW5jdGlvbihldmVudCwgZGlyZWN0aW9uLCBkaXN0YW5jZSwgZHVyYXRpb24sIGZpbmdlckNvdW50KSB7XHJcblx0XHRcdFx0dmFyIHRvcEltZyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdFx0XHR0b3BJbWdJbmRleCA9IHRvcEltZy5pbmRleCgpLFxyXG5cdFx0XHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGgsXHJcblx0XHRcdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoIHRvcEltZ0luZGV4ID4gMCApIHtcclxuXHRcdFx0XHRcdHZhciBwcmV2SW1nID0gdG9wSW1nSW5kZXggLSAxO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEocHJldkltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKHByZXZJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShwcmV2SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjayBib3VuY2VPdXRSaWdodCcpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdFx0XHRhbGxJbWdzID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmxlbmd0aCxcclxuXHRcdFx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0XHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0XHRcdHZhciBuZXh0SW1nID0gdG9wSW1nSW5kZXggKyAxO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCcpLmVxKDApLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRyZXNob2xkOiAwXHJcblx0XHR9KTtcclxuXHQvLyB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmluaXRTbGlkZXIgPSBmdW5jdGlvbiggc2xpZGVyV3JhcHBlciApIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlciA9IHNsaWRlcldyYXBwZXIuZmluZCgndWwuc2xpZGVyJyk7XHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuc2xpZGVyLW5hdicpLmZpbmQoJ2Rpdi5nYWxsZXJ5Jyk7XHJcblx0c2VsZi5zbGlkZXJCYWNrID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuYmFjay1idXR0b24nKTtcclxuXHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zdmctY292ZXInKTtcclxuXHR2YXIgcGF0aElkID0gc2VsZi5zdmdDb3ZlckxheWVyLmZpbmQoJ3BhdGgnKS5hdHRyKCdpZCcpO1xyXG5cdHNlbGYuc3ZnUGF0aCA9IG5ldyBTbmFwKCcjJyArIHBhdGhJZCk7XHJcblxyXG5cdHNlbGYucGF0aEFycmF5WzBdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbMV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDYnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsyXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzNdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA3Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDMnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs1XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOCcpO1xyXG5cdHNlbGYucGF0aEFycmF5WzZdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA0Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbN10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDknKTtcclxuXHRzZWxmLnBhdGhBcnJheVs4XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzldID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxMCcpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5qb2JTd2lwZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgNzEwKSB7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZmlyc3QoKS5hZGRDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdCQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JykuZmlyc3QoKS5hZGRDbGFzcygnY2hvc2VuLWpvYicpO1xyXG5cclxuXHRcdCQoJ3NlY3Rpb24uam9icyBkaXYuaWNvbi13cmFwcGVyJykuc3dpcGUoe1xyXG5cdFx0XHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0XHRzZWxlY3RlZERlc2MgPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpLmluZGV4KCk7XHJcblxyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRMZWZ0Jyk7XHJcblx0XHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA8IDIpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgKyAxKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMCkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c3dpcGVSaWdodDogZnVuY3Rpb24oZXZlbnQsIGRpcmVjdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uLCBmaW5nZXJDb3VudCkge1xyXG5cdFx0XHRcdHZhciBqb2JzID0gJCgnZGl2Lmljb24td3JhcHBlciBkaXYnKSxcclxuXHRcdFx0XHRcdHNlbGVjdGVkRGVzYyA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJykuaW5kZXgoKTtcclxuXHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dFJpZ2h0Jyk7XHJcblx0XHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0UmlnaHQnKTtcclxuXHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChzZWxlY3RlZERlc2MgPiAwKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyAtIDEpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMikuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKDIpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dHJlc2hvbGQ6IDAsXHJcblx0XHRcdHByZXZlbnREZWZhdWx0RXZlbnRzOiBmYWxzZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnZGl2LmJvcmRlcnMgZGl2Lmljb24td3JhcHBlciAuYXJyb3cnKS5maXJzdCgpLnN3aXBlKHtcclxuXHRcdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0UmlnaHQnKTtcclxuXHRcdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA+IDApIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgLSAxKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMikuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHR0cmVzaG9sZDogNTBcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJ2Rpdi5ib3JkZXJzIGRpdi5pY29uLXdyYXBwZXIgLmFycm93JykubGFzdCgpLnN3aXBlKHtcclxuXHRcdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cdFx0XHRcdGpvYnMuZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dExlZnQnKTtcclxuXHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChzZWxlY3RlZERlc2MgPCAyKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjICsgMSkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgKyAxKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcSgwKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgNTAwKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRyZXNob2xkOiA1MFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLm5hdkRvdCA9IGZ1bmN0aW9uKCkge1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbGlja2VkRG90SW5kZXggPSAkKHRoaXMpLmluZGV4KCksXHJcblx0XHRcdHRvcEltZ0RvdCA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpLFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpLFxyXG5cdFx0XHRhbGxDbGFzc2VzID0gJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCBib3VuY2VPdXRSaWdodCBnby1mb3J3YXJkIGdvLWJhY2snO1xyXG5cclxuXHRcdGlmICggY2xpY2tlZERvdEluZGV4ID4gdG9wSW1nRG90ICkge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcyhhbGxDbGFzc2VzKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRkZXNjLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHR9LCAzMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoYWxsQ2xhc3Nlcyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0ZGVzYy5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2snKTtcclxuXHRcdFx0fSwgMzAwKTtcclxuXHRcdH1cclxuXHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlJyk7XHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygnYm91bmNlSW4nKTtcclxuXHRcdH0sIDEwMDApO1xyXG5cdH0pOyBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5waWN0dXJlU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRzZWxmLmNvbmZpZy5pbWdCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcEltZyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykubGVuZ3RoLFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPiAwICkge1xyXG5cdFx0XHR2YXIgcHJldkltZyA9IHRvcEltZ0luZGV4IC0gMTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKHByZXZJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKHByZXZJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrIGJvdW5jZU91dFJpZ2h0JykuZXEocHJldkltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5pbWdGb3J3YXJkLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcEltZyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykubGVuZ3RoLFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0dmFyIG5leHRJbWcgPSB0b3BJbWdJbmRleCArIDE7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEobmV4dEltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGJvdW5jZU91dExlZnQnKS5lcShuZXh0SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKDApLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKDApLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEoMCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJldHJpZXZlVmlzaWJsZVNsaWRlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcclxuXHRyZXR1cm4gdGhpcy5zbGlkZXIuZmluZCgnbGkudmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNpZGVNZW51SGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZiAoIHBvc2l0aW9uIDw9IDQ0MCB8fCBwb3NpdGlvbiA9PT0gMCApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE5MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTIwKTtcclxuXHRcdH0pXHJcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnRhcEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgMTA0MCkge1xyXG5cdFx0JCgnZGl2LmltYWdlcyBkaXYuZ2FsbGVyeScpLnN3aXBlKHtcclxuXHRcdFx0ZG91YmxlVGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSAkKHRhcmdldCk7XHJcblx0XHRcdFx0dmFyIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiA9IHNlbGYuc2VsZWN0ZWRHYWxsZXJ5LmRhdGEoJ2dhbGxlcnktY291bnQnKSxcclxuXHRcdFx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHRcdFx0dmlzaWJsZVNsaWRlUG9zaXRpb24gPSB2aXNpYmxlU2xpZGUuaW5kZXgoKSxcclxuXHRcdFx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdFx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRzZWxmLnVwZGF0ZVNsaWRlKHZpc2libGVTbGlkZSwgc2VsZWN0ZWRTbGlkZSwgZGlyZWN0aW9uLCBzZWxmLnN2Z0NvdmVyTGF5ZXIsIHNlbGYucGF0aEFycmF5LCBzZWxmLnN2Z1BhdGgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dHJlc2hvbGQ6IDUwLFxyXG5cdFx0XHRwcmV2ZW50RGVmYXVsdEV2ZW50czogZmFsc2VcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJ2Rpdi5tZW51IGRpdi5zbWFsbC13aWR0aCcpLnN3aXBlKHtcclxuXHRcdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0dmFyIG1lbnVJdGVtcyA9ICQoJ2Rpdi5tZW51IHVsLm1lbnUgbGknKSxcclxuXHRcdFx0XHRcdG1lbnVMaW5lcyA9ICQoJ2Rpdi5tZW51IGRpdi5zbWFsbC13aWR0aCBzcGFuJyk7XHJcblxyXG5cdFx0XHRcdGlmIChtZW51SXRlbXMuaGFzQ2xhc3MoJ3Nob3ctbWVudScpKSB7XHJcblx0XHRcdFx0XHRtZW51TGluZXMuZXEoMSkucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAnbm9uZSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5sYXN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdub25lJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdmbGlwSW5YJykuYWRkQ2xhc3MoJ2ZsaXBPdXRYJyk7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDAsMCwwLDAuNSknKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcygpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDAsMCwwLDAuNSknKTtcclxuXHRcdFx0XHRcdH0sIDYwMCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5lcSgxKS5hZGRDbGFzcygnZmFkZU91dCcpO1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdyb3RhdGVaKC00NWRlZykgdHJhbnNsYXRlKC03cHgsIDExcHgpJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmxhc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3JvdGF0ZVooNDVkZWcpIHRyYW5zbGF0ZSgtOXB4LCAtMTJweCknXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoMCwwLDAsMSknKTtcclxuXHRcdFx0XHRcdG1lbnVJdGVtcy5hZGRDbGFzcygnc2hvdy1tZW51IGZsaXBJblgnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSgwLDAsMCwxKScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnbGkuZ2FsbGVyeSBkaXYuYmFjay1tb2JpbGUnKS5zd2lwZSh7XHJcblx0XHRcdHRhcDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV2ZW50KTtcclxuXHRcdFx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHRcdFx0ZGlyZWN0aW9uID0gJ2hvbWUnO1xyXG5cdFx0XHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS51cGRhdGVTbGlkZSA9IGZ1bmN0aW9uKCBvbGRTbGlkZSwgbmV3U2xpZGUsIGRpcmVjdGlvbiwgc3ZnQ292ZXJMYXllciwgcGF0aHMsIHN2Z1BhdGggKSB7XHJcblx0dmFyIHBhdGgxID0gMCxcclxuXHRcdHBhdGgyID0gMCxcclxuXHRcdHBhdGgzID0gMCxcclxuXHRcdHBhdGg0ID0gMCxcclxuXHRcdHBhdGg1ID0gMDtcclxuXHJcblx0aWYgKCBkaXJlY3Rpb24gPT09ICdnYWxsZXJ5Jykge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1swXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbMl07XHJcblx0XHRwYXRoMyA9IHBhdGhzWzRdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s2XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOF07XHJcblx0fSBlbHNlIHtcclxuXHRcdHBhdGgxID0gcGF0aHNbMV07XHJcblx0XHRwYXRoMiA9IHBhdGhzWzNdO1xyXG5cdFx0cGF0aDMgPSBwYXRoc1s1XTtcclxuXHRcdHBhdGg0ID0gcGF0aHNbN107XHJcblx0XHRwYXRoNSA9IHBhdGhzWzldO1xyXG5cdH1cclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzdmdDb3ZlckxheWVyLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRzdmdQYXRoLmF0dHIoJ2QnLCBwYXRoMSk7XHJcblx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgyfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgzfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0b2xkU2xpZGUucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0bmV3U2xpZGUuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0aWYgKCBzZWxmLmNvbmZpZy5tYWluU2xpZGUuaGFzQ2xhc3MoJ3Zpc2libGUnKSApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg0fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg1fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3ZnQ292ZXJMYXllci5yZW1vdmVDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgc2VsZi5jb25maWcuZGVsYXkpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgTWFrZXVwID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcbnZhciBpbml0U2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaW5pdFNsaWRlcicpO1xyXG52YXIgcmV0cmlldmVWaXNpYmxlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9yZXRyaWV2ZVZpc2libGVTbGlkZScpO1xyXG52YXIgaGVhZGVyUGFyYWxsYXggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheCcpO1xyXG52YXIgdXBkYXRlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy91cGRhdGVTbGlkZScpO1xyXG52YXIgZXZlbnRXYXRjaCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2V2ZW50V2F0Y2gnKTtcclxudmFyIGdhbGxlcnlQaWN0dXJlQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2dhbGxlcnlQaWN0dXJlQW5pbScpO1xyXG52YXIgcGljdHVyZVNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3BpY3R1cmVTbGlkZXInKTtcclxudmFyIGJyYW5kc1JhbmRvbUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNSYW5kb21BbmltJyk7XHJcbnZhciBicmFuZHNMb2dvQm94ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveCcpO1xyXG52YXIgc2lkZU1lbnVIaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvc2lkZU1lbnVIaWRlJyk7XHJcbnZhciBzbG93QW5jaG9yID0gcmVxdWlyZSgnLi90b29scy9zbG93QW5jaG9yJyk7XHJcbnZhciBiZXppZXIgPSByZXF1aXJlKCcuL3Rvb2xzL2JlemllcicpO1xyXG52YXIgc2Nyb2xsU3BlZWQgPSByZXF1aXJlKCcuL3Rvb2xzL3Njcm9sbFNwZWVkJyk7XHJcbnZhciB0bXBsQ29uZmlnID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdG1wbENvbmZpZycpO1xyXG52YXIgcmVuZGVyR2FsbGVyeSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3JlbmRlckdhbGxlcnknKTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxudmFyIG5hdkRvdCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL25hdkRvdCcpO1xyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2hlbHBlcnMnKTtcclxudmFyIGpvYlN3aXBlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvam9iU3dpcGUnKTtcclxudmFyIHRhcEV2ZW50cyA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3RhcEV2ZW50cycpO1xyXG52YXIgaW1hZ2VTd2lwZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2ltYWdlU3dpcGUnKTtcclxuXHJcbnZhciBtYWtldXAgPSBuZXcgTWFrZXVwKCk7IiwibW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdkZXNjcmlwdGlvbkhlbHBlcicsIGZ1bmN0aW9uKGFyZykge1xyXG5cdHZhciBvcGVuVGFnID0gXCI8cD5cIixcclxuXHRcdGNsb3NlVGFnID0gXCI8L3A+XFxyXFxuXCI7XHJcblx0aWYgKGFyZykge1xyXG5cdFx0cmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoXHJcblx0XHRvcGVuVGFnXHJcblx0XHQrIGFyZy5mbih0aGlzKVxyXG5cdFx0KyBjbG9zZVRhZyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgZ2FsbGVyeSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucmVuZGVyR2FsbGVyeSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucGljdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmICggTnVtYmVyKHNlbGYucGljdHVyZXNbaV0uaWQpID09PSBhcmcgKSB7XHJcblx0XHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcy5wdXNoKHNlbGYucGljdHVyZXNbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR2YXIgcmVuZGVyZWRQaWNzID0gZ2FsbGVyeS5nYWxsZXJ5KHtwaWNzOiBzZWxmLnNlbGVjdGVkUGljdHVyZXN9KTtcclxuXHQkKCcjdG1wbC13cmFwcGVyJykuaHRtbChyZW5kZXJlZFBpY3MpO1xyXG5cclxuXHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlyc3QoKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZScpO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maXJzdCgpLmFkZENsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHQkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJykuZmlyc3QoKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbicpO1xyXG5cdFxyXG5cdHNlbGYubmF2RG90KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJtb2R1bGUuZXhwb3J0c1tcImdhbGxlcnlcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlciwgYWxpYXMxPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMyPVwiZnVuY3Rpb25cIiwgYWxpYXMzPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcblxuICByZXR1cm4gXCJcdFx0XHQ8bGk+PGltZyBzcmM9XFxcImFzc2V0cy9pbWFnZXMvXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZpbGVQYXRoIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5maWxlUGF0aCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlsZVBhdGhcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBhbHQ9XFxcIlwiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5pZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaWQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9saT5cXHJcXG5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHJldHVybiBcIlx0XHQ8c3Bhbj48L3NwYW4+XFxyXFxuXCI7XG59LFwiNVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBoZWxwZXIsIG9wdGlvbnMsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz1oZWxwZXJzLmJsb2NrSGVscGVyTWlzc2luZywgYnVmZmVyID0gXG4gIFwiXHQ8ZGl2IGNsYXNzPVxcXCJwaWN0dXJlLWRlc2NyaXB0aW9uXFxcIj5cXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDYsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTAsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxyXFxuXHQ8L2Rpdj5cXHJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZpcnN0TGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZmlyc3RMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmaXJzdExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zZWNvbmRMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zZWNvbmRMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJzZWNvbmRMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcIjEwXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRoaXJkTGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGhpcmRMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJ0aGlyZExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCI8dWwgY2xhc3M9XFxcImdhbGxlcnktaW1hZ2VzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L3VsPlxcclxcbjxkaXYgY2xhc3M9XFxcIm5hdi1kb3RzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L2Rpdj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDUsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5mdW5jdGlvbiBQaWN0dXJlKGlkLCBmaWxlUGF0aCwgZmlyc3RMaW5lLCBzZWNvbmRMaW5lLCB0aGlyZExpbmUsIGJnRGFyaykge1xyXG5cdHRoaXMuaWQgPSBpZDtcclxuXHR0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XHJcblx0dGhpcy5maXJzdExpbmUgPSBmaXJzdExpbmU7XHJcblx0dGhpcy5zZWNvbmRMaW5lID0gc2Vjb25kTGluZTtcclxuXHR0aGlzLnRoaXJkTGluZSA9IHRoaXJkTGluZTtcclxuXHR0aGlzLmJnRGFyayA9IGJnRGFyaztcclxufVxyXG5cclxubWFrZXVwLnByb3RvdHlwZS5waWN0dXJlcyA9IFtcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcxLmpwZycsICdUcmVzemthaSBBbmV0dCcsICcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzIuanBnJywgJ1N6YWLDsyBDc2lsbGEnLCAnQ3NpbGxhZ2vDqXAnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzMuanBnJywgJ0xhY2EgU2/Ds3MnLCAnUGhvdG9ncmFwaHknLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzQuanBnJywgJ0fDoWJvciBHaWJiw7MgS2lzcycsICdHaWJiw7NBcnQgUGhvdG9ncmFweScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNS5qcGcnLCAnQmVydMOzayBWaWRlbyAmIFBob3RvJywgJycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0MS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3VuYmxvb20nLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDIuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ01leWVyIEVzenRlci1WaXLDoWcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDMuanBnJywgJ1Byb2tvcCBLYXRhIFNtaW5raXNrb2xhJywgJ3NtaW5rdmVyc2VueWUnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjEuanBnJywgJ0LDoW55YWkgQsOhbGludCcsICdDc29yasOhbiBLcmlzenRhJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24yLmpwZycsICdGb3TDsyBCYXpzYSBLaXMtSG9ydsOhdGgnLCAnSMOhcmkgSGFqbmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjMuanBnJywgJ0thdW5pdHogVGFtw6FzJywgJ1TDs3RoIEFsZXhhbmRyYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNC5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1N0eWFzem5pIERvcmluYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNS5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1N0eWFzem5pIERvcmluYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNi5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1RhdWJlciBLaW5nYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNy5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1RhdWJlciBLaW5nYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uOC5qcGcnLCAnWmVtc2UgU0FVUklBIGtvbGxla2Npw7MnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3p0eWVobGlrIElsZGlrw7MnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uOS5qcGcnLCAnWmVtc2UgU0FVUklBIGtvbGxla2Npw7MnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnVmVuY2VsIEtyaXN6dGluYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5MS5qcGcnLCAnRGVicmVjemkgSsOhbm9zJywgJ0RlYnJlY3ppIErDoW5vcyBGb3RvZ3LDoWZpYScsICdTw6FuZG9yIE5vw6ltaScsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkyLmpwZycsICdHYWJyaWVsbGEgQmFyYW55aScsICdNb2RlbGwgVmlrdG9yaWEgU2FsZXRyb3MnLCAnJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTMuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N1bmJsb29tJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NC5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnTWV5ZXIgRXN6dGVyLVZpcsOhZycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTUuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N6xbFjcyBLcmlzenRpbmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk2LmpwZycsICdTemFibyBNaWtsb3MnLCAnU2NoZWxsZW5iZXJnZXIgWnN1enNhbm5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Ny5qcGcnLCAnU3ppc3ppayBEw6FuaWVsJywgJ0bDvGdlZGkgRMOzcmEgVMOtbWVhJywgJycsIGZhbHNlKVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYmV6aWVyID0gZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBlcHNpbG9uICkge1xyXG5cclxuXHR2YXIgY3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB4MSArIDMgKiB2ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgY3VydmVZID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB5MSArIDMgKiB2ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGVyaXZhdGl2ZUN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogKDIgKiAodCAtIDEpICogdCArIHYgKiB2KSAqIHgxICsgMyAqICgtIHQgKiB0ICogdCArIDIgKiB2ICogdCkgKiB4MjtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24odCl7XHJcblxyXG5cdFx0dmFyIHggPSB0LCB0MCwgdDEsIHQyLCB4MiwgZDIsIGk7XHJcblxyXG5cdFx0Ly8gRmlyc3QgdHJ5IGEgZmV3IGl0ZXJhdGlvbnMgb2YgTmV3dG9uJ3MgbWV0aG9kIC0tIG5vcm1hbGx5IHZlcnkgZmFzdC5cclxuXHRcdGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKyl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKSAtIHg7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MikgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0ZDIgPSBkZXJpdmF0aXZlQ3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKGQyKSA8IDFlLTYpIGJyZWFrO1xyXG5cdFx0XHR0MiA9IHQyIC0geDIgLyBkMjtcclxuXHRcdH1cclxuXHJcblx0XHR0MCA9IDA7IHQxID0gMTsgdDIgPSB4O1xyXG5cclxuXHRcdGlmICh0MiA8IHQwKSByZXR1cm4gY3VydmVZKHQwKTtcclxuXHRcdGlmICh0MiA+IHQxKSByZXR1cm4gY3VydmVZKHQxKTtcclxuXHJcblx0XHQvLyBGYWxsYmFjayB0byB0aGUgYmlzZWN0aW9uIG1ldGhvZCBmb3IgcmVsaWFiaWxpdHkuXHJcblx0XHR3aGlsZSAodDAgPCB0MSl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyIC0geCkgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0aWYgKHggPiB4MikgdDAgPSB0MjtcclxuXHRcdFx0ZWxzZSB0MSA9IHQyO1xyXG5cdFx0XHR0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZhaWx1cmVcclxuXHRcdHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cclxuXHR9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5cdG1ha2V1cC5wcm90b3R5cGUuc2Nyb2xsU3BlZWQgPSBmdW5jdGlvbihzdGVwLCBzcGVlZCwgZWFzaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgICAkYm9keSA9ICQoJ2h0bWwsIGJvZHknKSxcclxuICAgICAgICAgICAgb3B0aW9uID0gZWFzaW5nIHx8ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgcm9vdCA9IDAsXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxZLFxyXG4gICAgICAgICAgICBzY3JvbGxYLFxyXG4gICAgICAgICAgICB2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICR3aW5kb3cub24oJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFZLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsID0gZS5vcmlnaW5hbEV2ZW50LmRldGFpbDtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFkgPSAkZG9jdW1lbnQuaGVpZ2h0KCkgPiAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWCA9ICRkb2N1bWVudC53aWR0aCgpID4gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LmhlaWdodCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQud2lkdGgoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5lYXNpbmcuZGVmYXVsdCA9IGZ1bmN0aW9uICh4LHQsYixjLGQpIHtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2xvd0FuY2hvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR0aGlzLmNvbmZpZy5hbGxBbmNob3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCApIHtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyJdfQ==
