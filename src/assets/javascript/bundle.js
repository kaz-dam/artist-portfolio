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
			galleryImg: $('li.gallery ul.wedding-images li'),
			navDots: $('li.gallery div.nav-dots span'),
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

	}
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
	
}

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
}

module.exports = makeup;
},{"./Makeup":1}],4:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.eventWatch = function() {
	var self = this;

	self.sliderNavigation.on('click', function() {
		self.selectedGallery = $(this);
		var selectedSlidePosition = self.selectedGallery.data('gallery-count'), //use self as a reference for the database to find the right images
			selectedSlide = self.slider.children('li').eq(1), //hard code the index of the gallery slide
			visibleSlide = self.retrieveVisibleSlide(self.slider),
			visibleSlidePosition = visibleSlide.index(),
			direction = 'gallery';
		self.positionBeforeGallery = self.config.windowObj.scrollTop();
		self.updateSlide(visibleSlide, selectedSlide, direction, self.svgCoverLayer, self.pathArray, self.svgPath);

		// add visible-image and top-image class with the ajax request callback
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
}

module.exports = makeup;
},{"./Makeup":1}],5:[function(require,module,exports){
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
},{"./Makeup":1}],6:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.headerParallax = function() {

	var self = this;

	self.config.windowObj.on('scroll', function() {
		var topPos = self.config.windowObj.scrollTop();
				
		if ( self.config.windowObj.width() > 1000 ) {
			self.config.menuDiv.css('top', topPos);
		}

		if ( topPos >= 440 && self.config.windowObj.width() > 1000 ) {
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

}

module.exports = makeup;
},{"./Makeup":1}],8:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.pictureSlider = function() {
	var self = this;
			
	self.config.imgBack.on('click', function() {
		var topImg = self.config.galleryImg.filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = self.config.galleryImg.length;

		if ( topImgIndex > 0 ) {
			var prevImg = topImgIndex - 1;
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(prevImg).addClass('visible-image go-back');
				self.config.navDots.removeClass('top-image bounceIn').eq(prevImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(allImgs - 1).addClass('visible-image go-back');
				self.config.navDots.removeClass('top-image bounceIn').eq(allImgs - 1).addClass('top-image bounceIn');
			}, 600);
		}
	});

	self.config.imgForward.on('click', function() {
		var topImg = self.config.galleryImg.filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = self.config.galleryImg.length;

		if ( topImgIndex < allImgs - 1 ) {
			var nextImg = topImgIndex + 1;
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(nextImg).addClass('visible-image go-forward');
				self.config.navDots.removeClass('top-image bounceIn').eq(nextImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				self.config.galleryImg.removeClass().eq(0).addClass('visible-image go-forward');
				self.config.navDots.removeClass('top-image bounceIn').eq(0).addClass('top-image bounceIn');
			}, 600);
		}
	});

	self.config.navDots.on('click', function() {
		var clickedDotIndex = $(this).index(),
			topImgDot = self.config.navDots.filter('.top-image').index();

		if ( clickedDotIndex > topImgDot ) {
			self.config.galleryImg.removeClass().eq(clickedDotIndex).addClass('visible-image go-forward');
		} else {
			self.config.galleryImg.removeClass().eq(clickedDotIndex).addClass('visible-image go-back');
		}
		self.config.navDots.removeClass('top-image bounceIn');
		$(this).addClass('top-image bounceIn');
	});
}

module.exports = makeup;
},{"./Makeup":1}],9:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.retrieveVisibleSlide = function( slider ) {
	return this.slider.find('li.visible');
}

