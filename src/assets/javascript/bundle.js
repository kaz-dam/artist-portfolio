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

	if (self.config.windowObj.width() > 1040) {
		self.config.jobDescriptionArrow.on('click', function() {
					
				var clickedElem = $(this),
					clickedElemIndex = self.config.jobDescriptionArrow.index(clickedElem),
					elemToShow = self.config.jobDescription.eq(clickedElemIndex),
					currentElem = $('ul.description li.selected-description');

				if ( !elemToShow.hasClass('selected-description') ) {
					elemToShow.addClass('selected-description bounceInUp');
					currentElem.removeClass('bounceInUp').addClass('bounceOutDown');
					setTimeout(function() {
						self.config.jobDescription.not(elemToShow).removeClass();
					}, 800);
				} else {
					currentElem.removeClass('bounceInUp').addClass('bounceOutDown');
					setTimeout(function() {
						currentElem.removeClass();
					}, 800);
				}
		});
	}

	self.pictureSlider();

	self.jobSwipe();

	self.headerParallax();

	self.tapEvents();
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
},{"./Makeup":1}],8:[function(require,module,exports){
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

		treshold: 0,
		allowPageScroll: 'vertical'
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
	
};

module.exports = makeup;
},{"./Makeup":1}],9:[function(require,module,exports){
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
},{"./Makeup":1}],10:[function(require,module,exports){
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
			allImgs = $('#tmpl-wrapper ul.gallery-images li').length
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
},{"./Makeup":1}],11:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.retrieveVisibleSlide = function( slider ) {
	return this.slider.find('li.visible');
};

module.exports = makeup;
},{"./Makeup":1}],12:[function(require,module,exports){
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
},{"./Makeup":1}],13:[function(require,module,exports){
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
			allowPageScroll: 'auto'
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
			},
			allowPageScroll: "none"
		});

		// $('div.menu ul.menu li.show-menu a').swipe({
		// 	tap: function(event, target) {
		// 		console.log(target);
		// 		var menuItems = $('div.menu ul.menu li'),
		// 			menuLines = $('div.menu div.small-width span');

		// 		menuLines.eq(1).removeClass();
		// 		menuLines.first().css({
		// 			'transform': 'none'
		// 		});

		// 		menuLines.last().css({
		// 			'transform': 'none'
		// 		});

		// 		menuItems.removeClass('flipInX').addClass('flipOutX');
		// 		// setTimeout(function() {
		// 			menuItems.removeClass();
		// 		// }, 600);
		// 	}
		// });
	}
};

