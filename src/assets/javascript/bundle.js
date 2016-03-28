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

		treshold: 0
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
			tap: function(event, target) {
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

			treshold: 50
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
					setTimeout(function() {
						menuItems.removeClass();
					}, 600);
				} else {
					menuLines.eq(1).addClass('fadeOut');
					menuLines.first().css({
						'transform': 'rotateZ(-45deg) translate(-7px, 11px)'
					});

					menuLines.last().css({
						'transform': 'rotateZ(45deg) translate(-9px, -12px)'
					});

					menuItems.addClass('show-menu flipInX');
				}
			}
		});

		$('ul.menu li.show-menu a').swipe({
			tap: function(event, target) {
				console.log('tapped anchor');
				var menuItems = $('div.menu ul.menu li'),
					menuLines = $('div.menu div.small-width span');

				menuLines.eq(1).removeClass();
				menuLines.first().css({
					'transform': 'none'
				});

				menuLines.last().css({
					'transform': 'none'
				});

				menuItems.removeClass('flipInX').addClass('flipOutX');
				// setTimeout(function() {
					menuItems.removeClass();
				// }, 600);
			}
		});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvam9iU3dpcGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL25hdkRvdC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdGFwRXZlbnRzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9oZWxwZXJzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFxyXG5cclxuXHRmdW5jdGlvbiBNYWtldXAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXIgPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJCYWNrID0ge307XHJcblx0XHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSB7fTtcclxuXHRcdHNlbGYuc3ZnUGF0aCA9IHt9O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYucGF0aEFycmF5ID0gW107XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnID0ge1xyXG5cdFx0XHR3aW5kb3dPYmo6ICQod2luZG93KSxcclxuXHRcdFx0ZG9jdW1lbnRPYmo6ICQoZG9jdW1lbnQpLFxyXG5cdFx0XHRtZW51OiAkKCd1bC5tZW51IGxpIGEnKSxcclxuXHRcdFx0c2lkZU1lbnVTY3JvbGw6ICQoJ2Rpdi5zY3JvbGwtbWVudScpLFxyXG5cdFx0XHRzbGlkZXJXcmFwcGVyOiAkKCdkaXYuc2xpZGVyLXdyYXBwZXInKSxcclxuXHRcdFx0bWFpblNsaWRlOiAkKCd1bC5zbGlkZXIgbGk6Zmlyc3QtY2hpbGQnKSxcclxuXHRcdFx0ZHVyYXRpb246IDMwMCxcclxuXHRcdFx0ZGVsYXk6IDMwMCxcclxuXHRcdFx0YWxsQW5jaG9yOiAkKCdhW2hyZWYqPVxcXFwjXTpub3QoW2hyZWY9XFxcXCNdKScpLFxyXG5cdFx0XHR0b3BNZW51OiAkKCd1bC5tZW51JyksXHJcblx0XHRcdG1lbnVEaXY6ICQoJ3NlY3Rpb24uaGVhZGVyIGRpdi5tZW51JyksXHJcblx0XHRcdG1haW5IZWFkaW5nRGl2OiAkKCdkaXYuaGVhZGluZycpLFxyXG5cdFx0XHRtYWluSGVhZGluZzogJCgnZGl2LmhlYWRpbmcgaDEnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmdQYXI6ICQoJ2Rpdi5oZWFkaW5nIHAnKSxcclxuXHRcdFx0aGVhZGVyQ3RhOiAkKCdkaXYuY3RhLWhlYWRlcicpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbkFycm93OiAkKCdkaXYuaWNvbi13cmFwcGVyIHN2Zy5hcnJvdycpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbjogJCgndWwuZGVzY3JpcHRpb24gbGknKSxcclxuXHRcdFx0Z2FsbGVyeUltYWdlc1NtYWxsOiAkKCdkaXYuc2xpZGVyLW5hdiBkaXYuaW1hZ2VzJyksXHJcblx0XHRcdGJyYW5kU3BhbnM6ICQoJ3NlY3Rpb24uYWJvdXQgcCBzcGFuLmJyYW5kcycpLFxyXG5cdFx0XHRicmFuZFBvcHVwOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5wb3B1cCcpLFxyXG5cdFx0XHQvLyBnYWxsZXJ5SW1nOiAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJyksXHRub3QgZGVmaW5lZFxyXG5cdFx0XHQvLyBuYXZEb3RzOiAkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJyksXHRub3QgZGVmaW5lZFxyXG5cdFx0XHRpbWdCYWNrOiAkKCdsaS5nYWxsZXJ5IGRpdi5iYWNrd2FyZCcpLFxyXG5cdFx0XHRpbWdGb3J3YXJkOiAkKCdsaS5nYWxsZXJ5IGRpdi5mb3J3YXJkJyksXHJcblx0XHRcdGFib3V0U2VjdGlvbjogJCgnc2VjdGlvbi5hYm91dCcpLFxyXG5cdFx0XHRjb250YWN0U2VjdGlvbjogJCgnc2VjdGlvbi5jb250YWN0JyksXHJcblx0XHRcdGZvb3RlclNlY3Rpb246ICQoJ3NlY3Rpb24uZm9vdGVyJylcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGVwc2lsb24gPSAoMTAwMCAvIDYwIC8gc2VsZi5jb25maWcuZHVyYXRpb24pIC8gNDtcclxuXHRcdHNlbGYuZmlyc3RBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMC41OCwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuc2Vjb25kQW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDEsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLmNvbmZpZy5zbGlkZXJXcmFwcGVyLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmluaXRTbGlkZXIoICQodGhpcykgKTtcclxuXHRcdH0pO1xyXG5cdFx0c2VsZi5ldmVudFdhdGNoKCk7XHJcblx0XHRzZWxmLmdhbGxlcnlQaWN0dXJlQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNSYW5kb21BbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc0xvZ29Cb3goKTtcclxuXHRcdHNlbGYuc2Nyb2xsU3BlZWQoIDEwMCwgNTAwICk7XHJcblxyXG5cdH07IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc0xvZ29Cb3ggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIG1vdXNlWCA9IDAsXHJcblx0XHRtb3VzZVkgPSAwLFxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuY29uZmlnLmRvY3VtZW50T2JqLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdG1vdXNlWCA9IGUucGFnZVg7XHJcblx0XHRtb3VzZVkgPSBlLnBhZ2VZO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0XHQndG9wJzogbW91c2VZICsgMTUsXHJcblx0XHRcdFx0J2xlZnQnOiBtb3VzZVggKyA1XHJcblx0XHRcdH0pLnNob3coKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5uZXh0KCkuaGlkZSgpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzUmFuZG9tQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNik7XHJcblx0XHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMuZXEocmFuZG9tTnVtKS5hZGRDbGFzcygnYnJhbmQtYW5pbScpXHJcblx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2JyYW5kLWFuaW0nKTtcclxuXHRcdH0sIDMwMDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmV2ZW50V2F0Y2ggPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0aGlzKTtcclxuXHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNsaWRlckJhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhclx0c2VsZWN0ZWRTbGlkZSA9IHNlbGYuc2xpZGVyLmNoaWxkcmVuKCdsaScpLmVxKDApLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0ZGlyZWN0aW9uID0gJ2hvbWUnO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zaWRlTWVudUhpZGUoKTtcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCkge1xyXG5cdFx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGhvdmVyZWRHYWxsZXJ5ID0gJCh0aGlzKSxcclxuXHRcdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRcdG9wYWNpdHk6ICcxJyxcclxuXHRcdFx0XHRsZXR0ZXJTcGFjaW5nOiAnNHB4J1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdFx0Z2FsbGVyeU5hbWUgPSBob3ZlcmVkR2FsbGVyeS5maW5kKCdoMicpO1xyXG5cdFx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0XHRvcGFjaXR5OiAnMCcsXHJcblx0XHRcdFx0bGV0dGVyU3BhY2luZzogJzE1cHgnXHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNlbGYuc2xvd0FuY2hvcigpO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwKSB7XHJcblx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGNsaWNrZWRFbGVtID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRcdGVsZW1Ub1Nob3cgPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShjbGlja2VkRWxlbUluZGV4KSxcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhZWxlbVRvU2hvdy5oYXNDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24nKSApIHtcclxuXHRcdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uIGJvdW5jZUluVXAnKTtcclxuXHRcdFx0XHRcdGN1cnJlbnRFbGVtLnJlbW92ZUNsYXNzKCdib3VuY2VJblVwJykuYWRkQ2xhc3MoJ2JvdW5jZU91dERvd24nKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLm5vdChlbGVtVG9TaG93KS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0fSwgODAwKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0ucmVtb3ZlQ2xhc3MoJ2JvdW5jZUluVXAnKS5hZGRDbGFzcygnYm91bmNlT3V0RG93bicpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0Y3VycmVudEVsZW0ucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdFx0XHRcdH0sIDgwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnBpY3R1cmVTbGlkZXIoKTtcclxuXHJcblx0c2VsZi5qb2JTd2lwZSgpO1xyXG5cclxuXHRzZWxmLmhlYWRlclBhcmFsbGF4KCk7XHJcblxyXG5cdHNlbGYudGFwRXZlbnRzKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuZ2FsbGVyeVBpY3R1cmVBbmltID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNvdW50ZXIgPSAwLFxyXG5cdFx0c2VsZiA9IHRoaXMsXHJcblx0XHRiZ1dlZGRpbmcgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzEtc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmczLXNtYWxsLmpwZydcclxuXHRcdF0sXHJcblx0XHRiZ0Zhc2hpb24gPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjEtc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24zLXNtYWxsLmpwZydcclxuXHRcdF0sXHJcblx0XHRiZ0JlYXV0eSA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvYmVhdXR5L2JlYXV0eTEtc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvYmVhdXR5L2JlYXV0eTItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvYmVhdXR5L2JlYXV0eTMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQ29udGVzdCA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDMtc21hbGwuanBnJ1xyXG5cdFx0XTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1hZ2VzU21hbGwuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnV2VkZGluZ1tjb3VudGVyXSArICcpJ1xyXG5cdFx0fSkubmV4dCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdGYXNoaW9uW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0fSkubmV4dCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdDb250ZXN0W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KTtcclxuXHRcdCsrY291bnRlcjtcclxuXHJcblx0XHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwKSB7XHJcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICggY291bnRlciA+IDIgKSB7XHJcblx0XHRcdFx0XHRjb3VudGVyID0gMDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnV2VkZGluZ1tjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KS5uZXh0KCkuZGVsYXkoMjUwMCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KS5uZXh0KCkuZGVsYXkoMjUwMCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdDb250ZXN0W2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Kytjb3VudGVyO1xyXG5cdFx0XHR9LCAyNTAwKTtcclxuXHRcdH1cclxuXHRcdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmhlYWRlclBhcmFsbGF4ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgMTA0MCkge1xyXG5cdFx0c2VsZi5jb25maWcuY29udGFjdFNlY3Rpb24uY3NzKHtcclxuXHRcdFx0J3otaW5kZXgnOiAtMlxyXG5cdFx0XHQvLyAnb3BhY2l0eSc6IDBcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BQb3MgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHJcblx0XHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIHRvcFBvcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRvcFBvcyA+PSA0NDAgJiYgc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPCAxMDQwKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLmNvbnRhY3RTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5jb25maWcuZm9vdGVyU2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTFcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5jb250YWN0U2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTJcclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGYuY29uZmlnLmZvb3RlclNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0yXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdG9wUG9zID49IDQ0MCAmJiBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDAgKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCd0b3AnLCA0NDAgLSAodG9wUG9zIC8gMjAwKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuY29uZmlnLm1haW5IZWFkaW5nRGl2LmNzcyh7XHJcblx0XHRcdCdvcGFjaXR5JzogMSAtICggdG9wUG9zIC8gMzAwICksXHJcblx0XHRcdCdtYXJnaW4tdG9wJzogMjA3IC0gKHRvcFBvcyAvIDUpXHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5oZWFkZXJDdGEuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAxNSAtICh0b3BQb3MgLyAxMylcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmluaXRTbGlkZXIgPSBmdW5jdGlvbiggc2xpZGVyV3JhcHBlciApIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlciA9IHNsaWRlcldyYXBwZXIuZmluZCgndWwuc2xpZGVyJyk7XHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuc2xpZGVyLW5hdicpLmZpbmQoJ2Rpdi5nYWxsZXJ5Jyk7XHJcblx0c2VsZi5zbGlkZXJCYWNrID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuYmFjay1idXR0b24nKTtcclxuXHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zdmctY292ZXInKTtcclxuXHR2YXIgcGF0aElkID0gc2VsZi5zdmdDb3ZlckxheWVyLmZpbmQoJ3BhdGgnKS5hdHRyKCdpZCcpO1xyXG5cdHNlbGYuc3ZnUGF0aCA9IG5ldyBTbmFwKCcjJyArIHBhdGhJZCk7XHJcblxyXG5cdHNlbGYucGF0aEFycmF5WzBdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbMV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDYnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsyXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzNdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA3Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDMnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs1XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOCcpO1xyXG5cdHNlbGYucGF0aEFycmF5WzZdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA0Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbN10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDknKTtcclxuXHRzZWxmLnBhdGhBcnJheVs4XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzldID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxMCcpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5qb2JTd2lwZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0JCgnc2VjdGlvbi5qb2JzIGRpdi5pY29uLXdyYXBwZXInKS5zd2lwZSh7XHJcblx0XHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGVzYyA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJykuaW5kZXgoKTtcclxuXHJcblx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRMZWZ0Jyk7XHJcblx0XHRcdGpvYnMuZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dExlZnQnKTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA8IDIpIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgKyAxKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgwKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoMCkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIDUwMCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN3aXBlUmlnaHQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGVzYyA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJykuaW5kZXgoKTtcclxuXHJcblx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjID4gMCkge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCA1MDApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0cmVzaG9sZDogMFxyXG5cdH0pO1xyXG5cclxuXHQkKCdkaXYuYm9yZGVycyBkaXYuaWNvbi13cmFwcGVyIC5hcnJvdycpLmZpcnN0KCkuc3dpcGUoe1xyXG5cdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdHZhciBqb2JzID0gJCgnZGl2Lmljb24td3JhcHBlciBkaXYnKSxcclxuXHRcdFx0XHRzZWxlY3RlZERlc2MgPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpLmluZGV4KCk7XHJcblxyXG5cdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0UmlnaHQnKTtcclxuXHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0UmlnaHQnKTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA+IDApIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyAtIDEpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyAtIDEpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoMikuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoMikuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dHJlc2hvbGQ6IDUwXHJcblx0fSk7XHJcblxyXG5cdCQoJ2Rpdi5ib3JkZXJzIGRpdi5pY29uLXdyYXBwZXIgLmFycm93JykubGFzdCgpLnN3aXBlKHtcclxuXHRcdHRhcDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG5cdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dExlZnQnKTtcclxuXHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjIDwgMikge1xyXG5cdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjICsgMSkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdC5lcSgwKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dHJlc2hvbGQ6IDUwXHJcblx0fSk7XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUubmF2RG90ID0gZnVuY3Rpb24oKSB7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLmZpbHRlcignLnRvcC1pbWFnZScpLmluZGV4KCksXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyksXHJcblx0XHRcdGFsbENsYXNzZXMgPSAnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0IGJvdW5jZU91dFJpZ2h0IGdvLWZvcndhcmQgZ28tYmFjayc7XHJcblxyXG5cdFx0aWYgKCBjbGlja2VkRG90SW5kZXggPiB0b3BJbWdEb3QgKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKGFsbENsYXNzZXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGRlc2MuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdH0sIDMwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcyhhbGxDbGFzc2VzKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRkZXNjLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHR9LCAzMDApO1xyXG5cdFx0fVxyXG5cdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCdib3VuY2VJbicpO1xyXG5cdFx0fSwgMTAwMCk7XHJcblx0fSk7IFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGgsXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0aWYgKCB0b3BJbWdJbmRleCA+IDAgKSB7XHJcblx0XHRcdHZhciBwcmV2SW1nID0gdG9wSW1nSW5kZXggLSAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEocHJldkltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShwcmV2SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjayBib3VuY2VPdXRSaWdodCcpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuY29uZmlnLmltZ0ZvcndhcmQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGhcclxuXHRcdFx0ZGVzYyA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKTtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4IDwgYWxsSW1ncyAtIDEgKSB7XHJcblx0XHRcdHZhciBuZXh0SW1nID0gdG9wSW1nSW5kZXggKyAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcSgwKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCcpLmVxKDApLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZXRyaWV2ZVZpc2libGVTbGlkZSA9IGZ1bmN0aW9uKCBzbGlkZXIgKSB7XHJcblx0cmV0dXJuIHRoaXMuc2xpZGVyLmZpbmQoJ2xpLnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zaWRlTWVudUhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBwb3NpdGlvbiA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0aWYgKCBwb3NpdGlvbiA8PSA0NDAgfHwgcG9zaXRpb24gPT09IDAgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xOTApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0yMCk7XHJcblx0XHR9KVxyXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS50YXBFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdCQoJ2Rpdi5pbWFnZXMgZGl2LmdhbGxlcnknKS5zd2lwZSh7XHJcblx0XHRcdHRhcDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG5cdFx0XHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0YXJnZXQpO1xyXG5cdFx0XHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdFx0XHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMSksXHJcblx0XHRcdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRcdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRcdFx0c2VsZi5yZW5kZXJHYWxsZXJ5KCBzZWxlY3RlZFNsaWRlUG9zaXRpb24gKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRyZXNob2xkOiA1MFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnZGl2Lm1lbnUgZGl2LnNtYWxsLXdpZHRoJykuc3dpcGUoe1xyXG5cdFx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0XHR2YXIgbWVudUl0ZW1zID0gJCgnZGl2Lm1lbnUgdWwubWVudSBsaScpLFxyXG5cdFx0XHRcdFx0bWVudUxpbmVzID0gJCgnZGl2Lm1lbnUgZGl2LnNtYWxsLXdpZHRoIHNwYW4nKTtcclxuXHJcblx0XHRcdFx0aWYgKG1lbnVJdGVtcy5oYXNDbGFzcygnc2hvdy1tZW51JykpIHtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5lcSgxKS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdub25lJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmxhc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ25vbmUnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRtZW51SXRlbXMucmVtb3ZlQ2xhc3MoJ2ZsaXBJblgnKS5hZGRDbGFzcygnZmxpcE91dFgnKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0fSwgNjAwKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmVxKDEpLmFkZENsYXNzKCdmYWRlT3V0Jyk7XHJcblx0XHRcdFx0XHRtZW51TGluZXMuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3JvdGF0ZVooLTQ1ZGVnKSB0cmFuc2xhdGUoLTdweCwgMTFweCknXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRtZW51TGluZXMubGFzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAncm90YXRlWig0NWRlZykgdHJhbnNsYXRlKC05cHgsIC0xMnB4KSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdG1lbnVJdGVtcy5hZGRDbGFzcygnc2hvdy1tZW51IGZsaXBJblgnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJ3VsLm1lbnUgbGkuc2hvdy1tZW51IGEnKS5zd2lwZSh7XHJcblx0XHRcdHRhcDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0YXBwZWQgYW5jaG9yJyk7XHJcblx0XHRcdFx0dmFyIG1lbnVJdGVtcyA9ICQoJ2Rpdi5tZW51IHVsLm1lbnUgbGknKSxcclxuXHRcdFx0XHRcdG1lbnVMaW5lcyA9ICQoJ2Rpdi5tZW51IGRpdi5zbWFsbC13aWR0aCBzcGFuJyk7XHJcblxyXG5cdFx0XHRcdG1lbnVMaW5lcy5lcSgxKS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdG1lbnVMaW5lcy5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ25vbmUnXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdG1lbnVMaW5lcy5sYXN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAnbm9uZSdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0bWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdmbGlwSW5YJykuYWRkQ2xhc3MoJ2ZsaXBPdXRYJyk7XHJcblx0XHRcdFx0Ly8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdC8vIH0sIDYwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS51cGRhdGVTbGlkZSA9IGZ1bmN0aW9uKCBvbGRTbGlkZSwgbmV3U2xpZGUsIGRpcmVjdGlvbiwgc3ZnQ292ZXJMYXllciwgcGF0aHMsIHN2Z1BhdGggKSB7XHJcblx0dmFyIHBhdGgxID0gMCxcclxuXHRcdHBhdGgyID0gMCxcclxuXHRcdHBhdGgzID0gMCxcclxuXHRcdHBhdGg0ID0gMCxcclxuXHRcdHBhdGg1ID0gMDtcclxuXHJcblx0aWYgKCBkaXJlY3Rpb24gPT09ICdnYWxsZXJ5Jykge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1swXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbMl07XHJcblx0XHRwYXRoMyA9IHBhdGhzWzRdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s2XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOF07XHJcblx0fSBlbHNlIHtcclxuXHRcdHBhdGgxID0gcGF0aHNbMV07XHJcblx0XHRwYXRoMiA9IHBhdGhzWzNdO1xyXG5cdFx0cGF0aDMgPSBwYXRoc1s1XTtcclxuXHRcdHBhdGg0ID0gcGF0aHNbN107XHJcblx0XHRwYXRoNSA9IHBhdGhzWzldO1xyXG5cdH1cclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzdmdDb3ZlckxheWVyLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRzdmdQYXRoLmF0dHIoJ2QnLCBwYXRoMSk7XHJcblx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgyfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgzfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0b2xkU2xpZGUucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0bmV3U2xpZGUuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0aWYgKCBzZWxmLmNvbmZpZy5tYWluU2xpZGUuaGFzQ2xhc3MoJ3Zpc2libGUnKSApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg0fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg1fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3ZnQ292ZXJMYXllci5yZW1vdmVDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgc2VsZi5jb25maWcuZGVsYXkpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgTWFrZXVwID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcbnZhciBpbml0U2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaW5pdFNsaWRlcicpO1xyXG52YXIgcmV0cmlldmVWaXNpYmxlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9yZXRyaWV2ZVZpc2libGVTbGlkZScpO1xyXG52YXIgaGVhZGVyUGFyYWxsYXggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheCcpO1xyXG52YXIgdXBkYXRlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy91cGRhdGVTbGlkZScpO1xyXG52YXIgZXZlbnRXYXRjaCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2V2ZW50V2F0Y2gnKTtcclxudmFyIGdhbGxlcnlQaWN0dXJlQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2dhbGxlcnlQaWN0dXJlQW5pbScpO1xyXG52YXIgcGljdHVyZVNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3BpY3R1cmVTbGlkZXInKTtcclxudmFyIGJyYW5kc1JhbmRvbUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNSYW5kb21BbmltJyk7XHJcbnZhciBicmFuZHNMb2dvQm94ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveCcpO1xyXG52YXIgc2lkZU1lbnVIaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvc2lkZU1lbnVIaWRlJyk7XHJcbnZhciBzbG93QW5jaG9yID0gcmVxdWlyZSgnLi90b29scy9zbG93QW5jaG9yJyk7XHJcbnZhciBiZXppZXIgPSByZXF1aXJlKCcuL3Rvb2xzL2JlemllcicpO1xyXG52YXIgc2Nyb2xsU3BlZWQgPSByZXF1aXJlKCcuL3Rvb2xzL3Njcm9sbFNwZWVkJyk7XHJcbnZhciB0bXBsQ29uZmlnID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdG1wbENvbmZpZycpO1xyXG52YXIgcmVuZGVyR2FsbGVyeSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3JlbmRlckdhbGxlcnknKTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxudmFyIG5hdkRvdCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL25hdkRvdCcpO1xyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2hlbHBlcnMnKTtcclxudmFyIGpvYlN3aXBlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvam9iU3dpcGUnKTtcclxudmFyIHRhcEV2ZW50cyA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3RhcEV2ZW50cycpO1xyXG5cclxudmFyIG1ha2V1cCA9IG5ldyBNYWtldXAoKTsiLCJtb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2Rlc2NyaXB0aW9uSGVscGVyJywgZnVuY3Rpb24oYXJnKSB7XHJcblx0dmFyIG9wZW5UYWcgPSBcIjxwPlwiLFxyXG5cdFx0Y2xvc2VUYWcgPSBcIjwvcD5cXHJcXG5cIjtcclxuXHRpZiAoYXJnKSB7XHJcblx0XHRyZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhcclxuXHRcdG9wZW5UYWdcclxuXHRcdCsgYXJnLmZuKHRoaXMpXHJcblx0XHQrIGNsb3NlVGFnKTtcclxuXHR9XHJcbn0pOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3RlbXBsYXRlcycpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZW5kZXJHYWxsZXJ5ID0gZnVuY3Rpb24oIGFyZyApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzID0gW107XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5waWN0dXJlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKCBOdW1iZXIoc2VsZi5waWN0dXJlc1tpXS5pZCkgPT09IGFyZyApIHtcclxuXHRcdFx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzLnB1c2goc2VsZi5waWN0dXJlc1tpXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyZWRQaWNzID0gZ2FsbGVyeS5nYWxsZXJ5KHtwaWNzOiBzZWxmLnNlbGVjdGVkUGljdHVyZXN9KTtcclxuXHQkKCcjdG1wbC13cmFwcGVyJykuaHRtbChyZW5kZXJlZFBpY3MpO1xyXG5cclxuXHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlyc3QoKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZScpO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maXJzdCgpLmFkZENsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHQkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJykuZmlyc3QoKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbicpO1xyXG5cdFxyXG5cdHNlbGYubmF2RG90KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJtb2R1bGUuZXhwb3J0c1tcImdhbGxlcnlcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlciwgYWxpYXMxPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMyPVwiZnVuY3Rpb25cIiwgYWxpYXMzPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcblxuICByZXR1cm4gXCJcdFx0XHQ8bGk+PGltZyBzcmM9XFxcImFzc2V0cy9pbWFnZXMvXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZpbGVQYXRoIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5maWxlUGF0aCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlsZVBhdGhcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBhbHQ9XFxcIlwiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5pZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaWQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9saT5cXHJcXG5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHJldHVybiBcIlx0XHQ8c3Bhbj48L3NwYW4+XFxyXFxuXCI7XG59LFwiNVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBoZWxwZXIsIG9wdGlvbnMsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz1oZWxwZXJzLmJsb2NrSGVscGVyTWlzc2luZywgYnVmZmVyID0gXG4gIFwiXHQ8ZGl2IGNsYXNzPVxcXCJwaWN0dXJlLWRlc2NyaXB0aW9uXFxcIj5cXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDYsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTAsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxyXFxuXHQ8L2Rpdj5cXHJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZpcnN0TGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZmlyc3RMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmaXJzdExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zZWNvbmRMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zZWNvbmRMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJzZWNvbmRMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcIjEwXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRoaXJkTGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGhpcmRMaW5lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJ0aGlyZExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCI8dWwgY2xhc3M9XFxcImdhbGxlcnktaW1hZ2VzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L3VsPlxcclxcbjxkaXYgY2xhc3M9XFxcIm5hdi1kb3RzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L2Rpdj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDUsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5mdW5jdGlvbiBQaWN0dXJlKGlkLCBmaWxlUGF0aCwgZmlyc3RMaW5lLCBzZWNvbmRMaW5lLCB0aGlyZExpbmUsIGJnRGFyaykge1xyXG5cdHRoaXMuaWQgPSBpZDtcclxuXHR0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XHJcblx0dGhpcy5maXJzdExpbmUgPSBmaXJzdExpbmU7XHJcblx0dGhpcy5zZWNvbmRMaW5lID0gc2Vjb25kTGluZTtcclxuXHR0aGlzLnRoaXJkTGluZSA9IHRoaXJkTGluZTtcclxuXHR0aGlzLmJnRGFyayA9IGJnRGFyaztcclxufVxyXG5cclxubWFrZXVwLnByb3RvdHlwZS5waWN0dXJlcyA9IFtcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcxLmpwZycsICdUcmVzemthaSBBbmV0dCcsICcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzIuanBnJywgJ1N6YWLDsyBDc2lsbGEnLCAnQ3NpbGxhZ2vDqXAnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzMuanBnJywgJ0xhY2EgU2/Ds3MnLCAnUGhvdG9ncmFwaHknLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzQuanBnJywgJ0fDoWJvciBHaWJiw7MgS2lzcycsICdHaWJiw7NBcnQgUGhvdG9ncmFweScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNS5qcGcnLCAnQmVydMOzayBWaWRlbyAmIFBob3RvJywgJycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0MS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3VuYmxvb20nLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDIuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ01leWVyIEVzenRlci1WaXLDoWcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDMuanBnJywgJ1Byb2tvcCBLYXRhIFNtaW5raXNrb2xhJywgJ3NtaW5rdmVyc2VueWUnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjEuanBnJywgJ0LDoW55YWkgQsOhbGludCcsICdDc29yasOhbiBLcmlzenRhJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24yLmpwZycsICdGb3TDsyBCYXpzYSBLaXMtSG9ydsOhdGgnLCAnSMOhcmkgSGFqbmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjMuanBnJywgJ0thdW5pdHogVGFtw6FzJywgJ1TDs3RoIEFsZXhhbmRyYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNC5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1N0eWFzem5pIERvcmluYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNS5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1N0eWFzem5pIERvcmluYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNi5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1RhdWJlciBLaW5nYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uNy5qcGcnLCAnTnllcnMgQXR0aWxhJywgJ1RhdWJlciBLaW5nYScsICdTaWlyYSBrb2xsZWtjacOzJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uOC5qcGcnLCAnWmVtc2UgU0FVUklBIGtvbGxla2Npw7MnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3p0eWVobGlrIElsZGlrw7MnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uOS5qcGcnLCAnWmVtc2UgU0FVUklBIGtvbGxla2Npw7MnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnVmVuY2VsIEtyaXN6dGluYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5MS5qcGcnLCAnRGVicmVjemkgSsOhbm9zJywgJ0RlYnJlY3ppIErDoW5vcyBGb3RvZ3LDoWZpYScsICdTw6FuZG9yIE5vw6ltaScsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkyLmpwZycsICdHYWJyaWVsbGEgQmFyYW55aScsICdNb2RlbGwgVmlrdG9yaWEgU2FsZXRyb3MnLCAnJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTMuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N1bmJsb29tJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NC5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnTWV5ZXIgRXN6dGVyLVZpcsOhZycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTUuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N6xbFjcyBLcmlzenRpbmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk2LmpwZycsICdTemFibyBNaWtsb3MnLCAnU2NoZWxsZW5iZXJnZXIgWnN1enNhbm5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Ny5qcGcnLCAnU3ppc3ppayBEw6FuaWVsJywgJ0bDvGdlZGkgRMOzcmEgVMOtbWVhJywgJycsIGZhbHNlKVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYmV6aWVyID0gZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBlcHNpbG9uICkge1xyXG5cclxuXHR2YXIgY3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB4MSArIDMgKiB2ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgY3VydmVZID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB5MSArIDMgKiB2ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGVyaXZhdGl2ZUN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogKDIgKiAodCAtIDEpICogdCArIHYgKiB2KSAqIHgxICsgMyAqICgtIHQgKiB0ICogdCArIDIgKiB2ICogdCkgKiB4MjtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24odCl7XHJcblxyXG5cdFx0dmFyIHggPSB0LCB0MCwgdDEsIHQyLCB4MiwgZDIsIGk7XHJcblxyXG5cdFx0Ly8gRmlyc3QgdHJ5IGEgZmV3IGl0ZXJhdGlvbnMgb2YgTmV3dG9uJ3MgbWV0aG9kIC0tIG5vcm1hbGx5IHZlcnkgZmFzdC5cclxuXHRcdGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKyl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKSAtIHg7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MikgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0ZDIgPSBkZXJpdmF0aXZlQ3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKGQyKSA8IDFlLTYpIGJyZWFrO1xyXG5cdFx0XHR0MiA9IHQyIC0geDIgLyBkMjtcclxuXHRcdH1cclxuXHJcblx0XHR0MCA9IDA7IHQxID0gMTsgdDIgPSB4O1xyXG5cclxuXHRcdGlmICh0MiA8IHQwKSByZXR1cm4gY3VydmVZKHQwKTtcclxuXHRcdGlmICh0MiA+IHQxKSByZXR1cm4gY3VydmVZKHQxKTtcclxuXHJcblx0XHQvLyBGYWxsYmFjayB0byB0aGUgYmlzZWN0aW9uIG1ldGhvZCBmb3IgcmVsaWFiaWxpdHkuXHJcblx0XHR3aGlsZSAodDAgPCB0MSl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyIC0geCkgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0aWYgKHggPiB4MikgdDAgPSB0MjtcclxuXHRcdFx0ZWxzZSB0MSA9IHQyO1xyXG5cdFx0XHR0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZhaWx1cmVcclxuXHRcdHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cclxuXHR9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5cdG1ha2V1cC5wcm90b3R5cGUuc2Nyb2xsU3BlZWQgPSBmdW5jdGlvbihzdGVwLCBzcGVlZCwgZWFzaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgICAkYm9keSA9ICQoJ2h0bWwsIGJvZHknKSxcclxuICAgICAgICAgICAgb3B0aW9uID0gZWFzaW5nIHx8ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgcm9vdCA9IDAsXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxZLFxyXG4gICAgICAgICAgICBzY3JvbGxYLFxyXG4gICAgICAgICAgICB2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICR3aW5kb3cub24oJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFZLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsID0gZS5vcmlnaW5hbEV2ZW50LmRldGFpbDtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFkgPSAkZG9jdW1lbnQuaGVpZ2h0KCkgPiAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWCA9ICRkb2N1bWVudC53aWR0aCgpID4gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LmhlaWdodCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQud2lkdGgoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5lYXNpbmcuZGVmYXVsdCA9IGZ1bmN0aW9uICh4LHQsYixjLGQpIHtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2xvd0FuY2hvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR0aGlzLmNvbmZpZy5hbGxBbmNob3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCApIHtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyJdfQ==
