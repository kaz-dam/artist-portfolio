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

makeup.prototype.navDot = function() {
	$('#tmpl-wrapper div.nav-dots span').on('click', function() {
		var clickedDotIndex = $(this).index(),
			topImgDot = $('#tmpl-wrapper div.nav-dots span').filter('.top-image').index();
		if ( clickedDotIndex > topImgDot ) {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-forward');
		} else {
			$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(clickedDotIndex).addClass('visible-image go-back');
		}
		$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn');
		$(this).addClass('top-image bounceIn');
	}); 
};

module.exports = makeup;
},{"./Makeup":1}],9:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.pictureSlider = function() {
	var self = this;
			
	self.config.imgBack.on('click', function() {
		var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = $('#tmpl-wrapper ul.gallery-images li').length;

		if ( topImgIndex > 0 ) {
			var prevImg = topImgIndex - 1;
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(prevImg).addClass('visible-image go-back');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(prevImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutRight');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(allImgs - 1).addClass('visible-image go-back');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(allImgs - 1).addClass('top-image bounceIn');
			}, 600);
		}
	});

	self.config.imgForward.on('click', function() {
		var topImg = $('#tmpl-wrapper ul.gallery-images li').filter('.visible-image'),
			topImgIndex = topImg.index(),
			allImgs = $('#tmpl-wrapper ul.gallery-images li').length;

		if ( topImgIndex < allImgs - 1 ) {
			var nextImg = topImgIndex + 1;
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(nextImg).addClass('visible-image go-forward');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(nextImg).addClass('top-image bounceIn');
			}, 600);
		} else {
			topImg.removeClass('go-forward').addClass('bounceOutLeft');
			setTimeout(function() {
				$('#tmpl-wrapper ul.gallery-images li').removeClass().eq(0).addClass('visible-image go-forward');
				$('#tmpl-wrapper div.nav-dots span').removeClass('top-image bounceIn').eq(0).addClass('top-image bounceIn');
			}, 600);
		}
	});
};

