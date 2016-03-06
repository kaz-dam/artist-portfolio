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
			galleryImg: $('li.gallery ul.gallery-images li'),
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
var renderGallery = require('./templates/renderGallery');

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/pictureSlider":8,"./functions/retrieveVisibleSlide":9,"./functions/sideMenuHide":10,"./functions/updateSlide":11,"./templates/renderGallery":13,"./templates/tmplConfig":14,"./tools/bezier":15,"./tools/scrollSpeed":16,"./tools/slowAnchor":17}],13:[function(require,module,exports){
var makeup = require('../functions/Makeup');

makeup.prototype.renderGallery = function( arg ) {
	var self = this;

	for (var i = 0; i < self.pictures.length; i++) {
		if ( Number(self.pictures[i].id) === arg ) {

			self.selectedPictures.push(self.pictures[i]);

		}
	}

	var template = $('#gallery-tmpl').html(),
		compiled = Handlebars.compile(template),
		rendered = compiled(self.selectedPictures);

	$('#gallery-rendered').html(rendered);
};

module.exports = makeup;
},{"../functions/Makeup":1}],14:[function(require,module,exports){
var makeup = require('../functions/Makeup');

function Picture(id, filePath, description, bgDark) {
	this.id = id;
	this.filePath = filePath;
	this.description = description;
	this.bgDark = bgDark;
}

makeup.prototype.pictures = [
	new Picture('1', 'wedding/wedding1.jpg', 'Treszkai Anett', false),
	new Picture('1', 'wedding/wedding2.jpg', 'Szabó Csilla - Csillagkép', false),
	new Picture('1', 'wedding/wedding3.jpg', 'Laca Soós - Photography', false),
	new Picture('1', 'wedding/wedding4.jpg', 'Gábor Gibbó Kiss - GibbóArt Photograpy', false),
	new Picture('1', 'wedding/wedding5.jpg', 'Bertók Video &amp; Photo', false),
	new Picture('4', 'contest/contest1.jpg', 'Mátéfy Szabolcs - Sunbloom', false),
	new Picture('4', 'contest/contest2.jpg', 'Mátéfy Szabolcs - Meyer Eszter-Virág', false),
	new Picture('4', 'contest/contest3.jpg', 'Prokop Kata Sminkiskola sminkversenye', false),
	new Picture('2', 'fashion/fashion1.jpg', 'Bányai Bálint - Csorján Kriszta', false),
	new Picture('2', 'fashion/fashion2.jpg', 'Fotó Bazsa Kis-Horváth - Hári Hajna', false),
	new Picture('2', 'fashion/fashion3.jpg', 'Kaunitz Tamás - Tóth Alexandra', false),
	new Picture('2', 'fashion/fashion4.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 1', true),
	new Picture('2', 'fashion/fashion5.jpg', 'Nyers Attila - Styaszni Dorina - Siira kollekció 2', true),
	new Picture('2', 'fashion/fashion6.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 1', true),
	new Picture('2', 'fashion/fashion7.jpg', 'Nyers Attila - Tauber Kinga - Siira kollekció 2', true),
	new Picture('2', 'fashion/fashion8.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Sztyehlik Ildikó', false),
	new Picture('2', 'fashion/fashion9.jpg', 'Zemse SAURIA kollekció - Mátéfy Szabolcs - Vencel Krisztina', false),
	new Picture('3', 'beauty/beauty1.jpg', 'Debreczi János - Debreczi János Fotográfia - Sándor Noémi', true),
	new Picture('3', 'beauty/beauty2.jpg', 'Gabriella Baranyi - Modell Viktoria Saletros', true),
	new Picture('3', 'beauty/beauty3.jpg', 'Mátéfy Szabolcs 1 (2) - Sunbloom', false),
	new Picture('3', 'beauty/beauty4.jpg', 'Mátéfy Szabolcs 1 (4) - Meyer Eszter-Virág', false),
	new Picture('3', 'beauty/beauty5.jpg', 'Mátéfy Szabolcs 1 (5) - Szűcs Krisztina', false),
	new Picture('3', 'beauty/beauty6.jpg', 'Szabo Miklos - Schellenberger Zsuzsanna', false),
	new Picture('3', 'beauty/beauty7.jpg', 'Sziszik Dániel - Fügedi Dóra Tímea', false)
]

module.exports = makeup;
},{"../functions/Makeup":1}],15:[function(require,module,exports){
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
},{"../functions/Makeup":1}],16:[function(require,module,exports){
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
},{"../functions/Makeup":1}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdXBkYXRlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvbWFpbi5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvcmVuZGVyR2FsbGVyeS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvdG1wbENvbmZpZy5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90b29scy9iZXppZXIuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2Nyb2xsU3BlZWQuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvc2xvd0FuY2hvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFxyXG5cclxuXHRmdW5jdGlvbiBNYWtldXAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXIgPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJCYWNrID0ge307XHJcblx0XHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSB7fTtcclxuXHRcdHNlbGYuc3ZnUGF0aCA9IHt9O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYucGF0aEFycmF5ID0gW107XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnID0ge1xyXG5cdFx0XHR3aW5kb3dPYmo6ICQod2luZG93KSxcclxuXHRcdFx0ZG9jdW1lbnRPYmo6ICQoZG9jdW1lbnQpLFxyXG5cdFx0XHRtZW51OiAkKCd1bC5tZW51IGxpIGEnKSxcclxuXHRcdFx0c2lkZU1lbnVTY3JvbGw6ICQoJ2Rpdi5zY3JvbGwtbWVudScpLFxyXG5cdFx0XHRzbGlkZXJXcmFwcGVyOiAkKCdkaXYuc2xpZGVyLXdyYXBwZXInKSxcclxuXHRcdFx0bWFpblNsaWRlOiAkKCd1bC5zbGlkZXIgbGk6Zmlyc3QtY2hpbGQnKSxcclxuXHRcdFx0ZHVyYXRpb246IDMwMCxcclxuXHRcdFx0ZGVsYXk6IDMwMCxcclxuXHRcdFx0YWxsQW5jaG9yOiAkKCdhW2hyZWYqPVxcXFwjXTpub3QoW2hyZWY9XFxcXCNdKScpLFxyXG5cdFx0XHR0b3BNZW51OiAkKCd1bC5tZW51JyksXHJcblx0XHRcdG1lbnVEaXY6ICQoJ3NlY3Rpb24uaGVhZGVyIGRpdi5tZW51JyksXHJcblx0XHRcdG1haW5IZWFkaW5nRGl2OiAkKCdkaXYuaGVhZGluZycpLFxyXG5cdFx0XHRtYWluSGVhZGluZzogJCgnZGl2LmhlYWRpbmcgaDEnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmdQYXI6ICQoJ2Rpdi5oZWFkaW5nIHAnKSxcclxuXHRcdFx0aGVhZGVyQ3RhOiAkKCdkaXYuY3RhLWhlYWRlcicpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbkFycm93OiAkKCdkaXYuaWNvbi13cmFwcGVyIHN2Zy5hcnJvdycpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbjogJCgndWwuZGVzY3JpcHRpb24gbGknKSxcclxuXHRcdFx0Z2FsbGVyeUltYWdlc1NtYWxsOiAkKCdkaXYuc2xpZGVyLW5hdiBkaXYuaW1hZ2VzJyksXHJcblx0XHRcdGJyYW5kU3BhbnM6ICQoJ3NlY3Rpb24uYWJvdXQgcCBzcGFuLmJyYW5kcycpLFxyXG5cdFx0XHRicmFuZFBvcHVwOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5wb3B1cCcpLFxyXG5cdFx0XHRnYWxsZXJ5SW1nOiAkKCdsaS5nYWxsZXJ5IHVsLmdhbGxlcnktaW1hZ2VzIGxpJyksXHJcblx0XHRcdG5hdkRvdHM6ICQoJ2xpLmdhbGxlcnkgZGl2Lm5hdi1kb3RzIHNwYW4nKSxcclxuXHRcdFx0aW1nQmFjazogJCgnbGkuZ2FsbGVyeSBkaXYuYmFja3dhcmQnKSxcclxuXHRcdFx0aW1nRm9yd2FyZDogJCgnbGkuZ2FsbGVyeSBkaXYuZm9yd2FyZCcpLFxyXG5cdFx0XHRhYm91dFNlY3Rpb246ICQoJ3NlY3Rpb24uYWJvdXQnKSxcclxuXHRcdFx0Y29udGFjdFNlY3Rpb246ICQoJ3NlY3Rpb24uY29udGFjdCcpLFxyXG5cdFx0XHRmb290ZXJTZWN0aW9uOiAkKCdzZWN0aW9uLmZvb3RlcicpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBlcHNpbG9uID0gKDEwMDAgLyA2MCAvIHNlbGYuY29uZmlnLmR1cmF0aW9uKSAvIDQ7XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDAuNTgsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwxLDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5jb25maWcuc2xpZGVyV3JhcHBlci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5pbml0U2xpZGVyKCAkKHRoaXMpICk7XHJcblx0XHR9KTtcclxuXHRcdHNlbGYuZXZlbnRXYXRjaCgpO1xyXG5cdFx0c2VsZi5nYWxsZXJ5UGljdHVyZUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzUmFuZG9tQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNMb2dvQm94KCk7XHJcblx0XHRzZWxmLnNjcm9sbFNwZWVkKCAxMDAsIDUwMCApO1xyXG5cclxuXHR9OyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNMb2dvQm94ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBtb3VzZVggPSAwLFxyXG5cdFx0bW91c2VZID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5kb2N1bWVudE9iai5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRtb3VzZVggPSBlLnBhZ2VYO1xyXG5cdFx0bW91c2VZID0gZS5wYWdlWTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmNzcyh7XHJcblx0XHRcdFx0J3RvcCc6IG1vdXNlWSArIDE1LFxyXG5cdFx0XHRcdCdsZWZ0JzogbW91c2VYICsgNVxyXG5cdFx0XHR9KS5zaG93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc1JhbmRvbUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNik7XHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLmVxKHJhbmRvbU51bSkuYWRkQ2xhc3MoJ2JyYW5kLWFuaW0nKVxyXG5cdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYnJhbmQtYW5pbScpO1xyXG5cdH0sIDMwMDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmV2ZW50V2F0Y2ggPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0aGlzKTtcclxuXHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdFx0c2VsZi5nYWxsZXJ5SW1nLmZpcnN0KCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UnKTtcclxuXHRcdHNlbGYubmF2RG90cy5maXJzdCgpLmFkZENsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzEnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnNHB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnMTVweCdcclxuXHRcdH0sIDQwMCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2xvd0FuY2hvcigpO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgY2xpY2tlZEVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRlbGVtVG9TaG93ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoY2xpY2tlZEVsZW1JbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIGNvdW50ZXIgPiAyICkge1xyXG5cdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1hZ2VzU21hbGwuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdGYXNoaW9uW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSk7XHJcblx0XHRcdCsrY291bnRlcjtcclxuXHRcdH0sIDI1MDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmhlYWRlclBhcmFsbGF4ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BQb3MgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHJcblx0XHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIHRvcFBvcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW5pdFNsaWRlciA9IGZ1bmN0aW9uKCBzbGlkZXJXcmFwcGVyICkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyID0gc2xpZGVyV3JhcHBlci5maW5kKCd1bC5zbGlkZXInKTtcclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zbGlkZXItbmF2JykuZmluZCgnZGl2LmdhbGxlcnknKTtcclxuXHRzZWxmLnNsaWRlckJhY2sgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5iYWNrLWJ1dHRvbicpO1xyXG5cdHNlbGYuc3ZnQ292ZXJMYXllciA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnN2Zy1jb3ZlcicpO1xyXG5cdHZhciBwYXRoSWQgPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZmluZCgncGF0aCcpLmF0dHIoJ2lkJyk7XHJcblx0c2VsZi5zdmdQYXRoID0gbmV3IFNuYXAoJyMnICsgcGF0aElkKTtcclxuXHJcblx0c2VsZi5wYXRoQXJyYXlbMF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsxXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzJdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAyJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbM10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDcnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs0XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzVdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA4Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDQnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs3XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzhdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA1Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEwJyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gc2VsZi5jb25maWcuZ2FsbGVyeUltZy5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmxlbmd0aDtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4ID4gMCApIHtcclxuXHRcdFx0dmFyIHByZXZJbWcgPSB0b3BJbWdJbmRleCAtIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0fSwgNjAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5jb25maWcuaW1nRm9yd2FyZC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSBzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9IHNlbGYuY29uZmlnLmdhbGxlcnlJbWcubGVuZ3RoO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPCBhbGxJbWdzIC0gMSApIHtcclxuXHRcdFx0dmFyIG5leHRJbWcgPSB0b3BJbWdJbmRleCArIDE7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltZy5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdH0sIDYwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWcucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcubmF2RG90cy5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5uYXZEb3RzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gc2VsZi5jb25maWcubmF2RG90cy5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpO1xyXG5cclxuXHRcdGlmICggY2xpY2tlZERvdEluZGV4ID4gdG9wSW1nRG90ICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1nLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHR9XHJcblx0XHRzZWxmLmNvbmZpZy5uYXZEb3RzLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJldHJpZXZlVmlzaWJsZVNsaWRlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcclxuXHRyZXR1cm4gdGhpcy5zbGlkZXIuZmluZCgnbGkudmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNpZGVNZW51SGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDAwICkge1xyXG5cdFx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZiAoIHBvc2l0aW9uIDw9IDQ0MCB8fCBwb3NpdGlvbiA9PT0gMCApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE5MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTIwKTtcclxuXHRcdH0pXHJcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnVwZGF0ZVNsaWRlID0gZnVuY3Rpb24oIG9sZFNsaWRlLCBuZXdTbGlkZSwgZGlyZWN0aW9uLCBzdmdDb3ZlckxheWVyLCBwYXRocywgc3ZnUGF0aCApIHtcclxuXHR2YXIgcGF0aDEgPSAwLFxyXG5cdFx0cGF0aDIgPSAwLFxyXG5cdFx0cGF0aDMgPSAwLFxyXG5cdFx0cGF0aDQgPSAwLFxyXG5cdFx0cGF0aDUgPSAwO1xyXG5cclxuXHRpZiAoIGRpcmVjdGlvbiA9PT0gJ2dhbGxlcnknKSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzBdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1syXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNF07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzZdO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s4XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1sxXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbM107XHJcblx0XHRwYXRoMyA9IHBhdGhzWzVdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s3XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOV07XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHN2Z0NvdmVyTGF5ZXIuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdHN2Z1BhdGguYXR0cignZCcsIHBhdGgxKTtcclxuXHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDJ9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDN9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvbGRTbGlkZS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRuZXdTbGlkZS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRpZiAoIHNlbGYuY29uZmlnLm1haW5TbGlkZS5oYXNDbGFzcygndmlzaWJsZScpICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3Aoc2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDR9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDV9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdmdDb3ZlckxheWVyLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBzZWxmLmNvbmZpZy5kZWxheSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBNYWtldXAgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGluaXRTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9pbml0U2xpZGVyJyk7XHJcbnZhciByZXRyaWV2ZVZpc2libGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3JldHJpZXZlVmlzaWJsZVNsaWRlJyk7XHJcbnZhciBoZWFkZXJQYXJhbGxheCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2hlYWRlclBhcmFsbGF4Jyk7XHJcbnZhciB1cGRhdGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3VwZGF0ZVNsaWRlJyk7XHJcbnZhciBldmVudFdhdGNoID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZXZlbnRXYXRjaCcpO1xyXG52YXIgZ2FsbGVyeVBpY3R1cmVBbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltJyk7XHJcbnZhciBwaWN0dXJlU2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcGljdHVyZVNsaWRlcicpO1xyXG52YXIgYnJhbmRzUmFuZG9tQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc1JhbmRvbUFuaW0nKTtcclxudmFyIGJyYW5kc0xvZ29Cb3ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNMb2dvQm94Jyk7XHJcbnZhciBzaWRlTWVudUhpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9zaWRlTWVudUhpZGUnKTtcclxudmFyIHNsb3dBbmNob3IgPSByZXF1aXJlKCcuL3Rvb2xzL3Nsb3dBbmNob3InKTtcclxudmFyIGJlemllciA9IHJlcXVpcmUoJy4vdG9vbHMvYmV6aWVyJyk7XHJcbnZhciBzY3JvbGxTcGVlZCA9IHJlcXVpcmUoJy4vdG9vbHMvc2Nyb2xsU3BlZWQnKTtcclxudmFyIHRtcGxDb25maWcgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90bXBsQ29uZmlnJyk7XHJcbnZhciByZW5kZXJHYWxsZXJ5ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcmVuZGVyR2FsbGVyeScpO1xyXG5cclxudmFyIG1ha2V1cCA9IG5ldyBNYWtldXAoKTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZW5kZXJHYWxsZXJ5ID0gZnVuY3Rpb24oIGFyZyApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5waWN0dXJlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKCBOdW1iZXIoc2VsZi5waWN0dXJlc1tpXS5pZCkgPT09IGFyZyApIHtcclxuXHJcblx0XHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcy5wdXNoKHNlbGYucGljdHVyZXNbaV0pO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciB0ZW1wbGF0ZSA9ICQoJyNnYWxsZXJ5LXRtcGwnKS5odG1sKCksXHJcblx0XHRjb21waWxlZCA9IEhhbmRsZWJhcnMuY29tcGlsZSh0ZW1wbGF0ZSksXHJcblx0XHRyZW5kZXJlZCA9IGNvbXBpbGVkKHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyk7XHJcblxyXG5cdCQoJyNnYWxsZXJ5LXJlbmRlcmVkJykuaHRtbChyZW5kZXJlZCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuZnVuY3Rpb24gUGljdHVyZShpZCwgZmlsZVBhdGgsIGRlc2NyaXB0aW9uLCBiZ0RhcmspIHtcclxuXHR0aGlzLmlkID0gaWQ7XHJcblx0dGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG5cdHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuXHR0aGlzLmJnRGFyayA9IGJnRGFyaztcclxufVxyXG5cclxubWFrZXVwLnByb3RvdHlwZS5waWN0dXJlcyA9IFtcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcxLmpwZycsICdUcmVzemthaSBBbmV0dCcsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcyLmpwZycsICdTemFiw7MgQ3NpbGxhIC0gQ3NpbGxhZ2vDqXAnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMy5qcGcnLCAnTGFjYSBTb8OzcyAtIFBob3RvZ3JhcGh5JywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzQuanBnJywgJ0fDoWJvciBHaWJiw7MgS2lzcyAtIEdpYmLDs0FydCBQaG90b2dyYXB5JywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzUuanBnJywgJ0JlcnTDs2sgVmlkZW8gJmFtcDsgUGhvdG8nLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0MS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MgLSBTdW5ibG9vbScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QyLmpwZycsICdNw6F0w6lmeSBTemFib2xjcyAtIE1leWVyIEVzenRlci1WaXLDoWcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0My5qcGcnLCAnUHJva29wIEthdGEgU21pbmtpc2tvbGEgc21pbmt2ZXJzZW55ZScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24xLmpwZycsICdCw6FueWFpIELDoWxpbnQgLSBDc29yasOhbiBLcmlzenRhJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjIuanBnJywgJ0ZvdMOzIEJhenNhIEtpcy1Ib3J2w6F0aCAtIEjDoXJpIEhham5hJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjMuanBnJywgJ0thdW5pdHogVGFtw6FzIC0gVMOzdGggQWxleGFuZHJhJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjQuanBnJywgJ055ZXJzIEF0dGlsYSAtIFN0eWFzem5pIERvcmluYSAtIFNpaXJhIGtvbGxla2Npw7MgMScsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjUuanBnJywgJ055ZXJzIEF0dGlsYSAtIFN0eWFzem5pIERvcmluYSAtIFNpaXJhIGtvbGxla2Npw7MgMicsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjYuanBnJywgJ055ZXJzIEF0dGlsYSAtIFRhdWJlciBLaW5nYSAtIFNpaXJhIGtvbGxla2Npw7MgMScsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjcuanBnJywgJ055ZXJzIEF0dGlsYSAtIFRhdWJlciBLaW5nYSAtIFNpaXJhIGtvbGxla2Npw7MgMicsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjguanBnJywgJ1plbXNlIFNBVVJJQSBrb2xsZWtjacOzIC0gTcOhdMOpZnkgU3phYm9sY3MgLSBTenR5ZWhsaWsgSWxkaWvDsycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb245LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsyAtIE3DoXTDqWZ5IFN6YWJvbGNzIC0gVmVuY2VsIEtyaXN6dGluYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5MS5qcGcnLCAnRGVicmVjemkgSsOhbm9zIC0gRGVicmVjemkgSsOhbm9zIEZvdG9ncsOhZmlhIC0gU8OhbmRvciBOb8OpbWknLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Mi5qcGcnLCAnR2FicmllbGxhIEJhcmFueWkgLSBNb2RlbGwgVmlrdG9yaWEgU2FsZXRyb3MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5My5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MgMSAoMikgLSBTdW5ibG9vbScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NC5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MgMSAoNCkgLSBNZXllciBFc3p0ZXItVmlyw6FnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk1LmpwZycsICdNw6F0w6lmeSBTemFib2xjcyAxICg1KSAtIFN6xbFjcyBLcmlzenRpbmEnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTYuanBnJywgJ1N6YWJvIE1pa2xvcyAtIFNjaGVsbGVuYmVyZ2VyIFpzdXpzYW5uYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Ny5qcGcnLCAnU3ppc3ppayBEw6FuaWVsIC0gRsO8Z2VkaSBEw7NyYSBUw61tZWEnLCBmYWxzZSlcclxuXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYmV6aWVyID0gZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBlcHNpbG9uICkge1xyXG5cclxuXHR2YXIgY3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB4MSArIDMgKiB2ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgY3VydmVZID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiB2ICogdiAqIHQgKiB5MSArIDMgKiB2ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGVyaXZhdGl2ZUN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogKDIgKiAodCAtIDEpICogdCArIHYgKiB2KSAqIHgxICsgMyAqICgtIHQgKiB0ICogdCArIDIgKiB2ICogdCkgKiB4MjtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24odCl7XHJcblxyXG5cdFx0dmFyIHggPSB0LCB0MCwgdDEsIHQyLCB4MiwgZDIsIGk7XHJcblxyXG5cdFx0Ly8gRmlyc3QgdHJ5IGEgZmV3IGl0ZXJhdGlvbnMgb2YgTmV3dG9uJ3MgbWV0aG9kIC0tIG5vcm1hbGx5IHZlcnkgZmFzdC5cclxuXHRcdGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKyl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKSAtIHg7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MikgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0ZDIgPSBkZXJpdmF0aXZlQ3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKGQyKSA8IDFlLTYpIGJyZWFrO1xyXG5cdFx0XHR0MiA9IHQyIC0geDIgLyBkMjtcclxuXHRcdH1cclxuXHJcblx0XHR0MCA9IDA7IHQxID0gMTsgdDIgPSB4O1xyXG5cclxuXHRcdGlmICh0MiA8IHQwKSByZXR1cm4gY3VydmVZKHQwKTtcclxuXHRcdGlmICh0MiA+IHQxKSByZXR1cm4gY3VydmVZKHQxKTtcclxuXHJcblx0XHQvLyBGYWxsYmFjayB0byB0aGUgYmlzZWN0aW9uIG1ldGhvZCBmb3IgcmVsaWFiaWxpdHkuXHJcblx0XHR3aGlsZSAodDAgPCB0MSl7XHJcblx0XHRcdHgyID0gY3VydmVYKHQyKTtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyIC0geCkgPCBlcHNpbG9uKSByZXR1cm4gY3VydmVZKHQyKTtcclxuXHRcdFx0aWYgKHggPiB4MikgdDAgPSB0MjtcclxuXHRcdFx0ZWxzZSB0MSA9IHQyO1xyXG5cdFx0XHR0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZhaWx1cmVcclxuXHRcdHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cclxuXHR9O1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5cdG1ha2V1cC5wcm90b3R5cGUuc2Nyb2xsU3BlZWQgPSBmdW5jdGlvbihzdGVwLCBzcGVlZCwgZWFzaW5nKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpLFxyXG4gICAgICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgICAgICAgICAkYm9keSA9ICQoJ2h0bWwsIGJvZHknKSxcclxuICAgICAgICAgICAgb3B0aW9uID0gZWFzaW5nIHx8ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgcm9vdCA9IDAsXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxZLFxyXG4gICAgICAgICAgICBzY3JvbGxYLFxyXG4gICAgICAgICAgICB2aWV3O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICR3aW5kb3cub24oJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFZLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsID0gZS5vcmlnaW5hbEV2ZW50LmRldGFpbDtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFkgPSAkZG9jdW1lbnQuaGVpZ2h0KCkgPiAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWCA9ICRkb2N1bWVudC53aWR0aCgpID4gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LmhlaWdodCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQud2lkdGgoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFggJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJC5lYXNpbmcuZGVmYXVsdCA9IGZ1bmN0aW9uICh4LHQsYixjLGQpIHtcclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2xvd0FuY2hvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR0aGlzLmNvbmZpZy5hbGxBbmNob3Iub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcblx0XHRcdGlmICggdGFyZ2V0Lmxlbmd0aCApIHtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuXHRcdFx0XHR9LCAxMDAwKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyJdfQ==