module.exports = makeup;
},{"./Makeup":1}],10:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.sideMenuHide = function() {

	var self = this;

	if ( self.config.windowObj.width() > 1000 ) {
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
	
}

module.exports = makeup;
},{"./Makeup":1}],11:[function(require,module,exports){
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
}

module.exports = makeup;
},{"./Makeup":1}],12:[function(require,module,exports){
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

var makeup = new Makeup();

//console.log(makeup);
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/pictureSlider":8,"./functions/retrieveVisibleSlide":9,"./functions/sideMenuHide":10,"./functions/updateSlide":11,"./tools/bezier":13,"./tools/scrollSpeed":14,"./tools/slowAnchor":15}],13:[function(require,module,exports){
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

}

module.exports = makeup;
},{"../functions/Makeup":1}],14:[function(require,module,exports){
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
    }

module.exports = makeup;
},{"../functions/Makeup":1}],15:[function(require,module,exports){
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
	
}

module.exports = makeup;
},{"../functions/Makeup":1}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdXBkYXRlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvbWFpbi5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90b29scy9iZXppZXIuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2Nyb2xsU3BlZWQuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2xvd0FuY2hvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFxyXG5cclxuXHRmdW5jdGlvbiBNYWtldXAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXIgPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJCYWNrID0ge307XHJcblx0XHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSB7fTtcclxuXHRcdHNlbGYuc3ZnUGF0aCA9IHt9O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYucGF0aEFycmF5ID0gW107XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSB7fTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZyA9IHtcclxuXHRcdFx0d2luZG93T2JqOiAkKHdpbmRvdyksXHJcblx0XHRcdGRvY3VtZW50T2JqOiAkKGRvY3VtZW50KSxcclxuXHRcdFx0bWVudTogJCgndWwubWVudSBsaSBhJyksXHJcblx0XHRcdHNpZGVNZW51U2Nyb2xsOiAkKCdkaXYuc2Nyb2xsLW1lbnUnKSxcclxuXHRcdFx0c2xpZGVyV3JhcHBlcjogJCgnZGl2LnNsaWRlci13cmFwcGVyJyksXHJcblx0XHRcdG1haW5TbGlkZTogJCgndWwuc2xpZGVyIGxpOmZpcnN0LWNoaWxkJyksXHJcblx0XHRcdGR1cmF0aW9uOiAzMDAsXHJcblx0XHRcdGRlbGF5OiAzMDAsXHJcblx0XHRcdGFsbEFuY2hvcjogJCgnYVtocmVmKj1cXFxcI106bm90KFtocmVmPVxcXFwjXSknKSxcclxuXHRcdFx0dG9wTWVudTogJCgndWwubWVudScpLFxyXG5cdFx0XHRtZW51RGl2OiAkKCdzZWN0aW9uLmhlYWRlciBkaXYubWVudScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ0RpdjogJCgnZGl2LmhlYWRpbmcnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmc6ICQoJ2Rpdi5oZWFkaW5nIGgxJyksXHJcblx0XHRcdG1haW5IZWFkaW5nUGFyOiAkKCdkaXYuaGVhZGluZyBwJyksXHJcblx0XHRcdGhlYWRlckN0YTogJCgnZGl2LmN0YS1oZWFkZXInKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb25BcnJvdzogJCgnZGl2Lmljb24td3JhcHBlciBzdmcuYXJyb3cnKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb246ICQoJ3VsLmRlc2NyaXB0aW9uIGxpJyksXHJcblx0XHRcdGdhbGxlcnlJbWFnZXNTbWFsbDogJCgnZGl2LnNsaWRlci1uYXYgZGl2LmltYWdlcycpLFxyXG5cdFx0XHRicmFuZFNwYW5zOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5icmFuZHMnKSxcclxuXHRcdFx0YnJhbmRQb3B1cDogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4ucG9wdXAnKSxcclxuXHRcdFx0Z2FsbGVyeUltZzogJCgnbGkuZ2FsbGVyeSB1bC53ZWRkaW5nLWltYWdlcyBsaScpLFxyXG5cdFx0XHRuYXZEb3RzOiAkKCdsaS5nYWxsZXJ5IGRpdi5uYXYtZG90cyBzcGFuJyksXHJcblx0XHRcdGltZ0JhY2s6ICQoJ2xpLmdhbGxlcnkgZGl2LmJhY2t3YXJkJyksXHJcblx0XHRcdGltZ0ZvcndhcmQ6ICQoJ2xpLmdhbGxlcnkgZGl2LmZvcndhcmQnKSxcclxuXHRcdFx0YWJvdXRTZWN0aW9uOiAkKCdzZWN0aW9uLmFib3V0JyksXHJcblx0XHRcdGNvbnRhY3RTZWN0aW9uOiAkKCdzZWN0aW9uLmNvbnRhY3QnKSxcclxuXHRcdFx0Zm9vdGVyU2VjdGlvbjogJCgnc2VjdGlvbi5mb290ZXInKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXBzaWxvbiA9ICgxMDAwIC8gNjAgLyBzZWxmLmNvbmZpZy5kdXJhdGlvbikgLyA0O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwwLjU4LDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMSwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuY29uZmlnLnNsaWRlcldyYXBwZXIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuaW5pdFNsaWRlciggJCh0aGlzKSApO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLmV2ZW50V2F0Y2goKTtcclxuXHRcdHNlbGYuZ2FsbGVyeVBpY3R1cmVBbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc1JhbmRvbUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzTG9nb0JveCgpO1xyXG5cdFx0c2VsZi5zY3JvbGxTcGVlZCggMTAwLCA1MDAgKTtcclxuXHJcblx0fSIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNMb2dvQm94ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBtb3VzZVggPSAwLFxyXG5cdFx0bW91c2VZID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5kb2N1bWVudE9iai5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRtb3VzZVggPSBlLnBhZ2VYO1xyXG5cdFx0bW91c2VZID0gZS5wYWdlWTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmNzcyh7XHJcblx0XHRcdFx0J3RvcCc6IG1vdXNlWSArIDE1LFxyXG5cdFx0XHRcdCdsZWZ0JzogbW91c2VYICsgNVxyXG5cdFx0XHR9KS5zaG93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzUmFuZG9tQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdHZhciByYW5kb21OdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KTtcclxuXHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMuZXEocmFuZG9tTnVtKS5hZGRDbGFzcygnYnJhbmQtYW5pbScpXHJcblx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdicmFuZC1hbmltJyk7XHJcblx0fSwgMzAwMCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5ldmVudFdhdGNoID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWRTbGlkZVBvc2l0aW9uID0gc2VsZi5zZWxlY3RlZEdhbGxlcnkuZGF0YSgnZ2FsbGVyeS1jb3VudCcpLCAvL3VzZSBzZWxmIGFzIGEgcmVmZXJlbmNlIGZvciB0aGUgZGF0YWJhc2UgdG8gZmluZCB0aGUgcmlnaHQgaW1hZ2VzXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSwgLy9oYXJkIGNvZGUgdGhlIGluZGV4IG9mIHRoZSBnYWxsZXJ5IHNsaWRlXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGVQb3NpdGlvbiA9IHZpc2libGVTbGlkZS5pbmRleCgpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblxyXG5cdFx0Ly8gYWRkIHZpc2libGUtaW1hZ2UgYW5kIHRvcC1pbWFnZSBjbGFzcyB3aXRoIHRoZSBhamF4IHJlcXVlc3QgY2FsbGJhY2tcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzEnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnNHB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnMTVweCdcclxuXHRcdH0sIDQwMCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2xvd0FuY2hvcigpO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgY2xpY2tlZEVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRlbGVtVG9TaG93ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoY2xpY2tlZEVsZW1JbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmdhbGxlcnlQaWN0dXJlQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjb3VudGVyID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzLFxyXG5cdFx0YmdXZWRkaW5nID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nLWJpZy93ZWRkaW5nMS5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nLWJpZy93ZWRkaW5nMi5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nLWJpZy93ZWRkaW5nMy5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdGYXNoaW9uID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24xLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjIuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMy5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdCZWF1dHkgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkxLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkyLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkzLmpwZydcclxuXHRcdF0sXHJcblx0XHRiZ0NvbnRlc3QgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDEuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0Mi5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QzLmpwZydcclxuXHRcdF07XHJcblxyXG5cdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0fSkubmV4dCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0fSk7XHJcblx0XHQrK2NvdW50ZXI7XHJcblxyXG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggY291bnRlciA+IDIgKSB7XHJcblx0XHRcdFx0Y291bnRlciA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHR9KS5uZXh0KCkuZGVsYXkoMjUwMCkuY3NzKHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Kytjb3VudGVyO1xyXG5cdFx0fSwgMjUwMCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5oZWFkZXJQYXJhbGxheCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wUG9zID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0aWYgKCBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwMDAgKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCd0b3AnLCB0b3BQb3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdG9wUG9zID49IDQ0MCAmJiBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwMDAgKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCd0b3AnLCA0NDAgLSAodG9wUG9zIC8gMjAwKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuY29uZmlnLm1haW5IZWFkaW5nRGl2LmNzcyh7XHJcblx0XHRcdCdvcGFjaXR5JzogMSAtICggdG9wUG9zIC8gMzAwICksXHJcblx0XHRcdCdtYXJnaW4tdG9wJzogMjA3IC0gKHRvcFBvcyAvIDUpXHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5oZWFkZXJDdGEuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAxNSAtICh0b3BQb3MgLyAxMylcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmluaXRTbGlkZXIgPSBmdW5jdGlvbiggc2xpZGVyV3JhcHBlciApIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlciA9IHNsaWRlcldyYXBwZXIuZmluZCgndWwuc2xpZGVyJyk7XHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuc2xpZGVyLW5hdicpLmZpbmQoJ2Rpdi5nYWxsZXJ5Jyk7XHJcblx0c2VsZi5zbGlkZXJCYWNrID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuYmFjay1idXR0b24nKTtcclxuXHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zdmctY292ZXInKTtcclxuXHR2YXIgcGF0aElkID0gc2VsZi5zdmdDb3ZlckxheWVyLmZpbmQoJ3BhdGgnKS5hdHRyKCdpZCcpO1xyXG5cdHNlbGYuc3ZnUGF0aCA9IG5ldyBTbmFwKCcjJyArIHBhdGhJZCk7XHJcblxyXG5cdHNlbGYucGF0aEFycmF5WzBdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbMV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDYnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsyXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzNdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA3Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDMnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs1XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOCcpO1xyXG5cdHNlbGYucGF0aEFycmF5WzZdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA0Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbN10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDknKTtcclxuXHRzZWxmLnBhdGhBcnJheVs4XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzldID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAxMCcpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gc2VsZi5jb25maWcuZ2FsbGVyeUltZy5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmxlbmd0aDtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4ID4gMCApIHtcclxuXHRcdFx0dmFyIHByZXZJbWcgPSB0b3BJbWdJbmRleCAtIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0fSwgNjAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5jb25maWcuaW1nRm9yd2FyZC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9IHNlbGYuY29uZmlnLmdhbGxlcnlJbWcubGVuZ3RoO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0dmFyIG5leHRJbWcgPSB0b3BJbWdJbmRleCArIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdH0sIDYwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5uYXZEb3RzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gc2VsZi5jb25maWcubmF2RG90cy5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpO1xyXG5cclxuXHRcdGlmICggY2xpY2tlZERvdEluZGV4ID4gdG9wSW1nRG90ICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHR9XHJcblx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucmV0cmlldmVWaXNpYmxlU2xpZGUgPSBmdW5jdGlvbiggc2xpZGVyICkge1xyXG5cdHJldHVybiB0aGlzLnNsaWRlci5maW5kKCdsaS52aXNpYmxlJyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zaWRlTWVudUhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBwb3NpdGlvbiA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0aWYgKCBwb3NpdGlvbiA8PSA0NDAgfHwgcG9zaXRpb24gPT09IDAgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xOTApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0yMCk7XHJcblx0XHR9KVxyXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnVwZGF0ZVNsaWRlID0gZnVuY3Rpb24oIG9sZFNsaWRlLCBuZXdTbGlkZSwgZGlyZWN0aW9uLCBzdmdDb3ZlckxheWVyLCBwYXRocywgc3ZnUGF0aCApIHtcclxuXHR2YXIgcGF0aDEgPSAwLFxyXG5cdFx0cGF0aDIgPSAwLFxyXG5cdFx0cGF0aDMgPSAwLFxyXG5cdFx0cGF0aDQgPSAwLFxyXG5cdFx0cGF0aDUgPSAwO1xyXG5cclxuXHRpZiAoIGRpcmVjdGlvbiA9PT0gJ2dhbGxlcnknKSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzBdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1syXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNF07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzZdO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s4XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1sxXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbM107XHJcblx0XHRwYXRoMyA9IHBhdGhzWzVdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s3XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOV07XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHN2Z0NvdmVyTGF5ZXIuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdHN2Z1BhdGguYXR0cignZCcsIHBhdGgxKTtcclxuXHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDJ9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDN9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvbGRTbGlkZS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRuZXdTbGlkZS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRpZiAoIHNlbGYuY29uZmlnLm1haW5TbGlkZS5oYXNDbGFzcygndmlzaWJsZScpICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3Aoc2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDR9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDV9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdmdDb3ZlckxheWVyLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBzZWxmLmNvbmZpZy5kZWxheSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIE1ha2V1cCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgaW5pdFNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2luaXRTbGlkZXInKTtcclxudmFyIHJldHJpZXZlVmlzaWJsZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUnKTtcclxudmFyIGhlYWRlclBhcmFsbGF4ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaGVhZGVyUGFyYWxsYXgnKTtcclxudmFyIHVwZGF0ZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvdXBkYXRlU2xpZGUnKTtcclxudmFyIGV2ZW50V2F0Y2ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9ldmVudFdhdGNoJyk7XHJcbnZhciBnYWxsZXJ5UGljdHVyZUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9nYWxsZXJ5UGljdHVyZUFuaW0nKTtcclxudmFyIHBpY3R1cmVTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9waWN0dXJlU2xpZGVyJyk7XHJcbnZhciBicmFuZHNSYW5kb21BbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbScpO1xyXG52YXIgYnJhbmRzTG9nb0JveCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc0xvZ29Cb3gnKTtcclxudmFyIHNpZGVNZW51SGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3NpZGVNZW51SGlkZScpO1xyXG52YXIgc2xvd0FuY2hvciA9IHJlcXVpcmUoJy4vdG9vbHMvc2xvd0FuY2hvcicpO1xyXG52YXIgYmV6aWVyID0gcmVxdWlyZSgnLi90b29scy9iZXppZXInKTtcclxudmFyIHNjcm9sbFNwZWVkID0gcmVxdWlyZSgnLi90b29scy9zY3JvbGxTcGVlZCcpO1xyXG5cclxudmFyIG1ha2V1cCA9IG5ldyBNYWtldXAoKTtcclxuXHJcbi8vY29uc29sZS5sb2cobWFrZXVwKTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5iZXppZXIgPSBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGVwc2lsb24gKSB7XHJcblxyXG5cdHZhciBjdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHgxICsgMyAqIHYgKiB0ICogdCAqIHgyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBjdXJ2ZVkgPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHkxICsgMyAqIHYgKiB0ICogdCAqIHkyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBkZXJpdmF0aXZlQ3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiAoMiAqICh0IC0gMSkgKiB0ICsgdiAqIHYpICogeDEgKyAzICogKC0gdCAqIHQgKiB0ICsgMiAqIHYgKiB0KSAqIHgyO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbih0KXtcclxuXHJcblx0XHR2YXIgeCA9IHQsIHQwLCB0MSwgdDIsIHgyLCBkMiwgaTtcclxuXHJcblx0XHQvLyBGaXJzdCB0cnkgYSBmZXcgaXRlcmF0aW9ucyBvZiBOZXd0b24ncyBtZXRob2QgLS0gbm9ybWFsbHkgdmVyeSBmYXN0LlxyXG5cdFx0Zm9yICh0MiA9IHgsIGkgPSAwOyBpIDwgODsgaSsrKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpIC0geDtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyKSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRkMiA9IGRlcml2YXRpdmVDdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoZDIpIDwgMWUtNikgYnJlYWs7XHJcblx0XHRcdHQyID0gdDIgLSB4MiAvIGQyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHQwID0gMDsgdDEgPSAxOyB0MiA9IHg7XHJcblxyXG5cdFx0aWYgKHQyIDwgdDApIHJldHVybiBjdXJ2ZVkodDApO1xyXG5cdFx0aWYgKHQyID4gdDEpIHJldHVybiBjdXJ2ZVkodDEpO1xyXG5cclxuXHRcdC8vIEZhbGxiYWNrIHRvIHRoZSBiaXNlY3Rpb24gbWV0aG9kIGZvciByZWxpYWJpbGl0eS5cclxuXHRcdHdoaWxlICh0MCA8IHQxKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIgLSB4KSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRpZiAoeCA+IHgyKSB0MCA9IHQyO1xyXG5cdFx0XHRlbHNlIHQxID0gdDI7XHJcblx0XHRcdHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmFpbHVyZVxyXG5cdFx0cmV0dXJuIGN1cnZlWSh0Mik7XHJcblxyXG5cdH07XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuXHRtYWtldXAucHJvdG90eXBlLnNjcm9sbFNwZWVkID0gZnVuY3Rpb24oc3RlcCwgc3BlZWQsIGVhc2luZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KSxcclxuICAgICAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcclxuICAgICAgICAgICAgJGJvZHkgPSAkKCdodG1sLCBib2R5JyksXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IGVhc2luZyB8fCAnZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIHJvb3QgPSAwLFxyXG4gICAgICAgICAgICBzY3JvbGwgPSBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsWSxcclxuICAgICAgICAgICAgc2Nyb2xsWCxcclxuICAgICAgICAgICAgdmlldztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZClcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAkd2luZG93Lm9uKCdtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhWSxcclxuICAgICAgICAgICAgICAgIGRldGFpbCA9IGUub3JpZ2luYWxFdmVudC5kZXRhaWw7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxZID0gJGRvY3VtZW50LmhlaWdodCgpID4gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFggPSAkZG9jdW1lbnQud2lkdGgoKSA+ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC5oZWlnaHQoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LndpZHRoKCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbExlZnQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuZWFzaW5nLmRlZmF1bHQgPSBmdW5jdGlvbiAoeCx0LGIsYyxkKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIC1jICogKCh0PXQvZC0xKSp0KnQqdCAtIDEpICsgYjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2xvd0FuY2hvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR0aGlzLmNvbmZpZy5hbGxBbmNob3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCApIHtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7Il19
