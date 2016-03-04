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

};

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
};

module.exports = makeup;
},{"./Makeup":1}],9:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.retrieveVisibleSlide = function( slider ) {
	return this.slider.find('li.visible');
};

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
	
};

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
};

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
var tmplConfig = require('./templates/tmplConfig');

var makeup = new Makeup();

console.log(makeup.pictures[0].description);
console.log(makeup);
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/pictureSlider":8,"./functions/retrieveVisibleSlide":9,"./functions/sideMenuHide":10,"./functions/updateSlide":11,"./templates/tmplConfig":13,"./tools/bezier":14,"./tools/scrollSpeed":15,"./tools/slowAnchor":16}],13:[function(require,module,exports){
var makeup = require('../functions/Makeup');

function Picture(filePath, description, bgDark) {
	this.filePath = filePath;
	this.description = description;
}

makeup.prototype.pictures = [
	new Picture('wedding-big/wedding1.jpg', 'Treszkai Anett', false),
	new Picture('wedding-big/wedding2.jpg', 'Szabó Csilla - Csillagkép', false)
	/*new Picture('', ''),
	new Picture('', ''),
	new Picture('', ''),
	new Picture('', ''),
	new Picture('', ''),
	new Picture('', ''),
	new Picture('', ''),*/

]

module.exports = makeup;
},{"../functions/Makeup":1}],14:[function(require,module,exports){
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
},{"../functions/Makeup":1}],15:[function(require,module,exports){
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
},{"../functions/Makeup":1}],16:[function(require,module,exports){
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
},{"../functions/Makeup":1}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdXBkYXRlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvbWFpbi5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvdG1wbENvbmZpZy5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90b29scy9iZXppZXIuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2Nyb2xsU3BlZWQuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2xvd0FuY2hvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFxyXG5cclxuXHRmdW5jdGlvbiBNYWtldXAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXIgPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJCYWNrID0ge307XHJcblx0XHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSB7fTtcclxuXHRcdHNlbGYuc3ZnUGF0aCA9IHt9O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYucGF0aEFycmF5ID0gW107XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSB7fTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZyA9IHtcclxuXHRcdFx0d2luZG93T2JqOiAkKHdpbmRvdyksXHJcblx0XHRcdGRvY3VtZW50T2JqOiAkKGRvY3VtZW50KSxcclxuXHRcdFx0bWVudTogJCgndWwubWVudSBsaSBhJyksXHJcblx0XHRcdHNpZGVNZW51U2Nyb2xsOiAkKCdkaXYuc2Nyb2xsLW1lbnUnKSxcclxuXHRcdFx0c2xpZGVyV3JhcHBlcjogJCgnZGl2LnNsaWRlci13cmFwcGVyJyksXHJcblx0XHRcdG1haW5TbGlkZTogJCgndWwuc2xpZGVyIGxpOmZpcnN0LWNoaWxkJyksXHJcblx0XHRcdGR1cmF0aW9uOiAzMDAsXHJcblx0XHRcdGRlbGF5OiAzMDAsXHJcblx0XHRcdGFsbEFuY2hvcjogJCgnYVtocmVmKj1cXFxcI106bm90KFtocmVmPVxcXFwjXSknKSxcclxuXHRcdFx0dG9wTWVudTogJCgndWwubWVudScpLFxyXG5cdFx0XHRtZW51RGl2OiAkKCdzZWN0aW9uLmhlYWRlciBkaXYubWVudScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ0RpdjogJCgnZGl2LmhlYWRpbmcnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmc6ICQoJ2Rpdi5oZWFkaW5nIGgxJyksXHJcblx0XHRcdG1haW5IZWFkaW5nUGFyOiAkKCdkaXYuaGVhZGluZyBwJyksXHJcblx0XHRcdGhlYWRlckN0YTogJCgnZGl2LmN0YS1oZWFkZXInKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb25BcnJvdzogJCgnZGl2Lmljb24td3JhcHBlciBzdmcuYXJyb3cnKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb246ICQoJ3VsLmRlc2NyaXB0aW9uIGxpJyksXHJcblx0XHRcdGdhbGxlcnlJbWFnZXNTbWFsbDogJCgnZGl2LnNsaWRlci1uYXYgZGl2LmltYWdlcycpLFxyXG5cdFx0XHRicmFuZFNwYW5zOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5icmFuZHMnKSxcclxuXHRcdFx0YnJhbmRQb3B1cDogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4ucG9wdXAnKSxcclxuXHRcdFx0Z2FsbGVyeUltZzogJCgnbGkuZ2FsbGVyeSB1bC53ZWRkaW5nLWltYWdlcyBsaScpLFxyXG5cdFx0XHRuYXZEb3RzOiAkKCdsaS5nYWxsZXJ5IGRpdi5uYXYtZG90cyBzcGFuJyksXHJcblx0XHRcdGltZ0JhY2s6ICQoJ2xpLmdhbGxlcnkgZGl2LmJhY2t3YXJkJyksXHJcblx0XHRcdGltZ0ZvcndhcmQ6ICQoJ2xpLmdhbGxlcnkgZGl2LmZvcndhcmQnKSxcclxuXHRcdFx0YWJvdXRTZWN0aW9uOiAkKCdzZWN0aW9uLmFib3V0JyksXHJcblx0XHRcdGNvbnRhY3RTZWN0aW9uOiAkKCdzZWN0aW9uLmNvbnRhY3QnKSxcclxuXHRcdFx0Zm9vdGVyU2VjdGlvbjogJCgnc2VjdGlvbi5mb290ZXInKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXBzaWxvbiA9ICgxMDAwIC8gNjAgLyBzZWxmLmNvbmZpZy5kdXJhdGlvbikgLyA0O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwwLjU4LDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMSwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuY29uZmlnLnNsaWRlcldyYXBwZXIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuaW5pdFNsaWRlciggJCh0aGlzKSApO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLmV2ZW50V2F0Y2goKTtcclxuXHRcdHNlbGYuZ2FsbGVyeVBpY3R1cmVBbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc1JhbmRvbUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzTG9nb0JveCgpO1xyXG5cdFx0c2VsZi5zY3JvbGxTcGVlZCggMTAwLCA1MDAgKTtcclxuXHJcblx0fTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzTG9nb0JveCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgbW91c2VYID0gMCxcclxuXHRcdG1vdXNlWSA9IDAsXHJcblx0XHRzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcuZG9jdW1lbnRPYmoub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0bW91c2VYID0gZS5wYWdlWDtcclxuXHRcdG1vdXNlWSA9IGUucGFnZVk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRcdCd0b3AnOiBtb3VzZVkgKyAxNSxcclxuXHRcdFx0XHQnbGVmdCc6IG1vdXNlWCArIDVcclxuXHRcdFx0fSkuc2hvdygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNSYW5kb21BbmltID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpO1xyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5lcShyYW5kb21OdW0pLmFkZENsYXNzKCdicmFuZC1hbmltJylcclxuXHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2JyYW5kLWFuaW0nKTtcclxuXHR9LCAzMDAwKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5ldmVudFdhdGNoID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWRTbGlkZVBvc2l0aW9uID0gc2VsZi5zZWxlY3RlZEdhbGxlcnkuZGF0YSgnZ2FsbGVyeS1jb3VudCcpLCAvL3VzZSBzZWxmIGFzIGEgcmVmZXJlbmNlIGZvciB0aGUgZGF0YWJhc2UgdG8gZmluZCB0aGUgcmlnaHQgaW1hZ2VzXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSwgLy9oYXJkIGNvZGUgdGhlIGluZGV4IG9mIHRoZSBnYWxsZXJ5IHNsaWRlXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGVQb3NpdGlvbiA9IHZpc2libGVTbGlkZS5pbmRleCgpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblxyXG5cdFx0Ly8gYWRkIHZpc2libGUtaW1hZ2UgYW5kIHRvcC1pbWFnZSBjbGFzcyB3aXRoIHRoZSBhamF4IHJlcXVlc3QgY2FsbGJhY2tcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzEnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnNHB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnMTVweCdcclxuXHRcdH0sIDQwMCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2xvd0FuY2hvcigpO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgY2xpY2tlZEVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRlbGVtVG9TaG93ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoY2xpY2tlZEVsZW1JbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIGNvdW50ZXIgPiAyICkge1xyXG5cdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1hZ2VzU21hbGwuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdGYXNoaW9uW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSk7XHJcblx0XHRcdCsrY291bnRlcjtcclxuXHRcdH0sIDI1MDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmhlYWRlclBhcmFsbGF4ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BQb3MgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHJcblx0XHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIHRvcFBvcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW5pdFNsaWRlciA9IGZ1bmN0aW9uKCBzbGlkZXJXcmFwcGVyICkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyID0gc2xpZGVyV3JhcHBlci5maW5kKCd1bC5zbGlkZXInKTtcclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zbGlkZXItbmF2JykuZmluZCgnZGl2LmdhbGxlcnknKTtcclxuXHRzZWxmLnNsaWRlckJhY2sgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5iYWNrLWJ1dHRvbicpO1xyXG5cdHNlbGYuc3ZnQ292ZXJMYXllciA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnN2Zy1jb3ZlcicpO1xyXG5cdHZhciBwYXRoSWQgPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZmluZCgncGF0aCcpLmF0dHIoJ2lkJyk7XHJcblx0c2VsZi5zdmdQYXRoID0gbmV3IFNuYXAoJyMnICsgcGF0aElkKTtcclxuXHJcblx0c2VsZi5wYXRoQXJyYXlbMF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsxXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzJdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAyJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbM10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDcnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs0XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzVdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA4Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDQnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs3XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzhdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA1Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEwJyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gc2VsZi5jb25maWcuZ2FsbGVyeUltZy5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmxlbmd0aDtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4ID4gMCApIHtcclxuXHRcdFx0dmFyIHByZXZJbWcgPSB0b3BJbWdJbmRleCAtIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0fSwgNjAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5jb25maWcuaW1nRm9yd2FyZC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9IHNlbGYuY29uZmlnLmdhbGxlcnlJbWcubGVuZ3RoO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0dmFyIG5leHRJbWcgPSB0b3BJbWdJbmRleCArIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdH0sIDYwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5uYXZEb3RzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gc2VsZi5jb25maWcubmF2RG90cy5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpO1xyXG5cclxuXHRcdGlmICggY2xpY2tlZERvdEluZGV4ID4gdG9wSW1nRG90ICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHR9XHJcblx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJldHJpZXZlVmlzaWJsZVNsaWRlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcclxuXHRyZXR1cm4gdGhpcy5zbGlkZXIuZmluZCgnbGkudmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNpZGVNZW51SGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDAwICkge1xyXG5cdFx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZiAoIHBvc2l0aW9uIDw9IDQ0MCB8fCBwb3NpdGlvbiA9PT0gMCApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE5MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTIwKTtcclxuXHRcdH0pXHJcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnVwZGF0ZVNsaWRlID0gZnVuY3Rpb24oIG9sZFNsaWRlLCBuZXdTbGlkZSwgZGlyZWN0aW9uLCBzdmdDb3ZlckxheWVyLCBwYXRocywgc3ZnUGF0aCApIHtcclxuXHR2YXIgcGF0aDEgPSAwLFxyXG5cdFx0cGF0aDIgPSAwLFxyXG5cdFx0cGF0aDMgPSAwLFxyXG5cdFx0cGF0aDQgPSAwLFxyXG5cdFx0cGF0aDUgPSAwO1xyXG5cclxuXHRpZiAoIGRpcmVjdGlvbiA9PT0gJ2dhbGxlcnknKSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzBdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1syXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNF07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzZdO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s4XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1sxXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbM107XHJcblx0XHRwYXRoMyA9IHBhdGhzWzVdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s3XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOV07XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHN2Z0NvdmVyTGF5ZXIuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdHN2Z1BhdGguYXR0cignZCcsIHBhdGgxKTtcclxuXHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDJ9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDN9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvbGRTbGlkZS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRuZXdTbGlkZS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRpZiAoIHNlbGYuY29uZmlnLm1haW5TbGlkZS5oYXNDbGFzcygndmlzaWJsZScpICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3Aoc2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDR9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDV9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdmdDb3ZlckxheWVyLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBzZWxmLmNvbmZpZy5kZWxheSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBNYWtldXAgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGluaXRTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9pbml0U2xpZGVyJyk7XHJcbnZhciByZXRyaWV2ZVZpc2libGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3JldHJpZXZlVmlzaWJsZVNsaWRlJyk7XHJcbnZhciBoZWFkZXJQYXJhbGxheCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2hlYWRlclBhcmFsbGF4Jyk7XHJcbnZhciB1cGRhdGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3VwZGF0ZVNsaWRlJyk7XHJcbnZhciBldmVudFdhdGNoID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZXZlbnRXYXRjaCcpO1xyXG52YXIgZ2FsbGVyeVBpY3R1cmVBbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltJyk7XHJcbnZhciBwaWN0dXJlU2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcGljdHVyZVNsaWRlcicpO1xyXG52YXIgYnJhbmRzUmFuZG9tQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc1JhbmRvbUFuaW0nKTtcclxudmFyIGJyYW5kc0xvZ29Cb3ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNMb2dvQm94Jyk7XHJcbnZhciBzaWRlTWVudUhpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9zaWRlTWVudUhpZGUnKTtcclxudmFyIHNsb3dBbmNob3IgPSByZXF1aXJlKCcuL3Rvb2xzL3Nsb3dBbmNob3InKTtcclxudmFyIGJlemllciA9IHJlcXVpcmUoJy4vdG9vbHMvYmV6aWVyJyk7XHJcbnZhciBzY3JvbGxTcGVlZCA9IHJlcXVpcmUoJy4vdG9vbHMvc2Nyb2xsU3BlZWQnKTtcclxudmFyIHRtcGxDb25maWcgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90bXBsQ29uZmlnJyk7XHJcblxyXG52YXIgbWFrZXVwID0gbmV3IE1ha2V1cCgpO1xyXG5cclxuY29uc29sZS5sb2cobWFrZXVwLnBpY3R1cmVzWzBdLmRlc2NyaXB0aW9uKTtcclxuY29uc29sZS5sb2cobWFrZXVwKTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuZnVuY3Rpb24gUGljdHVyZShmaWxlUGF0aCwgZGVzY3JpcHRpb24sIGJnRGFyaykge1xyXG5cdHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcclxuXHR0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbn1cclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucGljdHVyZXMgPSBbXHJcblx0bmV3IFBpY3R1cmUoJ3dlZGRpbmctYmlnL3dlZGRpbmcxLmpwZycsICdUcmVzemthaSBBbmV0dCcsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnd2VkZGluZy1iaWcvd2VkZGluZzIuanBnJywgJ1N6YWLDsyBDc2lsbGEgLSBDc2lsbGFna8OpcCcsIGZhbHNlKVxyXG5cdC8qbmV3IFBpY3R1cmUoJycsICcnKSxcclxuXHRuZXcgUGljdHVyZSgnJywgJycpLFxyXG5cdG5ldyBQaWN0dXJlKCcnLCAnJyksXHJcblx0bmV3IFBpY3R1cmUoJycsICcnKSxcclxuXHRuZXcgUGljdHVyZSgnJywgJycpLFxyXG5cdG5ldyBQaWN0dXJlKCcnLCAnJyksXHJcblx0bmV3IFBpY3R1cmUoJycsICcnKSwqL1xyXG5cclxuXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYmV6aWVyID0gZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBlcHNpbG9uICkge1xyXG5cclxuXHR2YXIgY3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB4MSArIDMgKiB2ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgY3VydmVZID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB5MSArIDMgKiB2ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGVyaXZhdGl2ZUN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogKDIgKiAodCAtIDEpICogdCArIHYgKiB2KSAqIHgxICsgMyAqICgtIHQgKiB0ICogdCArIDIgKiB2ICogdCkgKiB4MjtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24odCl7XHJcblxyXG5cdFx0dmFyIHggPSB0LCB0MCwgdDEsIHQyLCB4MiwgZDIsIGk7XHJcblxyXG5cdFx0Ly8gRmlyc3QgdHJ5IGEgZmV3IGl0ZXJhdGlvbnMgb2YgTmV3dG9uJ3MgbWV0aG9kIC0tIG5vcm1hbGx5IHZlcnkgZmFzdC5cclxuXHRcdGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKyl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKSAtIHg7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MikgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0ZDIgPSBkZXJpdmF0aXZlQ3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKGQyKSA8IDFlLTYpIGJyZWFrO1xyXG5cdFx0XHR0MiA9IHQyIC0geDIgLyBkMjtcclxuXHRcdH1cclxuXHJcblx0XHR0MCA9IDA7IHQxID0gMTsgdDIgPSB4O1xyXG5cclxuXHRcdGlmICh0MiA8IHQwKSByZXR1cm4gY3VydmVZKHQwKTtcclxuXHRcdGlmICh0MiA+IHQxKSByZXR1cm4gY3VydmVZKHQxKTtcclxuXHJcblx0XHQvLyBGYWxsYmFjayB0byB0aGUgYmlzZWN0aW9uIG1ldGhvZCBmb3IgcmVsaWFiaWxpdHkuXHJcblx0XHR3aGlsZSAodDAgPCB0MSl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyIC0geCkgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0aWYgKHggPiB4MikgdDAgPSB0MjtcclxuXHRcdFx0ZWxzZSB0MSA9IHQyO1xyXG5cdFx0XHR0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZhaWx1cmVcclxuXHRcdHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cclxuXHR9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5cdG1ha2V1cC5wcm90b3R5cGUuc2Nyb2xsU3BlZWQgPSBmdW5jdGlvbihzdGVwLCBzcGVlZCwgZWFzaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgICAkYm9keSA9ICQoJ2h0bWwsIGJvZHknKSxcclxuICAgICAgICAgICAgb3B0aW9uID0gZWFzaW5nIHx8ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgcm9vdCA9IDAsXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxZLFxyXG4gICAgICAgICAgICBzY3JvbGxYLFxyXG4gICAgICAgICAgICB2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICR3aW5kb3cub24oJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFZLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsID0gZS5vcmlnaW5hbEV2ZW50LmRldGFpbDtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFkgPSAkZG9jdW1lbnQuaGVpZ2h0KCkgPiAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWCA9ICRkb2N1bWVudC53aWR0aCgpID4gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LmhlaWdodCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQud2lkdGgoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5lYXNpbmcuZGVmYXVsdCA9IGZ1bmN0aW9uICh4LHQsYixjLGQpIHtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2xvd0FuY2hvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR0aGlzLmNvbmZpZy5hbGxBbmNob3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCApIHtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyJdfQ==
