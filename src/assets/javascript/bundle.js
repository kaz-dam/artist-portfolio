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
	}
	
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvam9iU3dpcGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL25hdkRvdC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdGFwRXZlbnRzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9oZWxwZXJzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBcclxuXHJcblx0ZnVuY3Rpb24gTWFrZXVwKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHNlbGYuc2xpZGVyID0ge307XHJcblx0XHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyQmFjayA9IHt9O1xyXG5cdFx0c2VsZi5zdmdDb3ZlckxheWVyID0ge307XHJcblx0XHRzZWxmLnN2Z1BhdGggPSB7fTtcclxuXHRcdHNlbGYuZmlyc3RBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2Vjb25kQW5pbWF0aW9uID0ge307XHJcblx0XHRzZWxmLnBhdGhBcnJheSA9IFtdO1xyXG5cdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0ge307XHJcblx0XHRzZWxmLnNlbGVjdGVkUGljdHVyZXMgPSBbXTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZyA9IHtcclxuXHRcdFx0d2luZG93T2JqOiAkKHdpbmRvdyksXHJcblx0XHRcdGRvY3VtZW50T2JqOiAkKGRvY3VtZW50KSxcclxuXHRcdFx0bWVudTogJCgndWwubWVudSBsaSBhJyksXHJcblx0XHRcdHNpZGVNZW51U2Nyb2xsOiAkKCdkaXYuc2Nyb2xsLW1lbnUnKSxcclxuXHRcdFx0c2xpZGVyV3JhcHBlcjogJCgnZGl2LnNsaWRlci13cmFwcGVyJyksXHJcblx0XHRcdG1haW5TbGlkZTogJCgndWwuc2xpZGVyIGxpOmZpcnN0LWNoaWxkJyksXHJcblx0XHRcdGR1cmF0aW9uOiAzMDAsXHJcblx0XHRcdGRlbGF5OiAzMDAsXHJcblx0XHRcdGFsbEFuY2hvcjogJCgnYVtocmVmKj1cXFxcI106bm90KFtocmVmPVxcXFwjXSknKSxcclxuXHRcdFx0dG9wTWVudTogJCgndWwubWVudScpLFxyXG5cdFx0XHRtZW51RGl2OiAkKCdzZWN0aW9uLmhlYWRlciBkaXYubWVudScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ0RpdjogJCgnZGl2LmhlYWRpbmcnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmc6ICQoJ2Rpdi5oZWFkaW5nIGgxJyksXHJcblx0XHRcdG1haW5IZWFkaW5nUGFyOiAkKCdkaXYuaGVhZGluZyBwJyksXHJcblx0XHRcdGhlYWRlckN0YTogJCgnZGl2LmN0YS1oZWFkZXInKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb25BcnJvdzogJCgnZGl2Lmljb24td3JhcHBlciBzdmcuYXJyb3cnKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb246ICQoJ3VsLmRlc2NyaXB0aW9uIGxpJyksXHJcblx0XHRcdGdhbGxlcnlJbWFnZXNTbWFsbDogJCgnZGl2LnNsaWRlci1uYXYgZGl2LmltYWdlcycpLFxyXG5cdFx0XHRicmFuZFNwYW5zOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5icmFuZHMnKSxcclxuXHRcdFx0YnJhbmRQb3B1cDogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4ucG9wdXAnKSxcclxuXHRcdFx0Ly8gZ2FsbGVyeUltZzogJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0Ly8gbmF2RG90czogJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0aW1nQmFjazogJCgnbGkuZ2FsbGVyeSBkaXYuYmFja3dhcmQnKSxcclxuXHRcdFx0aW1nRm9yd2FyZDogJCgnbGkuZ2FsbGVyeSBkaXYuZm9yd2FyZCcpLFxyXG5cdFx0XHRhYm91dFNlY3Rpb246ICQoJ3NlY3Rpb24uYWJvdXQnKSxcclxuXHRcdFx0Y29udGFjdFNlY3Rpb246ICQoJ3NlY3Rpb24uY29udGFjdCcpLFxyXG5cdFx0XHRmb290ZXJTZWN0aW9uOiAkKCdzZWN0aW9uLmZvb3RlcicpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBlcHNpbG9uID0gKDEwMDAgLyA2MCAvIHNlbGYuY29uZmlnLmR1cmF0aW9uKSAvIDQ7XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDAuNTgsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwxLDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5jb25maWcuc2xpZGVyV3JhcHBlci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5pbml0U2xpZGVyKCAkKHRoaXMpICk7XHJcblx0XHR9KTtcclxuXHRcdHNlbGYuZXZlbnRXYXRjaCgpO1xyXG5cdFx0c2VsZi5nYWxsZXJ5UGljdHVyZUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzUmFuZG9tQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNMb2dvQm94KCk7XHJcblx0XHRzZWxmLnNjcm9sbFNwZWVkKCAxMDAsIDUwMCApO1xyXG5cclxuXHR9OyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNMb2dvQm94ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBtb3VzZVggPSAwLFxyXG5cdFx0bW91c2VZID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5kb2N1bWVudE9iai5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRtb3VzZVggPSBlLnBhZ2VYO1xyXG5cdFx0bW91c2VZID0gZS5wYWdlWTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmNzcyh7XHJcblx0XHRcdFx0J3RvcCc6IG1vdXNlWSArIDE1LFxyXG5cdFx0XHRcdCdsZWZ0JzogbW91c2VYICsgNVxyXG5cdFx0XHR9KS5zaG93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc1JhbmRvbUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLmVxKHJhbmRvbU51bSkuYWRkQ2xhc3MoJ2JyYW5kLWFuaW0nKVxyXG5cdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdicmFuZC1hbmltJyk7XHJcblx0XHR9LCAzMDAwKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5ldmVudFdhdGNoID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWRTbGlkZVBvc2l0aW9uID0gc2VsZi5zZWxlY3RlZEdhbGxlcnkuZGF0YSgnZ2FsbGVyeS1jb3VudCcpLFxyXG5cdFx0XHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMSksXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGVQb3NpdGlvbiA9IHZpc2libGVTbGlkZS5pbmRleCgpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblxyXG5cdFx0c2VsZi5yZW5kZXJHYWxsZXJ5KCBzZWxlY3RlZFNsaWRlUG9zaXRpb24gKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdFx0Z2FsbGVyeU5hbWUgPSBob3ZlcmVkR2FsbGVyeS5maW5kKCdoMicpO1xyXG5cdFx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0XHRvcGFjaXR5OiAnMScsXHJcblx0XHRcdFx0bGV0dGVyU3BhY2luZzogJzRweCdcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdFx0Z2FsbGVyeU5hbWUuYW5pbWF0ZSh7XHJcblx0XHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRcdGxldHRlclNwYWNpbmc6ICcxNXB4J1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnNsb3dBbmNob3IoKTtcclxuXHJcblx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCkge1xyXG5cdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb25BcnJvdy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBjbGlja2VkRWxlbSA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRjbGlja2VkRWxlbUluZGV4ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb25BcnJvdy5pbmRleChjbGlja2VkRWxlbSksXHJcblx0XHRcdFx0XHRlbGVtVG9TaG93ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoY2xpY2tlZEVsZW1JbmRleCAtIDEpLFxyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0gPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdFx0ZWxlbVRvU2hvdy5hZGRDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24gYm91bmNlSW5VcCcpO1xyXG5cdFx0XHRcdFx0Y3VycmVudEVsZW0ucmVtb3ZlQ2xhc3MoJ2JvdW5jZUluVXAnKS5hZGRDbGFzcygnYm91bmNlT3V0RG93bicpO1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCk7XHJcblx0XHRcdFx0XHR9LCAyMDApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygnYm91bmNlSW5VcCcpLmFkZENsYXNzKCdib3VuY2VPdXREb3duJyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNlbGYucGljdHVyZVNsaWRlcigpO1xyXG5cclxuXHRzZWxmLmpvYlN3aXBlKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxuXHJcblx0c2VsZi50YXBFdmVudHMoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDApIHtcclxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCBjb3VudGVyID4gMiApIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQrK2NvdW50ZXI7XHJcblx0XHRcdH0sIDI1MDApO1xyXG5cdFx0fVxyXG5cdFx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaGVhZGVyUGFyYWxsYXggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPCAxMDQwKSB7XHJcblx0XHRzZWxmLmNvbmZpZy5jb250YWN0U2VjdGlvbi5jc3Moe1xyXG5cdFx0XHQnei1pbmRleCc6IC0yXHJcblx0XHRcdC8vICdvcGFjaXR5JzogMFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZWxmLmNvbmZpZy53aW5kb3dPYmoub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcFBvcyA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRcclxuXHRcdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgdG9wUG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodG9wUG9zID49IDQ0MCAmJiBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdFx0c2VsZi5jb25maWcuY29udGFjdFNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0xXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5mb290ZXJTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLmNvbnRhY3RTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMlxyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5jb25maWcuZm9vdGVyU2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW5pdFNsaWRlciA9IGZ1bmN0aW9uKCBzbGlkZXJXcmFwcGVyICkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyID0gc2xpZGVyV3JhcHBlci5maW5kKCd1bC5zbGlkZXInKTtcclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zbGlkZXItbmF2JykuZmluZCgnZGl2LmdhbGxlcnknKTtcclxuXHRzZWxmLnNsaWRlckJhY2sgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5iYWNrLWJ1dHRvbicpO1xyXG5cdHNlbGYuc3ZnQ292ZXJMYXllciA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnN2Zy1jb3ZlcicpO1xyXG5cdHZhciBwYXRoSWQgPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZmluZCgncGF0aCcpLmF0dHIoJ2lkJyk7XHJcblx0c2VsZi5zdmdQYXRoID0gbmV3IFNuYXAoJyMnICsgcGF0aElkKTtcclxuXHJcblx0c2VsZi5wYXRoQXJyYXlbMF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsxXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzJdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAyJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbM10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDcnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs0XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzVdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA4Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDQnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs3XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzhdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA1Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEwJyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmpvYlN3aXBlID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPCA3MTApIHtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5maXJzdCgpLmFkZENsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0JCgnZGl2Lmljb24td3JhcHBlciBkaXYnKS5maXJzdCgpLmFkZENsYXNzKCdjaG9zZW4tam9iJyk7XHJcblxyXG5cdFx0JCgnc2VjdGlvbi5qb2JzIGRpdi5pY29uLXdyYXBwZXInKS5zd2lwZSh7XHJcblx0XHRcdHN3aXBlTGVmdDogZnVuY3Rpb24oZXZlbnQsIGRpcmVjdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uLCBmaW5nZXJDb3VudCkge1xyXG5cdFx0XHRcdHZhciBqb2JzID0gJCgnZGl2Lmljb24td3JhcHBlciBkaXYnKSxcclxuXHRcdFx0XHRcdHNlbGVjdGVkRGVzYyA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJykuaW5kZXgoKTtcclxuXHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dExlZnQnKTtcclxuXHRcdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRMZWZ0Jyk7XHJcblxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjIDwgMikge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjICsgMSkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMCkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcSgwKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzd2lwZVJpZ2h0OiBmdW5jdGlvbihldmVudCwgZGlyZWN0aW9uLCBkaXN0YW5jZSwgZHVyYXRpb24sIGZpbmdlckNvdW50KSB7XHJcblx0XHRcdFx0dmFyIGpvYnMgPSAkKCdkaXYuaWNvbi13cmFwcGVyIGRpdicpLFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWREZXNjID0gJCgndWwuZGVzY3JpcHRpb24gbGkuc2VsZWN0ZWQtZGVzY3JpcHRpb24nKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0UmlnaHQnKTtcclxuXHRcdFx0XHRqb2JzLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA+IDApIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgLSAxKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoc2VsZWN0ZWREZXNjIC0gMSkuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMikuYWRkQ2xhc3MoJ2ZhZGVJbkxlZnQgY2hvc2VuLWpvYicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHR0cmVzaG9sZDogMCxcclxuXHRcdFx0YWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCdkaXYuYm9yZGVycyBkaXYuaWNvbi13cmFwcGVyIC5hcnJvdycpLmZpcnN0KCkuc3dpcGUoe1xyXG5cdFx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0XHRzZWxlY3RlZERlc2MgPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpLmluZGV4KCk7XHJcblxyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRSaWdodCcpO1xyXG5cdFx0XHRcdGpvYnMuZXEoc2VsZWN0ZWREZXNjKS5hZGRDbGFzcygnZmFkZU91dFJpZ2h0Jyk7XHJcblxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWREZXNjID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyAtIDEpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgLSAxKS5hZGRDbGFzcygnZmFkZUluTGVmdCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKDIpLmFkZENsYXNzKCdmYWRlSW5MZWZ0IHNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0XHRcdGpvYnMucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcSgyKS5hZGRDbGFzcygnZmFkZUluTGVmdCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgNTAwKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRyZXNob2xkOiA1MFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnZGl2LmJvcmRlcnMgZGl2Lmljb24td3JhcHBlciAuYXJyb3cnKS5sYXN0KCkuc3dpcGUoe1xyXG5cdFx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0XHR2YXIgam9icyA9ICQoJ2Rpdi5pY29uLXdyYXBwZXIgZGl2JyksXHJcblx0XHRcdFx0XHRzZWxlY3RlZERlc2MgPSAkKCd1bC5kZXNjcmlwdGlvbiBsaS5zZWxlY3RlZC1kZXNjcmlwdGlvbicpLmluZGV4KCk7XHJcblxyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLmVxKHNlbGVjdGVkRGVzYykuYWRkQ2xhc3MoJ2ZhZGVPdXRMZWZ0Jyk7XHJcblx0XHRcdFx0am9icy5lcShzZWxlY3RlZERlc2MpLmFkZENsYXNzKCdmYWRlT3V0TGVmdCcpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGVzYyA8IDIpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHRcdFx0XHRcdC5lcShzZWxlY3RlZERlc2MgKyAxKS5hZGRDbGFzcygnZmFkZUluUmlnaHQgc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRcdFx0am9icy5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKHNlbGVjdGVkRGVzYyArIDEpLmFkZENsYXNzKCdmYWRlSW5SaWdodCBjaG9zZW4tam9iJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5yZW1vdmVDbGFzcygpXHJcblx0XHRcdFx0XHRcdFx0LmVxKDApLmFkZENsYXNzKCdmYWRlSW5SaWdodCBzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRqb2JzLnJlbW92ZUNsYXNzKClcclxuXHRcdFx0XHRcdFx0XHQuZXEoMCkuYWRkQ2xhc3MoJ2ZhZGVJblJpZ2h0IGNob3Nlbi1qb2InKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCA1MDApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dHJlc2hvbGQ6IDUwXHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUubmF2RG90ID0gZnVuY3Rpb24oKSB7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLmZpbHRlcignLnRvcC1pbWFnZScpLmluZGV4KCksXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyksXHJcblx0XHRcdGFsbENsYXNzZXMgPSAnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0IGJvdW5jZU91dFJpZ2h0IGdvLWZvcndhcmQgZ28tYmFjayc7XHJcblxyXG5cdFx0aWYgKCBjbGlja2VkRG90SW5kZXggPiB0b3BJbWdEb3QgKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKGFsbENsYXNzZXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGRlc2MuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdH0sIDMwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcyhhbGxDbGFzc2VzKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRkZXNjLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHR9LCAzMDApO1xyXG5cdFx0fVxyXG5cdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCdib3VuY2VJbicpO1xyXG5cdFx0fSwgMTAwMCk7XHJcblx0fSk7IFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGgsXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0aWYgKCB0b3BJbWdJbmRleCA+IDAgKSB7XHJcblx0XHRcdHZhciBwcmV2SW1nID0gdG9wSW1nSW5kZXggLSAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEocHJldkltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShwcmV2SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjayBib3VuY2VPdXRSaWdodCcpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuY29uZmlnLmltZ0ZvcndhcmQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGhcclxuXHRcdFx0ZGVzYyA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKTtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4IDwgYWxsSW1ncyAtIDEgKSB7XHJcblx0XHRcdHZhciBuZXh0SW1nID0gdG9wSW1nSW5kZXggKyAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcSgwKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCcpLmVxKDApLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZXRyaWV2ZVZpc2libGVTbGlkZSA9IGZ1bmN0aW9uKCBzbGlkZXIgKSB7XHJcblx0cmV0dXJuIHRoaXMuc2xpZGVyLmZpbmQoJ2xpLnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zaWRlTWVudUhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCApIHtcclxuXHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBwb3NpdGlvbiA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0aWYgKCBwb3NpdGlvbiA8PSA0NDAgfHwgcG9zaXRpb24gPT09IDAgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xOTApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0yMCk7XHJcblx0XHR9KVxyXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS50YXBFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdCQoJ2Rpdi5pbWFnZXMgZGl2LmdhbGxlcnknKS5zd2lwZSh7XHJcblx0XHRcdGRvdWJsZVRhcDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG5cdFx0XHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0YXJnZXQpO1xyXG5cdFx0XHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdFx0XHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMSksXHJcblx0XHRcdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRcdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRcdFx0c2VsZi5yZW5kZXJHYWxsZXJ5KCBzZWxlY3RlZFNsaWRlUG9zaXRpb24gKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRyZXNob2xkOiA1MCxcclxuXHRcdFx0YWxsb3dQYWdlU2Nyb2xsOiAnYXV0bydcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJ2Rpdi5tZW51IGRpdi5zbWFsbC13aWR0aCcpLnN3aXBlKHtcclxuXHRcdFx0dGFwOiBmdW5jdGlvbihldmVudCwgdGFyZ2V0KSB7XHJcblx0XHRcdFx0dmFyIG1lbnVJdGVtcyA9ICQoJ2Rpdi5tZW51IHVsLm1lbnUgbGknKSxcclxuXHRcdFx0XHRcdG1lbnVMaW5lcyA9ICQoJ2Rpdi5tZW51IGRpdi5zbWFsbC13aWR0aCBzcGFuJyk7XHJcblxyXG5cdFx0XHRcdGlmIChtZW51SXRlbXMuaGFzQ2xhc3MoJ3Nob3ctbWVudScpKSB7XHJcblx0XHRcdFx0XHRtZW51TGluZXMuZXEoMSkucmVtb3ZlQ2xhc3MoKTtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAnbm9uZSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5sYXN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdub25lJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUl0ZW1zLnJlbW92ZUNsYXNzKCdmbGlwSW5YJykuYWRkQ2xhc3MoJ2ZsaXBPdXRYJyk7XHJcblx0XHRcdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDAsMCwwLDAuNSknKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcygpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDAsMCwwLDAuNSknKTtcclxuXHRcdFx0XHRcdH0sIDYwMCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1lbnVMaW5lcy5lcSgxKS5hZGRDbGFzcygnZmFkZU91dCcpO1xyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICdyb3RhdGVaKC00NWRlZykgdHJhbnNsYXRlKC03cHgsIDExcHgpJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0bWVudUxpbmVzLmxhc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3JvdGF0ZVooNDVkZWcpIHRyYW5zbGF0ZSgtOXB4LCAtMTJweCknXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoMCwwLDAsMSknKTtcclxuXHRcdFx0XHRcdG1lbnVJdGVtcy5hZGRDbGFzcygnc2hvdy1tZW51IGZsaXBJblgnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSgwLDAsMCwxKScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnVwZGF0ZVNsaWRlID0gZnVuY3Rpb24oIG9sZFNsaWRlLCBuZXdTbGlkZSwgZGlyZWN0aW9uLCBzdmdDb3ZlckxheWVyLCBwYXRocywgc3ZnUGF0aCApIHtcclxuXHR2YXIgcGF0aDEgPSAwLFxyXG5cdFx0cGF0aDIgPSAwLFxyXG5cdFx0cGF0aDMgPSAwLFxyXG5cdFx0cGF0aDQgPSAwLFxyXG5cdFx0cGF0aDUgPSAwO1xyXG5cclxuXHRpZiAoIGRpcmVjdGlvbiA9PT0gJ2dhbGxlcnknKSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzBdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1syXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNF07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzZdO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s4XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1sxXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbM107XHJcblx0XHRwYXRoMyA9IHBhdGhzWzVdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s3XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOV07XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHN2Z0NvdmVyTGF5ZXIuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdHN2Z1BhdGguYXR0cignZCcsIHBhdGgxKTtcclxuXHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDJ9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDN9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvbGRTbGlkZS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRuZXdTbGlkZS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRpZiAoIHNlbGYuY29uZmlnLm1haW5TbGlkZS5oYXNDbGFzcygndmlzaWJsZScpICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3Aoc2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDR9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDV9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdmdDb3ZlckxheWVyLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBzZWxmLmNvbmZpZy5kZWxheSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBNYWtldXAgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGluaXRTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9pbml0U2xpZGVyJyk7XHJcbnZhciByZXRyaWV2ZVZpc2libGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3JldHJpZXZlVmlzaWJsZVNsaWRlJyk7XHJcbnZhciBoZWFkZXJQYXJhbGxheCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2hlYWRlclBhcmFsbGF4Jyk7XHJcbnZhciB1cGRhdGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3VwZGF0ZVNsaWRlJyk7XHJcbnZhciBldmVudFdhdGNoID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZXZlbnRXYXRjaCcpO1xyXG52YXIgZ2FsbGVyeVBpY3R1cmVBbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltJyk7XHJcbnZhciBwaWN0dXJlU2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcGljdHVyZVNsaWRlcicpO1xyXG52YXIgYnJhbmRzUmFuZG9tQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc1JhbmRvbUFuaW0nKTtcclxudmFyIGJyYW5kc0xvZ29Cb3ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNMb2dvQm94Jyk7XHJcbnZhciBzaWRlTWVudUhpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9zaWRlTWVudUhpZGUnKTtcclxudmFyIHNsb3dBbmNob3IgPSByZXF1aXJlKCcuL3Rvb2xzL3Nsb3dBbmNob3InKTtcclxudmFyIGJlemllciA9IHJlcXVpcmUoJy4vdG9vbHMvYmV6aWVyJyk7XHJcbnZhciBzY3JvbGxTcGVlZCA9IHJlcXVpcmUoJy4vdG9vbHMvc2Nyb2xsU3BlZWQnKTtcclxudmFyIHRtcGxDb25maWcgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90bXBsQ29uZmlnJyk7XHJcbnZhciByZW5kZXJHYWxsZXJ5ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcmVuZGVyR2FsbGVyeScpO1xyXG52YXIgZ2FsbGVyeSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3RlbXBsYXRlcycpO1xyXG52YXIgbmF2RG90ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvbmF2RG90Jyk7XHJcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvaGVscGVycycpO1xyXG52YXIgam9iU3dpcGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9qb2JTd2lwZScpO1xyXG52YXIgdGFwRXZlbnRzID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvdGFwRXZlbnRzJyk7XHJcblxyXG52YXIgbWFrZXVwID0gbmV3IE1ha2V1cCgpOyIsIm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZGVzY3JpcHRpb25IZWxwZXInLCBmdW5jdGlvbihhcmcpIHtcclxuXHR2YXIgb3BlblRhZyA9IFwiPHA+XCIsXHJcblx0XHRjbG9zZVRhZyA9IFwiPC9wPlxcclxcblwiO1xyXG5cdGlmIChhcmcpIHtcclxuXHRcdHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKFxyXG5cdFx0b3BlblRhZ1xyXG5cdFx0KyBhcmcuZm4odGhpcylcclxuXHRcdCsgY2xvc2VUYWcpO1xyXG5cdH1cclxufSk7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvdGVtcGxhdGVzJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJlbmRlckdhbGxlcnkgPSBmdW5jdGlvbiggYXJnICkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRzZWxmLnNlbGVjdGVkUGljdHVyZXMgPSBbXTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnBpY3R1cmVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZiAoIE51bWJlcihzZWxmLnBpY3R1cmVzW2ldLmlkKSA9PT0gYXJnICkge1xyXG5cdFx0XHRzZWxmLnNlbGVjdGVkUGljdHVyZXMucHVzaChzZWxmLnBpY3R1cmVzW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciByZW5kZXJlZFBpY3MgPSBnYWxsZXJ5LmdhbGxlcnkoe3BpY3M6IHNlbGYuc2VsZWN0ZWRQaWN0dXJlc30pO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXInKS5odG1sKHJlbmRlcmVkUGljcyk7XHJcblxyXG5cdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maXJzdCgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlJyk7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLmZpcnN0KCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZScpO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKS5maXJzdCgpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uJyk7XHJcblx0XHJcblx0c2VsZi5uYXZEb3QoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsIm1vZHVsZS5leHBvcnRzW1wiZ2FsbGVyeVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyLCBhbGlhczE9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczI9XCJmdW5jdGlvblwiLCBhbGlhczM9dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIlx0XHRcdDxsaT48aW1nIHNyYz1cXFwiYXNzZXRzL2ltYWdlcy9cIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZmlsZVBhdGggfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpbGVQYXRoIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmaWxlUGF0aFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGFsdD1cXFwiXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmlkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiaWRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj48L2xpPlxcclxcblwiO1xufSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgcmV0dXJuIFwiXHRcdDxzcGFuPjwvc3Bhbj5cXHJcXG5cIjtcbn0sXCI1XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgYWxpYXMxPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMyPVwiZnVuY3Rpb25cIiwgYWxpYXMzPWhlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nLCBidWZmZXIgPSBcbiAgXCJcdDxkaXYgY2xhc3M9XFxcInBpY3R1cmUtZGVzY3JpcHRpb25cXFwiPlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNiwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDgsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXHJcXG5cdDwvZGl2PlxcclxcblwiO1xufSxcIjZcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZmlyc3RMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5maXJzdExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImZpcnN0TGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCI4XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnNlY29uZExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlY29uZExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInNlY29uZExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiMTBcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGhpcmRMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aGlyZExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInRoaXJkTGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiBcIjx1bCBjbGFzcz1cXFwiZ2FsbGVyeS1pbWFnZXNcXFwiPlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvdWw+XFxyXFxuPGRpdiBjbGFzcz1cXFwibmF2LWRvdHNcXFwiPlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMywgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvZGl2PlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbmZ1bmN0aW9uIFBpY3R1cmUoaWQsIGZpbGVQYXRoLCBmaXJzdExpbmUsIHNlY29uZExpbmUsIHRoaXJkTGluZSwgYmdEYXJrKSB7XHJcblx0dGhpcy5pZCA9IGlkO1xyXG5cdHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcclxuXHR0aGlzLmZpcnN0TGluZSA9IGZpcnN0TGluZTtcclxuXHR0aGlzLnNlY29uZExpbmUgPSBzZWNvbmRMaW5lO1xyXG5cdHRoaXMudGhpcmRMaW5lID0gdGhpcmRMaW5lO1xyXG5cdHRoaXMuYmdEYXJrID0gYmdEYXJrO1xyXG59XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVzID0gW1xyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzEuanBnJywgJ1RyZXN6a2FpIEFuZXR0JywgJycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMi5qcGcnLCAnU3phYsOzIENzaWxsYScsICdDc2lsbGFna8OpcCcsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMy5qcGcnLCAnTGFjYSBTb8OzcycsICdQaG90b2dyYXBoeScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNC5qcGcnLCAnR8OhYm9yIEdpYmLDsyBLaXNzJywgJ0dpYmLDs0FydCBQaG90b2dyYXB5JywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmc1LmpwZycsICdCZXJ0w7NrIFZpZGVvICYgUGhvdG8nLCAnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QxLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTdW5ibG9vbScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0Mi5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnTWV5ZXIgRXN6dGVyLVZpcsOhZycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0My5qcGcnLCAnUHJva29wIEthdGEgU21pbmtpc2tvbGEnLCAnc21pbmt2ZXJzZW55ZScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMS5qcGcnLCAnQsOhbnlhaSBCw6FsaW50JywgJ0Nzb3Jqw6FuIEtyaXN6dGEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjIuanBnJywgJ0ZvdMOzIEJhenNhIEtpcy1Ib3J2w6F0aCcsICdIw6FyaSBIYWpuYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMy5qcGcnLCAnS2F1bml0eiBUYW3DoXMnLCAnVMOzdGggQWxleGFuZHJhJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb240LmpwZycsICdOeWVycyBBdHRpbGEnLCAnU3R5YXN6bmkgRG9yaW5hJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb241LmpwZycsICdOeWVycyBBdHRpbGEnLCAnU3R5YXN6bmkgRG9yaW5hJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb242LmpwZycsICdOeWVycyBBdHRpbGEnLCAnVGF1YmVyIEtpbmdhJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb243LmpwZycsICdOeWVycyBBdHRpbGEnLCAnVGF1YmVyIEtpbmdhJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb244LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsycsICdNw6F0w6lmeSBTemFib2xjcycsICdTenR5ZWhsaWsgSWxkaWvDsycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb245LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsycsICdNw6F0w6lmeSBTemFib2xjcycsICdWZW5jZWwgS3Jpc3p0aW5hJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkxLmpwZycsICdEZWJyZWN6aSBKw6Fub3MnLCAnRGVicmVjemkgSsOhbm9zIEZvdG9ncsOhZmlhJywgJ1PDoW5kb3IgTm/DqW1pJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTIuanBnJywgJ0dhYnJpZWxsYSBCYXJhbnlpJywgJ01vZGVsbCBWaWt0b3JpYSBTYWxldHJvcycsICcnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5My5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3VuYmxvb20nLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk0LmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdNZXllciBFc3p0ZXItVmlyw6FnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3rFsWNzIEtyaXN6dGluYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTYuanBnJywgJ1N6YWJvIE1pa2xvcycsICdTY2hlbGxlbmJlcmdlciBac3V6c2FubmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk3LmpwZycsICdTemlzemlrIETDoW5pZWwnLCAnRsO8Z2VkaSBEw7NyYSBUw61tZWEnLCAnJywgZmFsc2UpXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5iZXppZXIgPSBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGVwc2lsb24gKSB7XHJcblxyXG5cdHZhciBjdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHgxICsgMyAqIHYgKiB0ICogdCAqIHgyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBjdXJ2ZVkgPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHkxICsgMyAqIHYgKiB0ICogdCAqIHkyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBkZXJpdmF0aXZlQ3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiAoMiAqICh0IC0gMSkgKiB0ICsgdiAqIHYpICogeDEgKyAzICogKC0gdCAqIHQgKiB0ICsgMiAqIHYgKiB0KSAqIHgyO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbih0KXtcclxuXHJcblx0XHR2YXIgeCA9IHQsIHQwLCB0MSwgdDIsIHgyLCBkMiwgaTtcclxuXHJcblx0XHQvLyBGaXJzdCB0cnkgYSBmZXcgaXRlcmF0aW9ucyBvZiBOZXd0b24ncyBtZXRob2QgLS0gbm9ybWFsbHkgdmVyeSBmYXN0LlxyXG5cdFx0Zm9yICh0MiA9IHgsIGkgPSAwOyBpIDwgODsgaSsrKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpIC0geDtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyKSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRkMiA9IGRlcml2YXRpdmVDdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoZDIpIDwgMWUtNikgYnJlYWs7XHJcblx0XHRcdHQyID0gdDIgLSB4MiAvIGQyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHQwID0gMDsgdDEgPSAxOyB0MiA9IHg7XHJcblxyXG5cdFx0aWYgKHQyIDwgdDApIHJldHVybiBjdXJ2ZVkodDApO1xyXG5cdFx0aWYgKHQyID4gdDEpIHJldHVybiBjdXJ2ZVkodDEpO1xyXG5cclxuXHRcdC8vIEZhbGxiYWNrIHRvIHRoZSBiaXNlY3Rpb24gbWV0aG9kIGZvciByZWxpYWJpbGl0eS5cclxuXHRcdHdoaWxlICh0MCA8IHQxKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIgLSB4KSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRpZiAoeCA+IHgyKSB0MCA9IHQyO1xyXG5cdFx0XHRlbHNlIHQxID0gdDI7XHJcblx0XHRcdHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmFpbHVyZVxyXG5cdFx0cmV0dXJuIGN1cnZlWSh0Mik7XHJcblxyXG5cdH07XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcblx0bWFrZXVwLnByb3RvdHlwZS5zY3JvbGxTcGVlZCA9IGZ1bmN0aW9uKHN0ZXAsIHNwZWVkLCBlYXNpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgJGRvY3VtZW50ID0gJChkb2N1bWVudCksXHJcbiAgICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXHJcbiAgICAgICAgICAgICRib2R5ID0gJCgnaHRtbCwgYm9keScpLFxyXG4gICAgICAgICAgICBvcHRpb24gPSBlYXNpbmcgfHwgJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICByb290ID0gMCxcclxuICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbFksXHJcbiAgICAgICAgICAgIHNjcm9sbFgsXHJcbiAgICAgICAgICAgIHZpZXc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgJHdpbmRvdy5vbignbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBkZWx0YVkgPSBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVksXHJcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBlLm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWSA9ICRkb2N1bWVudC5oZWlnaHQoKSA+ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxYID0gJGRvY3VtZW50LndpZHRoKCkgPiAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQuaGVpZ2h0KCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFgpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC53aWR0aCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAkLmVhc2luZy5kZWZhdWx0ID0gZnVuY3Rpb24gKHgsdCxiLGMsZCkge1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zbG93QW5jaG9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHRoaXMuY29uZmlnLmFsbEFuY2hvci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgPT09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpICYmIGxvY2F0aW9uLmhvc3RuYW1lID09PSB0aGlzLmhvc3RuYW1lKSB7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XHJcblx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcclxuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoICkge1xyXG5cdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcFxyXG5cdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7Il19