module.exports = makeup;
},{"./Makeup":1}],10:[function(require,module,exports){
var makeup = require('./Makeup');

makeup.prototype.retrieveVisibleSlide = function( slider ) {
	return this.slider.find('li.visible');
};

module.exports = makeup;
},{"./Makeup":1}],11:[function(require,module,exports){
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
},{"./Makeup":1}],12:[function(require,module,exports){
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
},{"./Makeup":1}],13:[function(require,module,exports){
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

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/navDot":8,"./functions/pictureSlider":9,"./functions/retrieveVisibleSlide":10,"./functions/sideMenuHide":11,"./functions/updateSlide":12,"./templates/renderGallery":14,"./templates/templates":15,"./templates/tmplConfig":16,"./tools/bezier":17,"./tools/scrollSpeed":18,"./tools/slowAnchor":19}],14:[function(require,module,exports){
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

	self.navDot();
};

module.exports = makeup;
},{"../functions/Makeup":1,"../templates/templates":15}],15:[function(require,module,exports){
module.exports["gallery"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "			<li><img src=\"assets/images/"
    + alias3(((helper = (helper = helpers.filePath || (depth0 != null ? depth0.filePath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filePath","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><p>"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p></li>		<!-- class=\"visible-image\" -->\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "		<span></span>			<!-- class=\"top-image\" -->\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"gallery-images\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pics : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\r\n<div class=\"nav-dots\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pics : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
},{}],16:[function(require,module,exports){
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
	new Picture('1', 'wedding/wedding5.jpg', 'Bertók Video & Photo', false),
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
];

module.exports = makeup;
},{"../functions/Makeup":1}],17:[function(require,module,exports){
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
},{"../functions/Makeup":1}],18:[function(require,module,exports){
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
},{"../functions/Makeup":1}],19:[function(require,module,exports){
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
},{"../functions/Makeup":1}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvbmF2RG90LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9waWN0dXJlU2xpZGVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9yZXRyaWV2ZVZpc2libGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvc2lkZU1lbnVIaWRlLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gXHJcblxyXG5cdGZ1bmN0aW9uIE1ha2V1cCgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRzZWxmLnNsaWRlciA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uID0ge307XHJcblx0XHRzZWxmLnNsaWRlckJhY2sgPSB7fTtcclxuXHRcdHNlbGYuc3ZnQ292ZXJMYXllciA9IHt9O1xyXG5cdFx0c2VsZi5zdmdQYXRoID0ge307XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0ge307XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5wYXRoQXJyYXkgPSBbXTtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0ge307XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzID0gW107XHJcblxyXG5cdFx0c2VsZi5jb25maWcgPSB7XHJcblx0XHRcdHdpbmRvd09iajogJCh3aW5kb3cpLFxyXG5cdFx0XHRkb2N1bWVudE9iajogJChkb2N1bWVudCksXHJcblx0XHRcdG1lbnU6ICQoJ3VsLm1lbnUgbGkgYScpLFxyXG5cdFx0XHRzaWRlTWVudVNjcm9sbDogJCgnZGl2LnNjcm9sbC1tZW51JyksXHJcblx0XHRcdHNsaWRlcldyYXBwZXI6ICQoJ2Rpdi5zbGlkZXItd3JhcHBlcicpLFxyXG5cdFx0XHRtYWluU2xpZGU6ICQoJ3VsLnNsaWRlciBsaTpmaXJzdC1jaGlsZCcpLFxyXG5cdFx0XHRkdXJhdGlvbjogMzAwLFxyXG5cdFx0XHRkZWxheTogMzAwLFxyXG5cdFx0XHRhbGxBbmNob3I6ICQoJ2FbaHJlZio9XFxcXCNdOm5vdChbaHJlZj1cXFxcI10pJyksXHJcblx0XHRcdHRvcE1lbnU6ICQoJ3VsLm1lbnUnKSxcclxuXHRcdFx0bWVudURpdjogJCgnc2VjdGlvbi5oZWFkZXIgZGl2Lm1lbnUnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmdEaXY6ICQoJ2Rpdi5oZWFkaW5nJyksXHJcblx0XHRcdG1haW5IZWFkaW5nOiAkKCdkaXYuaGVhZGluZyBoMScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ1BhcjogJCgnZGl2LmhlYWRpbmcgcCcpLFxyXG5cdFx0XHRoZWFkZXJDdGE6ICQoJ2Rpdi5jdGEtaGVhZGVyJyksXHJcblx0XHRcdGpvYkRlc2NyaXB0aW9uQXJyb3c6ICQoJ2Rpdi5pY29uLXdyYXBwZXIgc3ZnLmFycm93JyksXHJcblx0XHRcdGpvYkRlc2NyaXB0aW9uOiAkKCd1bC5kZXNjcmlwdGlvbiBsaScpLFxyXG5cdFx0XHRnYWxsZXJ5SW1hZ2VzU21hbGw6ICQoJ2Rpdi5zbGlkZXItbmF2IGRpdi5pbWFnZXMnKSxcclxuXHRcdFx0YnJhbmRTcGFuczogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4uYnJhbmRzJyksXHJcblx0XHRcdGJyYW5kUG9wdXA6ICQoJ3NlY3Rpb24uYWJvdXQgcCBzcGFuLnBvcHVwJyksXHJcblx0XHRcdC8vIGdhbGxlcnlJbWc6ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKSxcdG5vdCBkZWZpbmVkXHJcblx0XHRcdC8vIG5hdkRvdHM6ICQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKSxcdG5vdCBkZWZpbmVkXHJcblx0XHRcdGltZ0JhY2s6ICQoJ2xpLmdhbGxlcnkgZGl2LmJhY2t3YXJkJyksXHJcblx0XHRcdGltZ0ZvcndhcmQ6ICQoJ2xpLmdhbGxlcnkgZGl2LmZvcndhcmQnKSxcclxuXHRcdFx0YWJvdXRTZWN0aW9uOiAkKCdzZWN0aW9uLmFib3V0JyksXHJcblx0XHRcdGNvbnRhY3RTZWN0aW9uOiAkKCdzZWN0aW9uLmNvbnRhY3QnKSxcclxuXHRcdFx0Zm9vdGVyU2VjdGlvbjogJCgnc2VjdGlvbi5mb290ZXInKVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXBzaWxvbiA9ICgxMDAwIC8gNjAgLyBzZWxmLmNvbmZpZy5kdXJhdGlvbikgLyA0O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwwLjU4LDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMSwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuY29uZmlnLnNsaWRlcldyYXBwZXIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuaW5pdFNsaWRlciggJCh0aGlzKSApO1xyXG5cdFx0fSk7XHJcblx0XHRzZWxmLmV2ZW50V2F0Y2goKTtcclxuXHRcdHNlbGYuZ2FsbGVyeVBpY3R1cmVBbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc1JhbmRvbUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzTG9nb0JveCgpO1xyXG5cdFx0c2VsZi5zY3JvbGxTcGVlZCggMTAwLCA1MDAgKTtcclxuXHJcblx0fTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzTG9nb0JveCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgbW91c2VYID0gMCxcclxuXHRcdG1vdXNlWSA9IDAsXHJcblx0XHRzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcuZG9jdW1lbnRPYmoub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0bW91c2VYID0gZS5wYWdlWDtcclxuXHRcdG1vdXNlWSA9IGUucGFnZVk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRcdCd0b3AnOiBtb3VzZVkgKyAxNSxcclxuXHRcdFx0XHQnbGVmdCc6IG1vdXNlWCArIDVcclxuXHRcdFx0fSkuc2hvdygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRoaXMpLm5leHQoKS5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNSYW5kb21BbmltID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpO1xyXG5cdFx0c2VsZi5jb25maWcuYnJhbmRTcGFucy5lcShyYW5kb21OdW0pLmFkZENsYXNzKCdicmFuZC1hbmltJylcclxuXHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2JyYW5kLWFuaW0nKTtcclxuXHR9LCAzMDAwKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5ldmVudFdhdGNoID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWRTbGlkZVBvc2l0aW9uID0gc2VsZi5zZWxlY3RlZEdhbGxlcnkuZGF0YSgnZ2FsbGVyeS1jb3VudCcpLFxyXG5cdFx0XHRzZWxlY3RlZFNsaWRlID0gc2VsZi5zbGlkZXIuY2hpbGRyZW4oJ2xpJykuZXEoMSksXHJcblx0XHRcdHZpc2libGVTbGlkZSA9IHNlbGYucmV0cmlldmVWaXNpYmxlU2xpZGUoc2VsZi5zbGlkZXIpLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGVQb3NpdGlvbiA9IHZpc2libGVTbGlkZS5pbmRleCgpLFxyXG5cdFx0XHRkaXJlY3Rpb24gPSAnZ2FsbGVyeSc7XHJcblx0XHRzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblxyXG5cdFx0c2VsZi5yZW5kZXJHYWxsZXJ5KCBzZWxlY3RlZFNsaWRlUG9zaXRpb24gKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXJcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgwKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdob21lJztcclxuXHRcdHNlbGYudXBkYXRlU2xpZGUodmlzaWJsZVNsaWRlLCBzZWxlY3RlZFNsaWRlLCBkaXJlY3Rpb24sIHNlbGYuc3ZnQ292ZXJMYXllciwgc2VsZi5wYXRoQXJyYXksIHNlbGYuc3ZnUGF0aCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2lkZU1lbnVIaWRlKCk7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzEnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnNHB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaG92ZXJlZEdhbGxlcnkgPSAkKHRoaXMpLFxyXG5cdFx0XHRnYWxsZXJ5TmFtZSA9IGhvdmVyZWRHYWxsZXJ5LmZpbmQoJ2gyJyk7XHJcblx0XHRnYWxsZXJ5TmFtZS5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogJzAnLFxyXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiAnMTVweCdcclxuXHRcdH0sIDQwMCk7XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2xvd0FuY2hvcigpO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgY2xpY2tlZEVsZW0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGNsaWNrZWRFbGVtSW5kZXggPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbkFycm93LmluZGV4KGNsaWNrZWRFbGVtKSxcclxuXHRcdFx0XHRlbGVtVG9TaG93ID0gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoY2xpY2tlZEVsZW1JbmRleCk7XHJcblxyXG5cdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24ubm90KGVsZW1Ub1Nob3cpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuaGVhZGVyUGFyYWxsYXgoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5nYWxsZXJ5UGljdHVyZUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnRlciA9IDAsXHJcblx0XHRzZWxmID0gdGhpcyxcclxuXHRcdGJnV2VkZGluZyA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnRmFzaGlvbiA9IFtcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24yLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjMtc21hbGwuanBnJ1xyXG5cdFx0XSxcclxuXHRcdGJnQmVhdXR5ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5MS1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9iZWF1dHkvYmVhdXR5My1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdDb250ZXN0ID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0My1zbWFsbC5qcGcnXHJcblx0XHRdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHR9KS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pO1xyXG5cdFx0Kytjb3VudGVyO1xyXG5cclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIGNvdW50ZXIgPiAyICkge1xyXG5cdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1hZ2VzU21hbGwuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdXZWRkaW5nW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdGYXNoaW9uW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdH0pLm5leHQoKS5kZWxheSgyNTAwKS5jc3Moe1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0NvbnRlc3RbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSk7XHJcblx0XHRcdCsrY291bnRlcjtcclxuXHRcdH0sIDI1MDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmhlYWRlclBhcmFsbGF4ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BQb3MgPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHJcblx0XHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIHRvcFBvcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdFx0c2VsZi5jb25maWcubWVudURpdi5jc3MoJ3RvcCcsIDQ0MCAtICh0b3BQb3MgLyAyMDApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jb25maWcubWFpbkhlYWRpbmdEaXYuY3NzKHtcclxuXHRcdFx0J29wYWNpdHknOiAxIC0gKCB0b3BQb3MgLyAzMDAgKSxcclxuXHRcdFx0J21hcmdpbi10b3AnOiAyMDcgLSAodG9wUG9zIC8gNSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmhlYWRlckN0YS5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDE1IC0gKHRvcFBvcyAvIDEzKVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaW5pdFNsaWRlciA9IGZ1bmN0aW9uKCBzbGlkZXJXcmFwcGVyICkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyID0gc2xpZGVyV3JhcHBlci5maW5kKCd1bC5zbGlkZXInKTtcclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5zbGlkZXItbmF2JykuZmluZCgnZGl2LmdhbGxlcnknKTtcclxuXHRzZWxmLnNsaWRlckJhY2sgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ2Rpdi5iYWNrLWJ1dHRvbicpO1xyXG5cdHNlbGYuc3ZnQ292ZXJMYXllciA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnN2Zy1jb3ZlcicpO1xyXG5cdHZhciBwYXRoSWQgPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZmluZCgncGF0aCcpLmF0dHIoJ2lkJyk7XHJcblx0c2VsZi5zdmdQYXRoID0gbmV3IFNuYXAoJyMnICsgcGF0aElkKTtcclxuXHJcblx0c2VsZi5wYXRoQXJyYXlbMF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEnKTtcclxuXHRzZWxmLnBhdGhBcnJheVsxXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNicpO1xyXG5cdHNlbGYucGF0aEFycmF5WzJdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAyJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbM10gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDcnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs0XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzVdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA4Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDQnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs3XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwOScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzhdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA1Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDEwJyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLm5hdkRvdCA9IGZ1bmN0aW9uKCkge1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbGlja2VkRG90SW5kZXggPSAkKHRoaXMpLmluZGV4KCksXHJcblx0XHRcdHRvcEltZ0RvdCA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpO1xyXG5cdFx0aWYgKCBjbGlja2VkRG90SW5kZXggPiB0b3BJbWdEb3QgKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHR9XHJcblx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0JCh0aGlzKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0fSk7IFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKCB0b3BJbWdJbmRleCA+IDAgKSB7XHJcblx0XHRcdHZhciBwcmV2SW1nID0gdG9wSW1nSW5kZXggLSAxO1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShwcmV2SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdH0sIDYwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0fSwgNjAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5jb25maWcuaW1nRm9yd2FyZC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0b3BJbWcgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlsdGVyKCcudmlzaWJsZS1pbWFnZScpLFxyXG5cdFx0XHR0b3BJbWdJbmRleCA9IHRvcEltZy5pbmRleCgpLFxyXG5cdFx0XHRhbGxJbWdzID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmxlbmd0aDtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4IDwgYWxsSW1ncyAtIDEgKSB7XHJcblx0XHRcdHZhciBuZXh0SW1nID0gdG9wSW1nSW5kZXggKyAxO1xyXG5cdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0fSwgNjAwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoMCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHR9LCA2MDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJldHJpZXZlVmlzaWJsZVNsaWRlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcclxuXHRyZXR1cm4gdGhpcy5zbGlkZXIuZmluZCgnbGkudmlzaWJsZScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNpZGVNZW51SGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDAwICkge1xyXG5cdFx0c2VsZi5jb25maWcud2luZG93T2JqLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZiAoIHBvc2l0aW9uIDw9IDQ0MCB8fCBwb3NpdGlvbiA9PT0gMCApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE5MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTIwKTtcclxuXHRcdH0pXHJcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xNjApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnVwZGF0ZVNsaWRlID0gZnVuY3Rpb24oIG9sZFNsaWRlLCBuZXdTbGlkZSwgZGlyZWN0aW9uLCBzdmdDb3ZlckxheWVyLCBwYXRocywgc3ZnUGF0aCApIHtcclxuXHR2YXIgcGF0aDEgPSAwLFxyXG5cdFx0cGF0aDIgPSAwLFxyXG5cdFx0cGF0aDMgPSAwLFxyXG5cdFx0cGF0aDQgPSAwLFxyXG5cdFx0cGF0aDUgPSAwO1xyXG5cclxuXHRpZiAoIGRpcmVjdGlvbiA9PT0gJ2dhbGxlcnknKSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzBdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1syXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNF07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzZdO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s4XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1sxXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbM107XHJcblx0XHRwYXRoMyA9IHBhdGhzWzVdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s3XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOV07XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHN2Z0NvdmVyTGF5ZXIuYWRkQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdHN2Z1BhdGguYXR0cignZCcsIHBhdGgxKTtcclxuXHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDJ9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDN9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvbGRTbGlkZS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRuZXdTbGlkZS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0XHRpZiAoIHNlbGYuY29uZmlnLm1haW5TbGlkZS5oYXNDbGFzcygndmlzaWJsZScpICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3Aoc2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDR9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5maXJzdEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzdmdQYXRoLmFuaW1hdGUoeydkJzogcGF0aDV9LCBzZWxmLmNvbmZpZy5kdXJhdGlvbiwgdGhpcy5zZWNvbmRBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzdmdDb3ZlckxheWVyLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBzZWxmLmNvbmZpZy5kZWxheSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBNYWtldXAgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGluaXRTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9pbml0U2xpZGVyJyk7XHJcbnZhciByZXRyaWV2ZVZpc2libGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3JldHJpZXZlVmlzaWJsZVNsaWRlJyk7XHJcbnZhciBoZWFkZXJQYXJhbGxheCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2hlYWRlclBhcmFsbGF4Jyk7XHJcbnZhciB1cGRhdGVTbGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3VwZGF0ZVNsaWRlJyk7XHJcbnZhciBldmVudFdhdGNoID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZXZlbnRXYXRjaCcpO1xyXG52YXIgZ2FsbGVyeVBpY3R1cmVBbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltJyk7XHJcbnZhciBwaWN0dXJlU2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcGljdHVyZVNsaWRlcicpO1xyXG52YXIgYnJhbmRzUmFuZG9tQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc1JhbmRvbUFuaW0nKTtcclxudmFyIGJyYW5kc0xvZ29Cb3ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNMb2dvQm94Jyk7XHJcbnZhciBzaWRlTWVudUhpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9zaWRlTWVudUhpZGUnKTtcclxudmFyIHNsb3dBbmNob3IgPSByZXF1aXJlKCcuL3Rvb2xzL3Nsb3dBbmNob3InKTtcclxudmFyIGJlemllciA9IHJlcXVpcmUoJy4vdG9vbHMvYmV6aWVyJyk7XHJcbnZhciBzY3JvbGxTcGVlZCA9IHJlcXVpcmUoJy4vdG9vbHMvc2Nyb2xsU3BlZWQnKTtcclxudmFyIHRtcGxDb25maWcgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90bXBsQ29uZmlnJyk7XHJcbnZhciByZW5kZXJHYWxsZXJ5ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcmVuZGVyR2FsbGVyeScpO1xyXG52YXIgZ2FsbGVyeSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3RlbXBsYXRlcycpO1xyXG52YXIgbmF2RG90ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvbmF2RG90Jyk7XHJcblxyXG52YXIgbWFrZXVwID0gbmV3IE1ha2V1cCgpOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3RlbXBsYXRlcycpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZW5kZXJHYWxsZXJ5ID0gZnVuY3Rpb24oIGFyZyApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzID0gW107XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5waWN0dXJlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKCBOdW1iZXIoc2VsZi5waWN0dXJlc1tpXS5pZCkgPT09IGFyZyApIHtcclxuXHRcdFx0c2VsZi5zZWxlY3RlZFBpY3R1cmVzLnB1c2goc2VsZi5waWN0dXJlc1tpXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgcmVuZGVyZWRQaWNzID0gZ2FsbGVyeS5nYWxsZXJ5KHtwaWNzOiBzZWxmLnNlbGVjdGVkUGljdHVyZXN9KTtcclxuXHQkKCcjdG1wbC13cmFwcGVyJykuaHRtbChyZW5kZXJlZFBpY3MpO1xyXG5cclxuXHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykuZmlyc3QoKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZScpO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maXJzdCgpLmFkZENsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHJcblx0c2VsZi5uYXZEb3QoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsIm1vZHVsZS5leHBvcnRzW1wiZ2FsbGVyeVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyLCBhbGlhczE9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczI9XCJmdW5jdGlvblwiLCBhbGlhczM9dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIlx0XHRcdDxsaT48aW1nIHNyYz1cXFwiYXNzZXRzL2ltYWdlcy9cIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZmlsZVBhdGggfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpbGVQYXRoIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmaWxlUGF0aFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGFsdD1cXFwiXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmlkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiaWRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj48cD5cIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb24gfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJkZXNjcmlwdGlvblwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L3A+PC9saT5cdFx0PCEtLSBjbGFzcz1cXFwidmlzaWJsZS1pbWFnZVxcXCIgLS0+XFxyXFxuXCI7XG59LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICByZXR1cm4gXCJcdFx0PHNwYW4+PC9zcGFuPlx0XHRcdDwhLS0gY2xhc3M9XFxcInRvcC1pbWFnZVxcXCIgLS0+XFxyXFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCI8dWwgY2xhc3M9XFxcImdhbGxlcnktaW1hZ2VzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L3VsPlxcclxcbjxkaXYgY2xhc3M9XFxcIm5hdi1kb3RzXFxcIj5cXHJcXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnBpY3MgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L2Rpdj5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5mdW5jdGlvbiBQaWN0dXJlKGlkLCBmaWxlUGF0aCwgZGVzY3JpcHRpb24sIGJnRGFyaykge1xyXG5cdHRoaXMuaWQgPSBpZDtcclxuXHR0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XHJcblx0dGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG5cdHRoaXMuYmdEYXJrID0gYmdEYXJrO1xyXG59XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVzID0gW1xyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzEuanBnJywgJ1RyZXN6a2FpIEFuZXR0JywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzIuanBnJywgJ1N6YWLDsyBDc2lsbGEgLSBDc2lsbGFna8OpcCcsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmczLmpwZycsICdMYWNhIFNvw7NzIC0gUGhvdG9ncmFwaHknLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNC5qcGcnLCAnR8OhYm9yIEdpYmLDsyBLaXNzIC0gR2liYsOzQXJ0IFBob3RvZ3JhcHknLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNS5qcGcnLCAnQmVydMOzayBWaWRlbyAmIFBob3RvJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDEuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzIC0gU3VuYmxvb20nLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0Mi5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MgLSBNZXllciBFc3p0ZXItVmlyw6FnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDMuanBnJywgJ1Byb2tvcCBLYXRhIFNtaW5raXNrb2xhIHNtaW5rdmVyc2VueWUnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMS5qcGcnLCAnQsOhbnlhaSBCw6FsaW50IC0gQ3NvcmrDoW4gS3Jpc3p0YScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24yLmpwZycsICdGb3TDsyBCYXpzYSBLaXMtSG9ydsOhdGggLSBIw6FyaSBIYWpuYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24zLmpwZycsICdLYXVuaXR6IFRhbcOhcyAtIFTDs3RoIEFsZXhhbmRyYScsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb240LmpwZycsICdOeWVycyBBdHRpbGEgLSBTdHlhc3puaSBEb3JpbmEgLSBTaWlyYSBrb2xsZWtjacOzIDEnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb241LmpwZycsICdOeWVycyBBdHRpbGEgLSBTdHlhc3puaSBEb3JpbmEgLSBTaWlyYSBrb2xsZWtjacOzIDInLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb242LmpwZycsICdOeWVycyBBdHRpbGEgLSBUYXViZXIgS2luZ2EgLSBTaWlyYSBrb2xsZWtjacOzIDEnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb243LmpwZycsICdOeWVycyBBdHRpbGEgLSBUYXViZXIgS2luZ2EgLSBTaWlyYSBrb2xsZWtjacOzIDInLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb244LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsyAtIE3DoXTDqWZ5IFN6YWJvbGNzIC0gU3p0eWVobGlrIElsZGlrw7MnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uOS5qcGcnLCAnWmVtc2UgU0FVUklBIGtvbGxla2Npw7MgLSBNw6F0w6lmeSBTemFib2xjcyAtIFZlbmNlbCBLcmlzenRpbmEnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTEuanBnJywgJ0RlYnJlY3ppIErDoW5vcyAtIERlYnJlY3ppIErDoW5vcyBGb3RvZ3LDoWZpYSAtIFPDoW5kb3IgTm/DqW1pJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTIuanBnJywgJ0dhYnJpZWxsYSBCYXJhbnlpIC0gTW9kZWxsIFZpa3RvcmlhIFNhbGV0cm9zJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTMuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzIDEgKDIpIC0gU3VuYmxvb20nLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTQuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzIDEgKDQpIC0gTWV5ZXIgRXN6dGVyLVZpcsOhZycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MgMSAoNSkgLSBTesWxY3MgS3Jpc3p0aW5hJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk2LmpwZycsICdTemFibyBNaWtsb3MgLSBTY2hlbGxlbmJlcmdlciBac3V6c2FubmEnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTcuanBnJywgJ1N6aXN6aWsgRMOhbmllbCAtIEbDvGdlZGkgRMOzcmEgVMOtbWVhJywgZmFsc2UpXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5iZXppZXIgPSBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGVwc2lsb24gKSB7XHJcblxyXG5cdHZhciBjdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHgxICsgMyAqIHYgKiB0ICogdCAqIHgyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBjdXJ2ZVkgPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHkxICsgMyAqIHYgKiB0ICogdCAqIHkyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBkZXJpdmF0aXZlQ3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiAoMiAqICh0IC0gMSkgKiB0ICsgdiAqIHYpICogeDEgKyAzICogKC0gdCAqIHQgKiB0ICsgMiAqIHYgKiB0KSAqIHgyO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbih0KXtcclxuXHJcblx0XHR2YXIgeCA9IHQsIHQwLCB0MSwgdDIsIHgyLCBkMiwgaTtcclxuXHJcblx0XHQvLyBGaXJzdCB0cnkgYSBmZXcgaXRlcmF0aW9ucyBvZiBOZXd0b24ncyBtZXRob2QgLS0gbm9ybWFsbHkgdmVyeSBmYXN0LlxyXG5cdFx0Zm9yICh0MiA9IHgsIGkgPSAwOyBpIDwgODsgaSsrKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpIC0geDtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyKSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRkMiA9IGRlcml2YXRpdmVDdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoZDIpIDwgMWUtNikgYnJlYWs7XHJcblx0XHRcdHQyID0gdDIgLSB4MiAvIGQyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHQwID0gMDsgdDEgPSAxOyB0MiA9IHg7XHJcblxyXG5cdFx0aWYgKHQyIDwgdDApIHJldHVybiBjdXJ2ZVkodDApO1xyXG5cdFx0aWYgKHQyID4gdDEpIHJldHVybiBjdXJ2ZVkodDEpO1xyXG5cclxuXHRcdC8vIEZhbGxiYWNrIHRvIHRoZSBiaXNlY3Rpb24gbWV0aG9kIGZvciByZWxpYWJpbGl0eS5cclxuXHRcdHdoaWxlICh0MCA8IHQxKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIgLSB4KSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRpZiAoeCA+IHgyKSB0MCA9IHQyO1xyXG5cdFx0XHRlbHNlIHQxID0gdDI7XHJcblx0XHRcdHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmFpbHVyZVxyXG5cdFx0cmV0dXJuIGN1cnZlWSh0Mik7XHJcblxyXG5cdH07XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcblx0bWFrZXVwLnByb3RvdHlwZS5zY3JvbGxTcGVlZCA9IGZ1bmN0aW9uKHN0ZXAsIHNwZWVkLCBlYXNpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgJGRvY3VtZW50ID0gJChkb2N1bWVudCksXHJcbiAgICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXHJcbiAgICAgICAgICAgICRib2R5ID0gJCgnaHRtbCwgYm9keScpLFxyXG4gICAgICAgICAgICBvcHRpb24gPSBlYXNpbmcgfHwgJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICByb290ID0gMCxcclxuICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbFksXHJcbiAgICAgICAgICAgIHNjcm9sbFgsXHJcbiAgICAgICAgICAgIHZpZXc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgJHdpbmRvdy5vbignbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBkZWx0YVkgPSBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVksXHJcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBlLm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWSA9ICRkb2N1bWVudC5oZWlnaHQoKSA+ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxYID0gJGRvY3VtZW50LndpZHRoKCkgPiAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQuaGVpZ2h0KCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFgpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC53aWR0aCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAkLmVhc2luZy5kZWZhdWx0ID0gZnVuY3Rpb24gKHgsdCxiLGMsZCkge1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zbG93QW5jaG9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHRoaXMuY29uZmlnLmFsbEFuY2hvci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgPT09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpICYmIGxvY2F0aW9uLmhvc3RuYW1lID09PSB0aGlzLmhvc3RuYW1lKSB7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XHJcblx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcclxuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoICkge1xyXG5cdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcFxyXG5cdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7Il19