module.exports = makeup;
},{"./Makeup":1}],14:[function(require,module,exports){
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
},{"./Makeup":1}],15:[function(require,module,exports){
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

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/jobSwipe":8,"./functions/navDot":9,"./functions/pictureSlider":10,"./functions/retrieveVisibleSlide":11,"./functions/sideMenuHide":12,"./functions/tapEvents":13,"./functions/updateSlide":14,"./templates/helpers":16,"./templates/renderGallery":17,"./templates/templates":18,"./templates/tmplConfig":19,"./tools/bezier":20,"./tools/scrollSpeed":21,"./tools/slowAnchor":22}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{"../functions/Makeup":1,"../templates/templates":18}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{"../functions/Makeup":1}],20:[function(require,module,exports){
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
},{"../functions/Makeup":1}],21:[function(require,module,exports){
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
},{"../functions/Makeup":1}],22:[function(require,module,exports){
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
},{"../functions/Makeup":1}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvam9iU3dpcGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL25hdkRvdC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdGFwRXZlbnRzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9oZWxwZXJzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gXHJcblxyXG5cdGZ1bmN0aW9uIE1ha2V1cCgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRzZWxmLnNsaWRlciA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uID0ge307XHJcblx0XHRzZWxmLnNsaWRlckJhY2sgPSB7fTtcclxuXHRcdHNlbGYuc3ZnQ292ZXJMYXllciA9IHt9O1xyXG5cdFx0c2VsZi5zdmdQYXRoID0ge307XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0ge307XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5wYXRoQXJyYXkgPSBbXTtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0ge307XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzID0gW107XHJcblxyXG5cdFx0c2VsZi5jb25maWcgPSB7XHJcblx0XHRcdHdpbmRvd09iajogJCh3aW5kb3cpLFxyXG5cdFx0XHRkb2N1bWVudE9iajogJChkb2N1bWVudCksXHJcblx0XHRcdG1lbnU6ICQoJ3VsLm1lbnUgbGkgYScpLFxyXG5cdFx0XHRzaWRlTWVudVNjcm9sbDogJCgnZGl2LnNjcm9sbC1tZW51JyksXHJcblx0XHRcdHNsaWRlcldyYXBwZXI6ICQoJ2Rpdi5zbGlkZXItd3JhcHBlcicpLFxyXG5cdFx0XHRtYWluU2xpZGU6ICQoJ3VsLnNsaWRlciBsaTpmaXJzdC1jaGlsZCcpLFxyXG5cdFx0XHRkdXJhdGlvbjogMzAwLFxyXG5cdFx0XHRkZWxheTogMzAwLFxyXG5cdFx0XHRhbGxBbmNob3I6ICQoJ2FbaHJlZio9XFxcXCNdOm5vdChbaHJlZj1cXFxcI10pJyksXHJcblx0XHRcdHRvcE1lbnU6ICQoJ3VsLm1lbnUnKSxcclxuXHRcdFx0bWVudURpdjogJCgnc2VjdGlvbi5oZWFkZXIgZGl2Lm1lbnUnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmdEaXY6ICQoJ2Rpdi5oZWFkaW5nJyksXHJcblx0XHRcdG1haW5IZWFkaW5nOiAkKCdkaXYuaGVhZGluZyBoMScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ1BhcjogJCgnZGl2LmhlYWRpbmcgcCcpLFxyXG5cdFx0XHRoZWFkZXJDdGE6ICQoJ2Rpdi5jdGEtaGVhZGVyJyksXHJcblx0XHRcdGpvYkRlc2NyaXB0aW9uQXJyb3c6ICQoJ2Rpdi5pY29uLXdyYXBwZXIgc3ZnLmFycm93JyksXHJcblx0XHRcdGpvYkRlc2NyaXB0aW9uOiAkKCd1bC5kZXNjcmlwdGlvbiBsaScpLFxyXG5cdFx0XHRnYWxsZXJ5SW1hZ2VzU21hbGw6ICQoJ2Rpdi5zbGlkZXItbmF2IGRpdi5pbWFnZXMnKSxcclxuXHRcdFx0YnJhbmRTcGFuczogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4uYnJhbmRzJyksXHJcblx0XHRcdGJyYW5kUG9wdXA6ICQoJ3NlY3Rpb24uYWJvdXQgcCBzcGFuLnBvcHVwJyksXHJcblx0XHRcdC8vIGdhbGxlcnlJbWc6ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKSxcdG5vdCBkZWZpbmVkXHJcblx0XHRcdC8vIG5hdkRvdHM6ICQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKSxcdG5vdCBkZWZpbmVkXHJcblx0XHRcdGltZ0JhY2s6ICQoJ2xpLmdhbGxlcnkgZGl2LmJhY2t3YXJkJyksXHJcblx0XHRcdGltZ0ZvcndhcmQ6ICQoJ2xpLmdhbGxlcnkgZGl2LmZvcndhcmQnKSxcclxuXHRcdFx0YWJvdXRTZWN0aW9uOiAkKCdzZWN0aW9uLmFib3V0JyksXHJcblx0XHRcdGNvbnRhY3RTZWN0aW9uOiAkKCdzZWN0aW9uLmNvbnRhY3QnKSxcclxuXHRcdFx0Zm9vdGVyU2VjdGlvbjogJCgnc2VjdGlvbi5mb290ZXInKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXBzaWxvbiA9ICgxMDAwIC8gNjAgLyBzZWxmLmNvbmZpZy5kdXJhdGlvbikgLyA0O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwwLjU4LDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMSwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuY29uZmlnLnNsaWRlcldyYXBwZXIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuaW5pdFNsaWRlciggJCh0aGlzKSApO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLmV2ZW50V2F0Y2goKTtcclxuXHRcdHNlbGYuZ2FsbGVyeVBpY3R1cmVBbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc1JhbmRvbUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzTG9nb0JveCgpO1xyXG5cdFx0c2VsZi5zY3JvbGxTcGVlZCggMTAwLCA1MDAgKTtcclxuXHJcblx0fTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzTG9nb0JveCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgbW91c2VYID0gMCxcclxuXHRcdG1vdXNlWSA9IDAsXHJcblx0XHRzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcuZG9jdW1lbnRPYmoub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0bW91c2VYID0gZS5wYWdlWDtcclxuXHRcdG1vdXNlWSA9IGUucGFnZVk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRcdCd0b3AnOiBtb3VzZVkgKyAxNSxcclxuXHRcdFx0XHQnbGVmdCc6IG1vdXNlWCArIDVcclxuXHRcdFx0fSkuc2hvdygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNSYW5kb21BbmltID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciByYW5kb21OdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KTtcclxuXHRcdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5lcShyYW5kb21OdW0pLmFkZENsYXNzKCdicmFuZC1hbmltJylcclxuXHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYnJhbmQtYW5pbScpO1xyXG5cdFx0fSwgMzAwMCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuZXZlbnRXYXRjaCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiA9IHNlbGYuc2VsZWN0ZWRHYWxsZXJ5LmRhdGEoJ2dhbGxlcnktY291bnQnKSxcclxuXHRcdFx0c2VsZWN0ZWRTbGlkZSA9IHNlbGYuc2xpZGVyLmNoaWxkcmVuKCdsaScpLmVxKDEpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlUG9zaXRpb24gPSB2aXNpYmxlU2xpZGUuaW5kZXgoKSxcclxuXHRcdFx0ZGlyZWN0aW9uID0gJ2dhbGxlcnknO1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRzZWxmLnVwZGF0ZVNsaWRlKHZpc2libGVTbGlkZSwgc2VsZWN0ZWRTbGlkZSwgZGlyZWN0aW9uLCBzZWxmLnN2Z0NvdmVyTGF5ZXIsIHNlbGYucGF0aEFycmF5LCBzZWxmLnN2Z1BhdGgpO1xyXG5cclxuXHRcdHNlbGYucmVuZGVyR2FsbGVyeSggc2VsZWN0ZWRTbGlkZVBvc2l0aW9uICk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2xpZGVyQmFjay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cdFx0dmFyXHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMCksXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnaG9tZSc7XHJcblx0XHRzZWxmLnVwZGF0ZVNsaWRlKHZpc2libGVTbGlkZSwgc2VsZWN0ZWRTbGlkZSwgZGlyZWN0aW9uLCBzZWxmLnN2Z0NvdmVyTGF5ZXIsIHNlbGYucGF0aEFycmF5LCBzZWxmLnN2Z1BhdGgpO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNpZGVNZW51SGlkZSgpO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwKSB7XHJcblx0XHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdFx0Z2FsbGVyeU5hbWUuYW5pbWF0ZSh7XHJcblx0XHRcdFx0b3BhY2l0eTogJzEnLFxyXG5cdFx0XHRcdGxldHRlclNwYWNpbmc6ICc0cHgnXHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGhvdmVyZWRHYWxsZXJ5ID0gJCh0aGlzKSxcclxuXHRcdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRcdG9wYWNpdHk6ICcwJyxcclxuXHRcdFx0XHRsZXR0ZXJTcGFjaW5nOiAnMTVweCdcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2VsZi5zbG93QW5jaG9yKCk7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgY2xpY2tlZEVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0Y2xpY2tlZEVsZW1JbmRleCA9IHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cuaW5kZXgoY2xpY2tlZEVsZW0pLFxyXG5cdFx0XHRcdFx0ZWxlbVRvU2hvdyA9IHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKGNsaWNrZWRFbGVtSW5kZXgpLFxyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdFx0ZWxlbVRvU2hvdy5hZGRDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24gYm91bmNlSW5VcCcpO1xyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0ucmVtb3ZlQ2xhc3MoJ2JvdW5jZUluVXAnKS5hZGRDbGFzcygnYm91bmNlT3V0RG93bicpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCk7XHJcblx0XHRcdFx0XHR9LCA4MDApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygnYm91bmNlSW5VcCcpLmFkZENsYXNzKCdib3VuY2VPdXREb3duJyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0fSwgODAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNlbGYucGljdHVyZVNsaWRlcigpO1xyXG5cclxuXHRzZWxmLmpvYlN3aXBlKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxuXHJcblx0c2VsZi50YXBFdmVudHMoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCBjb3VudGVyID4gMiApIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQrK2NvdW50ZXI7XHJcblx0XHRcdH0sIDI1MDApO1xyXG5cdFx0fVxyXG5cdFx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaGVhZGVyUGFyYWxsYXggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPCAxMDQwKSB7XHJcblx0XHRzZWxmLmNvbmZpZy5jb250YWN0U2VjdGlvbi5jc3Moe1xyXG5cdFx0XHQnei1pbmRleCc6IC0yXHJcblx0XHRcdC8vICdvcGFjaXR5JzogMFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLmNvbmZpZy53aW5kb3dPYmoub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcFBvcyA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRcclxuXHRcdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgdG9wUG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodG9wUG9zID49IDQ0MCAmJiBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdFx0c2VsZi5jb25maWcuY29udGFjdFNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0xXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5mb290ZXJTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLmNvbnRhY3RTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMlxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5jb25maWcuZm9vdGVyU2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW5pdFNsaWRlciA9IGZ1bmN0aW9uKCBzbGlkZXJXcmFwcGVyICkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyID0gc2xpZGVyV3JhcHBlci5maW5kKCd1bC5zbGlkZXInKTtcclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zbGlkZXItbmF2JykuZmluZCgnZGl2LmdhbGxlcnknKTtcclxuXHRzZWxmLnNsaWRlckJhY2sgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5iYWNrLWJ1dHRvbicpO1xyXG5cdHNlbGYuc3ZnQ292ZXJMYXllciA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnN2Zy1jb3ZlcicpO1xyXG5cdHZhciBwYXRoSWQgPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZmluZCgncGF0aCcpLmF0dHIoJ2lkJyk7XHJcblx0c2VsZi5zdmdQYXRoID0gbmV3IFNuYXAoJyMnICsgcGF0aElkKTtcclxuXHJcblx0c2VsZi5wYXRoQXJyYXlbMF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsxXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzJdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAyJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbM10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDcnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs0XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzVdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA4Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDQnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs3XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzhdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA1Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEwJyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmpvYlN3aXBlID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHQkKCdzZWN0aW9uLmpvYnMgZGl2Lmljb24td3JhcHBlcicpLnN3aXBlKHtcclxuXHRcdHN3aXBlTGVmdDogZnVuY3Rpb24oZXZlbnQsIGRpcmVjdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uLCBmaW5nZXJDb3VudCkge1xyXG5cdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dExlZnQnKTtcclxuXHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjIDwgMikge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjICsgMSkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgwKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c3dpcGVSaWdodDogZnVuY3Rpb24oZXZlbnQsIGRpcmVjdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uLCBmaW5nZXJDb3VudCkge1xyXG5cdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dFJpZ2h0Jyk7XHJcblx0XHRcdGpvYnMuZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dFJpZ2h0Jyk7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmIChzZWxlY3RlZERlc2MgPiAwKSB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgLSAxKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgLSAxKS5hZGRDbGFzcygnZmFkZUluTGVmdCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKDIpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKDIpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIDUwMCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRyZXNob2xkOiAwLFxyXG5cdFx0YWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXHJcblx0fSk7XHJcblxyXG5cdCQoJ2Rpdi5ib3JkZXJzIGRpdi5pY29uLXdyYXBwZXIgLmFycm93JykuZmlyc3QoKS5zd2lwZSh7XHJcblx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGVzYyA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJykuaW5kZXgoKTtcclxuXHJcblx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjID4gMCkge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCA1MDApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0cmVzaG9sZDogNTBcclxuXHR9KTtcclxuXHJcblx0JCgnZGl2LmJvcmRlcnMgZGl2Lmljb24td3JhcHBlciAuYXJyb3cnKS5sYXN0KCkuc3dpcGUoe1xyXG5cdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdHZhciBqb2JzID0gJCgnZGl2Lmljb24td3JhcHBlciBkaXYnKSxcclxuXHRcdFx0XHRzZWxlY3RlZERlc2MgPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpLmluZGV4KCk7XHJcblxyXG5cdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRMZWZ0Jyk7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmIChzZWxlY3RlZERlc2MgPCAyKSB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgKyAxKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjICsgMSkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoMCkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCA1MDApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0cmVzaG9sZDogNTBcclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5uYXZEb3QgPSBmdW5jdGlvbigpIHtcclxuXHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY2xpY2tlZERvdEluZGV4ID0gJCh0aGlzKS5pbmRleCgpLFxyXG5cdFx0XHR0b3BJbWdEb3QgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykuZmlsdGVyKCcudG9wLWltYWdlJykuaW5kZXgoKSxcclxuXHRcdFx0ZGVzYyA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKSxcclxuXHRcdFx0YWxsQ2xhc3NlcyA9ICdjdXJyZW50LWRlc2NyaXB0aW9uIGJvdW5jZU91dExlZnQgYm91bmNlT3V0UmlnaHQgZ28tZm9yd2FyZCBnby1iYWNrJztcclxuXHJcblx0XHRpZiAoIGNsaWNrZWREb3RJbmRleCA+IHRvcEltZ0RvdCApIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoYWxsQ2xhc3Nlcyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0ZGVzYy5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0fSwgMzAwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKGFsbENsYXNzZXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGRlc2MuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdH0sIDMwMCk7XHJcblx0XHR9XHJcblx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZScpO1xyXG5cdFx0JCh0aGlzKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ2JvdW5jZUluJyk7XHJcblx0XHR9LCAxMDAwKTtcclxuXHR9KTsgXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucGljdHVyZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0c2VsZi5jb25maWcuaW1nQmFjay5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlsdGVyKCcudmlzaWJsZS1pbWFnZScpLFxyXG5cdFx0XHR0b3BJbWdJbmRleCA9IHRvcEltZy5pbmRleCgpLFxyXG5cdFx0XHRhbGxJbWdzID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmxlbmd0aCxcclxuXHRcdFx0ZGVzYyA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKTtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4ID4gMCApIHtcclxuXHRcdFx0dmFyIHByZXZJbWcgPSB0b3BJbWdJbmRleCAtIDE7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjayBib3VuY2VPdXRSaWdodCcpLmVxKHByZXZJbWcpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2snKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrIGJvdW5jZU91dFJpZ2h0JykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2snKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5jb25maWcuaW1nRm9yd2FyZC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlsdGVyKCcudmlzaWJsZS1pbWFnZScpLFxyXG5cdFx0XHR0b3BJbWdJbmRleCA9IHRvcEltZy5pbmRleCgpLFxyXG5cdFx0XHRhbGxJbWdzID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmxlbmd0aFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0dmFyIG5leHRJbWcgPSB0b3BJbWdJbmRleCArIDE7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEobmV4dEltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGJvdW5jZU91dExlZnQnKS5lcShuZXh0SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKDApLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKDApLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEoMCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJldHJpZXZlVmlzaWJsZVNsaWRlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcclxuXHRyZXR1cm4gdGhpcy5zbGlkZXIuZmluZCgnbGkudmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNpZGVNZW51SGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZiAoIHBvc2l0aW9uIDw9IDQ0MCB8fCBwb3NpdGlvbiA9PT0gMCApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE5MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTIwKTtcclxuXHRcdH0pXHJcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnRhcEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgMTA0MCkge1xyXG5cdFx0JCgnZGl2LmltYWdlcyBkaXYuZ2FsbGVyeScpLnN3aXBlKHtcclxuXHRcdFx0ZG91YmxlVGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSAkKHRhcmdldCk7XHJcblx0XHRcdFx0dmFyIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiA9IHNlbGYuc2VsZWN0ZWRHYWxsZXJ5LmRhdGEoJ2dhbGxlcnktY291bnQnKSxcclxuXHRcdFx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHRcdFx0dmlzaWJsZVNsaWRlUG9zaXRpb24gPSB2aXNpYmxlU2xpZGUuaW5kZXgoKSxcclxuXHRcdFx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdFx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRzZWxmLnVwZGF0ZVNsaWRlKHZpc2libGVTbGlkZSwgc2VsZWN0ZWRTbGlkZSwgZGlyZWN0aW9uLCBzZWxmLnN2Z0NvdmVyTGF5ZXIsIHNlbGYucGF0aEFycmF5LCBzZWxmLnN2Z1BhdGgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dHJlc2hvbGQ6IDUwLFxyXG5cdFx0XHRhbGxvd1BhZ2VTY3JvbGw6ICdhdXRvJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnZGl2Lm1lbnUgZGl2LnNtYWxsLXdpZHRoJykuc3dpcGUoe1xyXG5cdFx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0XHR2YXIgbWVudUl0ZW1zID0gJCgnZGl2Lm1lbnUgdWwubWVudSBsaScpLFxyXG5cdFx0XHRcdFx0bWVudUxpbmVzID0gJCgnZGl2Lm1lbnUgZGl2LnNtYWxsLXdpZHRoIHNwYW4nKTtcclxuXHJcblx0XHRcdFx0aWYgKG1lbnVJdGVtcy5oYXNDbGFzcygnc2hvdy1tZW51JykpIHtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5lcSgxKS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdub25lJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmxhc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ25vbmUnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRtZW51SXRlbXMucmVtb3ZlQ2xhc3MoJ2ZsaXBJblgnKS5hZGRDbGFzcygnZmxpcE91dFgnKTtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoMCwwLDAsMC41KScpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0bWVudUl0ZW1zLnJlbW92ZUNsYXNzKCkuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoMCwwLDAsMC41KScpO1xyXG5cdFx0XHRcdFx0fSwgNjAwKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmVxKDEpLmFkZENsYXNzKCdmYWRlT3V0Jyk7XHJcblx0XHRcdFx0XHRtZW51TGluZXMuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3JvdGF0ZVooLTQ1ZGVnKSB0cmFuc2xhdGUoLTdweCwgMTFweCknXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRtZW51TGluZXMubGFzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAncm90YXRlWig0NWRlZykgdHJhbnNsYXRlKC05cHgsIC0xMnB4KSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSgwLDAsMCwxKScpO1xyXG5cdFx0XHRcdFx0bWVudUl0ZW1zLmFkZENsYXNzKCdzaG93LW1lbnUgZmxpcEluWCcpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDAsMCwwLDEpJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhbGxvd1BhZ2VTY3JvbGw6IFwibm9uZVwiXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyAkKCdkaXYubWVudSB1bC5tZW51IGxpLnNob3ctbWVudSBhJykuc3dpcGUoe1xyXG5cdFx0Ly8gXHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdC8vIFx0XHRjb25zb2xlLmxvZyh0YXJnZXQpO1xyXG5cdFx0Ly8gXHRcdHZhciBtZW51SXRlbXMgPSAkKCdkaXYubWVudSB1bC5tZW51IGxpJyksXHJcblx0XHQvLyBcdFx0XHRtZW51TGluZXMgPSAkKCdkaXYubWVudSBkaXYuc21hbGwtd2lkdGggc3BhbicpO1xyXG5cclxuXHRcdC8vIFx0XHRtZW51TGluZXMuZXEoMSkucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdC8vIFx0XHRtZW51TGluZXMuZmlyc3QoKS5jc3Moe1xyXG5cdFx0Ly8gXHRcdFx0J3RyYW5zZm9ybSc6ICdub25lJ1xyXG5cdFx0Ly8gXHRcdH0pO1xyXG5cclxuXHRcdC8vIFx0XHRtZW51TGluZXMubGFzdCgpLmNzcyh7XHJcblx0XHQvLyBcdFx0XHQndHJhbnNmb3JtJzogJ25vbmUnXHJcblx0XHQvLyBcdFx0fSk7XHJcblxyXG5cdFx0Ly8gXHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcygnZmxpcEluWCcpLmFkZENsYXNzKCdmbGlwT3V0WCcpO1xyXG5cdFx0Ly8gXHRcdC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBcdFx0XHRtZW51SXRlbXMucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdC8vIFx0XHQvLyB9LCA2MDApO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9KTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUudXBkYXRlU2xpZGUgPSBmdW5jdGlvbiggb2xkU2xpZGUsIG5ld1NsaWRlLCBkaXJlY3Rpb24sIHN2Z0NvdmVyTGF5ZXIsIHBhdGhzLCBzdmdQYXRoICkge1xyXG5cdHZhciBwYXRoMSA9IDAsXHJcblx0XHRwYXRoMiA9IDAsXHJcblx0XHRwYXRoMyA9IDAsXHJcblx0XHRwYXRoNCA9IDAsXHJcblx0XHRwYXRoNSA9IDA7XHJcblxyXG5cdGlmICggZGlyZWN0aW9uID09PSAnZ2FsbGVyeScpIHtcclxuXHRcdHBhdGgxID0gcGF0aHNbMF07XHJcblx0XHRwYXRoMiA9IHBhdGhzWzJdO1xyXG5cdFx0cGF0aDMgPSBwYXRoc1s0XTtcclxuXHRcdHBhdGg0ID0gcGF0aHNbNl07XHJcblx0XHRwYXRoNSA9IHBhdGhzWzhdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzFdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1szXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNV07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzddO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s5XTtcclxuXHR9XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c3ZnQ292ZXJMYXllci5hZGRDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcblx0c3ZnUGF0aC5hdHRyKCdkJywgcGF0aDEpO1xyXG5cdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoMn0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLmZpcnN0QW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoM30sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLnNlY29uZEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG9sZFNsaWRlLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdG5ld1NsaWRlLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdGlmICggc2VsZi5jb25maWcubWFpblNsaWRlLmhhc0NsYXNzKCd2aXNpYmxlJykgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcChzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoNH0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLmZpcnN0QW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoNX0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLnNlY29uZEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHN2Z0NvdmVyTGF5ZXIucmVtb3ZlQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sIHNlbGYuY29uZmlnLmRlbGF5KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIE1ha2V1cCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgaW5pdFNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2luaXRTbGlkZXInKTtcclxudmFyIHJldHJpZXZlVmlzaWJsZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUnKTtcclxudmFyIGhlYWRlclBhcmFsbGF4ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaGVhZGVyUGFyYWxsYXgnKTtcclxudmFyIHVwZGF0ZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvdXBkYXRlU2xpZGUnKTtcclxudmFyIGV2ZW50V2F0Y2ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9ldmVudFdhdGNoJyk7XHJcbnZhciBnYWxsZXJ5UGljdHVyZUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9nYWxsZXJ5UGljdHVyZUFuaW0nKTtcclxudmFyIHBpY3R1cmVTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9waWN0dXJlU2xpZGVyJyk7XHJcbnZhciBicmFuZHNSYW5kb21BbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbScpO1xyXG52YXIgYnJhbmRzTG9nb0JveCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc0xvZ29Cb3gnKTtcclxudmFyIHNpZGVNZW51SGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3NpZGVNZW51SGlkZScpO1xyXG52YXIgc2xvd0FuY2hvciA9IHJlcXVpcmUoJy4vdG9vbHMvc2xvd0FuY2hvcicpO1xyXG52YXIgYmV6aWVyID0gcmVxdWlyZSgnLi90b29scy9iZXppZXInKTtcclxudmFyIHNjcm9sbFNwZWVkID0gcmVxdWlyZSgnLi90b29scy9zY3JvbGxTcGVlZCcpO1xyXG52YXIgdG1wbENvbmZpZyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3RtcGxDb25maWcnKTtcclxudmFyIHJlbmRlckdhbGxlcnkgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5Jyk7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdGVtcGxhdGVzJyk7XHJcbnZhciBuYXZEb3QgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9uYXZEb3QnKTtcclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9oZWxwZXJzJyk7XHJcbnZhciBqb2JTd2lwZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2pvYlN3aXBlJyk7XHJcbnZhciB0YXBFdmVudHMgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy90YXBFdmVudHMnKTtcclxuXHJcbnZhciBtYWtldXAgPSBuZXcgTWFrZXVwKCk7IiwibW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdkZXNjcmlwdGlvbkhlbHBlcicsIGZ1bmN0aW9uKGFyZykge1xyXG5cdHZhciBvcGVuVGFnID0gXCI8cD5cIixcclxuXHRcdGNsb3NlVGFnID0gXCI8L3A+XFxyXFxuXCI7XHJcblx0aWYgKGFyZykge1xyXG5cdFx0cmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoXHJcblx0XHRvcGVuVGFnXHJcblx0XHQrIGFyZy5mbih0aGlzKVxyXG5cdFx0KyBjbG9zZVRhZyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgZ2FsbGVyeSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucmVuZGVyR2FsbGVyeSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucGljdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmICggTnVtYmVyKHNlbGYucGljdHVyZXNbaV0uaWQpID09PSBhcmcgKSB7XHJcblx0XHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcy5wdXNoKHNlbGYucGljdHVyZXNbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHJlbmRlcmVkUGljcyA9IGdhbGxlcnkuZ2FsbGVyeSh7cGljczogc2VsZi5zZWxlY3RlZFBpY3R1cmVzfSk7XHJcblx0JCgnI3RtcGwtd3JhcHBlcicpLmh0bWwocmVuZGVyZWRQaWNzKTtcclxuXHJcblx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpcnN0KCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UnKTtcclxuXHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykuZmlyc3QoKS5hZGRDbGFzcygndG9wLWltYWdlJyk7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpLmZpcnN0KCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24nKTtcclxuXHRcclxuXHRzZWxmLm5hdkRvdCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwibW9kdWxlLmV4cG9ydHNbXCJnYWxsZXJ5XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXIsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiXHRcdFx0PGxpPjxpbWcgc3JjPVxcXCJhc3NldHMvaW1hZ2VzL1wiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maWxlUGF0aCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZmlsZVBhdGggOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImZpbGVQYXRoXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgYWx0PVxcXCJcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuaWQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmlkIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJpZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPjwvbGk+XFxyXFxuXCI7XG59LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICByZXR1cm4gXCJcdFx0PHNwYW4+PC9zcGFuPlxcclxcblwiO1xufSxcIjVcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zLCBhbGlhczE9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczI9XCJmdW5jdGlvblwiLCBhbGlhczM9aGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcsIGJ1ZmZlciA9IFxuICBcIlx0PGRpdiBjbGFzcz1cXFwicGljdHVyZS1kZXNjcmlwdGlvblxcXCI+XFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEwLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcclxcblx0PC9kaXY+XFxyXFxuXCI7XG59LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maXJzdExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpcnN0TGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlyc3RMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2Vjb25kTGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2Vjb25kTGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwic2Vjb25kTGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCIxMFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aGlyZExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRoaXJkTGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwidGhpcmRMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuIFwiPHVsIGNsYXNzPVxcXCJnYWxsZXJ5LWltYWdlc1xcXCI+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPC91bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJuYXYtZG90c1xcXCI+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPC9kaXY+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg1LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIik7XG59LFwidXNlRGF0YVwiOnRydWV9KTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuZnVuY3Rpb24gUGljdHVyZShpZCwgZmlsZVBhdGgsIGZpcnN0TGluZSwgc2Vjb25kTGluZSwgdGhpcmRMaW5lLCBiZ0RhcmspIHtcclxuXHR0aGlzLmlkID0gaWQ7XHJcblx0dGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG5cdHRoaXMuZmlyc3RMaW5lID0gZmlyc3RMaW5lO1xyXG5cdHRoaXMuc2Vjb25kTGluZSA9IHNlY29uZExpbmU7XHJcblx0dGhpcy50aGlyZExpbmUgPSB0aGlyZExpbmU7XHJcblx0dGhpcy5iZ0RhcmsgPSBiZ0Rhcms7XHJcbn1cclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucGljdHVyZXMgPSBbXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMS5qcGcnLCAnVHJlc3prYWkgQW5ldHQnLCAnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcyLmpwZycsICdTemFiw7MgQ3NpbGxhJywgJ0NzaWxsYWdrw6lwJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmczLmpwZycsICdMYWNhIFNvw7NzJywgJ1Bob3RvZ3JhcGh5JywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmc0LmpwZycsICdHw6Fib3IgR2liYsOzIEtpc3MnLCAnR2liYsOzQXJ0IFBob3RvZ3JhcHknLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzUuanBnJywgJ0JlcnTDs2sgVmlkZW8gJiBQaG90bycsICcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDEuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N1bmJsb29tJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QyLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdNZXllciBFc3p0ZXItVmlyw6FnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QzLmpwZycsICdQcm9rb3AgS2F0YSBTbWlua2lza29sYScsICdzbWlua3ZlcnNlbnllJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24xLmpwZycsICdCw6FueWFpIELDoWxpbnQnLCAnQ3NvcmrDoW4gS3Jpc3p0YScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMi5qcGcnLCAnRm90w7MgQmF6c2EgS2lzLUhvcnbDoXRoJywgJ0jDoXJpIEhham5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24zLmpwZycsICdLYXVuaXR6IFRhbcOhcycsICdUw7N0aCBBbGV4YW5kcmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjQuanBnJywgJ055ZXJzIEF0dGlsYScsICdTdHlhc3puaSBEb3JpbmEnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjUuanBnJywgJ055ZXJzIEF0dGlsYScsICdTdHlhc3puaSBEb3JpbmEnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjYuanBnJywgJ055ZXJzIEF0dGlsYScsICdUYXViZXIgS2luZ2EnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjcuanBnJywgJ055ZXJzIEF0dGlsYScsICdUYXViZXIgS2luZ2EnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjguanBnJywgJ1plbXNlIFNBVVJJQSBrb2xsZWtjacOzJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N6dHllaGxpayBJbGRpa8OzJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjkuanBnJywgJ1plbXNlIFNBVVJJQSBrb2xsZWtjacOzJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1ZlbmNlbCBLcmlzenRpbmEnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTEuanBnJywgJ0RlYnJlY3ppIErDoW5vcycsICdEZWJyZWN6aSBKw6Fub3MgRm90b2dyw6FmaWEnLCAnU8OhbmRvciBOb8OpbWknLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Mi5qcGcnLCAnR2FicmllbGxhIEJhcmFueWknLCAnTW9kZWxsIFZpa3RvcmlhIFNhbGV0cm9zJywgJycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkzLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTdW5ibG9vbScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTQuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ01leWVyIEVzenRlci1WaXLDoWcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk1LmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTesWxY3MgS3Jpc3p0aW5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Ni5qcGcnLCAnU3phYm8gTWlrbG9zJywgJ1NjaGVsbGVuYmVyZ2VyIFpzdXpzYW5uYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTcuanBnJywgJ1N6aXN6aWsgRMOhbmllbCcsICdGw7xnZWRpIETDs3JhIFTDrW1lYScsICcnLCBmYWxzZSlcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJlemllciA9IGZ1bmN0aW9uKCB4MSwgeTEsIHgyLCB5MiwgZXBzaWxvbiApIHtcclxuXHJcblx0dmFyIGN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogdiAqIHYgKiB0ICogeDEgKyAzICogdiAqIHQgKiB0ICogeDIgKyB0ICogdCAqIHQ7XHJcblx0fTtcclxuXHJcblx0dmFyIGN1cnZlWSA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogdiAqIHYgKiB0ICogeTEgKyAzICogdiAqIHQgKiB0ICogeTIgKyB0ICogdCAqIHQ7XHJcblx0fTtcclxuXHJcblx0dmFyIGRlcml2YXRpdmVDdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqICgyICogKHQgLSAxKSAqIHQgKyB2ICogdikgKiB4MSArIDMgKiAoLSB0ICogdCAqIHQgKyAyICogdiAqIHQpICogeDI7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKHQpe1xyXG5cclxuXHRcdHZhciB4ID0gdCwgdDAsIHQxLCB0MiwgeDIsIGQyLCBpO1xyXG5cclxuXHRcdC8vIEZpcnN0IHRyeSBhIGZldyBpdGVyYXRpb25zIG9mIE5ld3RvbidzIG1ldGhvZCAtLSBub3JtYWxseSB2ZXJ5IGZhc3QuXHJcblx0XHRmb3IgKHQyID0geCwgaSA9IDA7IGkgPCA4OyBpKyspe1xyXG5cdFx0XHR4MiA9IGN1cnZlWCh0MikgLSB4O1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIpIDwgZXBzaWxvbikgcmV0dXJuIGN1cnZlWSh0Mik7XHJcblx0XHRcdGQyID0gZGVyaXZhdGl2ZUN1cnZlWCh0Mik7XHJcblx0XHRcdGlmIChNYXRoLmFicyhkMikgPCAxZS02KSBicmVhaztcclxuXHRcdFx0dDIgPSB0MiAtIHgyIC8gZDI7XHJcblx0XHR9XHJcblxyXG5cdFx0dDAgPSAwOyB0MSA9IDE7IHQyID0geDtcclxuXHJcblx0XHRpZiAodDIgPCB0MCkgcmV0dXJuIGN1cnZlWSh0MCk7XHJcblx0XHRpZiAodDIgPiB0MSkgcmV0dXJuIGN1cnZlWSh0MSk7XHJcblxyXG5cdFx0Ly8gRmFsbGJhY2sgdG8gdGhlIGJpc2VjdGlvbiBtZXRob2QgZm9yIHJlbGlhYmlsaXR5LlxyXG5cdFx0d2hpbGUgKHQwIDwgdDEpe1xyXG5cdFx0XHR4MiA9IGN1cnZlWCh0Mik7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MiAtIHgpIDwgZXBzaWxvbikgcmV0dXJuIGN1cnZlWSh0Mik7XHJcblx0XHRcdGlmICh4ID4geDIpIHQwID0gdDI7XHJcblx0XHRcdGVsc2UgdDEgPSB0MjtcclxuXHRcdFx0dDIgPSAodDEgLSB0MCkgKiAwLjUgKyB0MDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGYWlsdXJlXHJcblx0XHRyZXR1cm4gY3VydmVZKHQyKTtcclxuXHJcblx0fTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuXHRtYWtldXAucHJvdG90eXBlLnNjcm9sbFNwZWVkID0gZnVuY3Rpb24oc3RlcCwgc3BlZWQsIGVhc2luZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KSxcclxuICAgICAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcclxuICAgICAgICAgICAgJGJvZHkgPSAkKCdodG1sLCBib2R5JyksXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IGVhc2luZyB8fCAnZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIHJvb3QgPSAwLFxyXG4gICAgICAgICAgICBzY3JvbGwgPSBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsWSxcclxuICAgICAgICAgICAgc2Nyb2xsWCxcclxuICAgICAgICAgICAgdmlldztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZClcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAkd2luZG93Lm9uKCdtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhWSxcclxuICAgICAgICAgICAgICAgIGRldGFpbCA9IGUub3JpZ2luYWxFdmVudC5kZXRhaWw7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxZID0gJGRvY3VtZW50LmhlaWdodCgpID4gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFggPSAkZG9jdW1lbnQud2lkdGgoKSA+ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC5oZWlnaHQoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LndpZHRoKCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbExlZnQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuZWFzaW5nLmRlZmF1bHQgPSBmdW5jdGlvbiAoeCx0LGIsYyxkKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIC1jICogKCh0PXQvZC0xKSp0KnQqdCAtIDEpICsgYjtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNsb3dBbmNob3IgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dGhpcy5jb25maWcuYWxsQW5jaG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSA9PT0gdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgJiYgbG9jYXRpb24uaG9zdG5hbWUgPT09IHRoaXMuaG9zdG5hbWUpIHtcclxuXHRcdFx0dmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xyXG5cdFx0XHRpZiAoIHRhcmdldC5sZW5ndGggKSB7XHJcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXHJcblx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiXX0=
