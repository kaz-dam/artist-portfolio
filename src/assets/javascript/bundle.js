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

	self.pictureSlider();

	self.jobSwipe();

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

	$('#icon-wrapper').swipe({
		swipeLeft: function(event, direction, distance, duration, fingerCount) {
			// self.config.jobDescription.eq(0)
			console.log('swiped left');
		},

		swipeRight: function(event, direction, distance, duration, fingerCount) {
			console.log('swiped right');
		},

		tap: function(event, target) {
			console.log('tapped');
		},

		treshold: 0
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
},{"./Makeup":1}],14:[function(require,module,exports){
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

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/jobSwipe":8,"./functions/navDot":9,"./functions/pictureSlider":10,"./functions/retrieveVisibleSlide":11,"./functions/sideMenuHide":12,"./functions/updateSlide":13,"./templates/helpers":15,"./templates/renderGallery":16,"./templates/templates":17,"./templates/tmplConfig":18,"./tools/bezier":19,"./tools/scrollSpeed":20,"./tools/slowAnchor":21}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../functions/Makeup":1,"../templates/templates":17}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{"../functions/Makeup":1}],19:[function(require,module,exports){
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
},{"../functions/Makeup":1}],20:[function(require,module,exports){
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
},{"../functions/Makeup":1}],21:[function(require,module,exports){
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
},{"../functions/Makeup":1}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvam9iU3dpcGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL25hdkRvdC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcGljdHVyZVNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL3NpZGVNZW51SGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvdXBkYXRlU2xpZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvbWFpbi5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvaGVscGVycy5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvcmVuZGVyR2FsbGVyeS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90bXBsQ29uZmlnLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL2Jlemllci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90b29scy9zY3JvbGxTcGVlZC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC90b29scy9zbG93QW5jaG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFxyXG5cclxuXHRmdW5jdGlvbiBNYWtldXAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXIgPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zbGlkZXJCYWNrID0ge307XHJcblx0XHRzZWxmLnN2Z0NvdmVyTGF5ZXIgPSB7fTtcclxuXHRcdHNlbGYuc3ZnUGF0aCA9IHt9O1xyXG5cdFx0c2VsZi5maXJzdEFuaW1hdGlvbiA9IHt9O1xyXG5cdFx0c2VsZi5zZWNvbmRBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYucGF0aEFycmF5ID0gW107XHJcblx0XHRzZWxmLnNlbGVjdGVkR2FsbGVyeSA9IHt9O1xyXG5cdFx0c2VsZi5wb3NpdGlvbkJlZm9yZUdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnID0ge1xyXG5cdFx0XHR3aW5kb3dPYmo6ICQod2luZG93KSxcclxuXHRcdFx0ZG9jdW1lbnRPYmo6ICQoZG9jdW1lbnQpLFxyXG5cdFx0XHRtZW51OiAkKCd1bC5tZW51IGxpIGEnKSxcclxuXHRcdFx0c2lkZU1lbnVTY3JvbGw6ICQoJ2Rpdi5zY3JvbGwtbWVudScpLFxyXG5cdFx0XHRzbGlkZXJXcmFwcGVyOiAkKCdkaXYuc2xpZGVyLXdyYXBwZXInKSxcclxuXHRcdFx0bWFpblNsaWRlOiAkKCd1bC5zbGlkZXIgbGk6Zmlyc3QtY2hpbGQnKSxcclxuXHRcdFx0ZHVyYXRpb246IDMwMCxcclxuXHRcdFx0ZGVsYXk6IDMwMCxcclxuXHRcdFx0YWxsQW5jaG9yOiAkKCdhW2hyZWYqPVxcXFwjXTpub3QoW2hyZWY9XFxcXCNdKScpLFxyXG5cdFx0XHR0b3BNZW51OiAkKCd1bC5tZW51JyksXHJcblx0XHRcdG1lbnVEaXY6ICQoJ3NlY3Rpb24uaGVhZGVyIGRpdi5tZW51JyksXHJcblx0XHRcdG1haW5IZWFkaW5nRGl2OiAkKCdkaXYuaGVhZGluZycpLFxyXG5cdFx0XHRtYWluSGVhZGluZzogJCgnZGl2LmhlYWRpbmcgaDEnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmdQYXI6ICQoJ2Rpdi5oZWFkaW5nIHAnKSxcclxuXHRcdFx0aGVhZGVyQ3RhOiAkKCdkaXYuY3RhLWhlYWRlcicpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbkFycm93OiAkKCdkaXYuaWNvbi13cmFwcGVyIHN2Zy5hcnJvdycpLFxyXG5cdFx0XHRqb2JEZXNjcmlwdGlvbjogJCgndWwuZGVzY3JpcHRpb24gbGknKSxcclxuXHRcdFx0Z2FsbGVyeUltYWdlc1NtYWxsOiAkKCdkaXYuc2xpZGVyLW5hdiBkaXYuaW1hZ2VzJyksXHJcblx0XHRcdGJyYW5kU3BhbnM6ICQoJ3NlY3Rpb24uYWJvdXQgcCBzcGFuLmJyYW5kcycpLFxyXG5cdFx0XHRicmFuZFBvcHVwOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5wb3B1cCcpLFxyXG5cdFx0XHQvLyBnYWxsZXJ5SW1nOiAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJyksXHRub3QgZGVmaW5lZFxyXG5cdFx0XHQvLyBuYXZEb3RzOiAkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJyksXHRub3QgZGVmaW5lZFxyXG5cdFx0XHRpbWdCYWNrOiAkKCdsaS5nYWxsZXJ5IGRpdi5iYWNrd2FyZCcpLFxyXG5cdFx0XHRpbWdGb3J3YXJkOiAkKCdsaS5nYWxsZXJ5IGRpdi5mb3J3YXJkJyksXHJcblx0XHRcdGFib3V0U2VjdGlvbjogJCgnc2VjdGlvbi5hYm91dCcpLFxyXG5cdFx0XHRjb250YWN0U2VjdGlvbjogJCgnc2VjdGlvbi5jb250YWN0JyksXHJcblx0XHRcdGZvb3RlclNlY3Rpb246ICQoJ3NlY3Rpb24uZm9vdGVyJylcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGVwc2lsb24gPSAoMTAwMCAvIDYwIC8gc2VsZi5jb25maWcuZHVyYXRpb24pIC8gNDtcclxuXHRcdHNlbGYuZmlyc3RBbmltYXRpb24gPSBzZWxmLmJlemllcigwLjQyLDAsMC41OCwxLCBlcHNpbG9uKTtcclxuXHRcdHNlbGYuc2Vjb25kQW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDEsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLmNvbmZpZy5zbGlkZXJXcmFwcGVyLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmluaXRTbGlkZXIoICQodGhpcykgKTtcclxuXHRcdH0pO1xyXG5cdFx0c2VsZi5ldmVudFdhdGNoKCk7XHJcblx0XHRzZWxmLmdhbGxlcnlQaWN0dXJlQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNSYW5kb21BbmltKCk7XHJcblx0XHRzZWxmLmJyYW5kc0xvZ29Cb3goKTtcclxuXHRcdHNlbGYuc2Nyb2xsU3BlZWQoIDEwMCwgNTAwICk7XHJcblxyXG5cdH07IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc0xvZ29Cb3ggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIG1vdXNlWCA9IDAsXHJcblx0XHRtb3VzZVkgPSAwLFxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuY29uZmlnLmRvY3VtZW50T2JqLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdG1vdXNlWCA9IGUucGFnZVg7XHJcblx0XHRtb3VzZVkgPSBlLnBhZ2VZO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5uZXh0KCkuY3NzKHtcclxuXHRcdFx0XHQndG9wJzogbW91c2VZICsgMTUsXHJcblx0XHRcdFx0J2xlZnQnOiBtb3VzZVggKyA1XHJcblx0XHRcdH0pLnNob3coKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5uZXh0KCkuaGlkZSgpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuYnJhbmRzUmFuZG9tQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNik7XHJcblx0XHRcdHNlbGYuY29uZmlnLmJyYW5kU3BhbnMuZXEocmFuZG9tTnVtKS5hZGRDbGFzcygnYnJhbmQtYW5pbScpXHJcblx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2JyYW5kLWFuaW0nKTtcclxuXHRcdH0sIDMwMDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmV2ZW50V2F0Y2ggPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0aGlzKTtcclxuXHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNsaWRlckJhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhclx0c2VsZWN0ZWRTbGlkZSA9IHNlbGYuc2xpZGVyLmNoaWxkcmVuKCdsaScpLmVxKDApLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0ZGlyZWN0aW9uID0gJ2hvbWUnO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zaWRlTWVudUhpZGUoKTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRvcGFjaXR5OiAnMScsXHJcblx0XHRcdGxldHRlclNwYWNpbmc6ICc0cHgnXHJcblx0XHR9LCA0MDApO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRvcGFjaXR5OiAnMCcsXHJcblx0XHRcdGxldHRlclNwYWNpbmc6ICcxNXB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbG93QW5jaG9yKCk7XHJcblxyXG5cdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdHZhciBjbGlja2VkRWxlbSA9ICQodGhpcyksXHJcblx0XHRcdFx0Y2xpY2tlZEVsZW1JbmRleCA9IHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cuaW5kZXgoY2xpY2tlZEVsZW0pLFxyXG5cdFx0XHRcdGVsZW1Ub1Nob3cgPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShjbGlja2VkRWxlbUluZGV4KSxcclxuXHRcdFx0XHRjdXJyZW50RWxlbSA9ICQoJ3VsLmRlc2NyaXB0aW9uIGxpLnNlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0XHRpZiAoICFlbGVtVG9TaG93Lmhhc0NsYXNzKCdzZWxlY3RlZC1kZXNjcmlwdGlvbicpICkge1xyXG5cdFx0XHRcdGVsZW1Ub1Nob3cuYWRkQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uIGJvdW5jZUluVXAnKTtcclxuXHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygnYm91bmNlSW5VcCcpLmFkZENsYXNzKCdib3VuY2VPdXREb3duJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uLm5vdChlbGVtVG9TaG93KS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdH0sIDgwMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudEVsZW0ucmVtb3ZlQ2xhc3MoJ2JvdW5jZUluVXAnKS5hZGRDbGFzcygnYm91bmNlT3V0RG93bicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjdXJyZW50RWxlbS5yZW1vdmVDbGFzcygpO1xyXG5cdFx0XHRcdH0sIDgwMCk7XHJcblx0XHRcdH1cclxuXHR9KTtcclxuXHJcblx0c2VsZi5waWN0dXJlU2xpZGVyKCk7XHJcblxyXG5cdHNlbGYuam9iU3dpcGUoKTtcclxuXHJcblx0c2VsZi5oZWFkZXJQYXJhbGxheCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmdhbGxlcnlQaWN0dXJlQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjb3VudGVyID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzLFxyXG5cdFx0YmdXZWRkaW5nID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMy1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdGYXNoaW9uID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24xLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMy1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdCZWF1dHkgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkzLXNtYWxsLmpwZydcclxuXHRcdF0sXHJcblx0XHRiZ0NvbnRlc3QgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDEtc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QzLXNtYWxsLmpwZydcclxuXHRcdF07XHJcblxyXG5cdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0fSkubmV4dCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0fSk7XHJcblx0XHQrK2NvdW50ZXI7XHJcblxyXG5cdFx0aWYgKHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTA0MCkge1xyXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoIGNvdW50ZXIgPiAyICkge1xyXG5cdFx0XHRcdFx0Y291bnRlciA9IDA7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5nYWxsZXJ5SW1hZ2VzU21hbGwuZmlyc3QoKS5jc3Moe1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0XHR9KS5uZXh0KCkuZGVsYXkoMjUwMCkuY3NzKHtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdGYXNoaW9uW2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQmVhdXR5W2NvdW50ZXJdICsgJyknXHJcblx0XHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCsrY291bnRlcjtcclxuXHRcdFx0fSwgMjUwMCk7XHJcblx0XHR9XHJcblx0XHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5oZWFkZXJQYXJhbGxheCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdGlmIChzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA8IDEwNDApIHtcclxuXHRcdHNlbGYuY29uZmlnLmNvbnRhY3RTZWN0aW9uLmNzcyh7XHJcblx0XHRcdCd6LWluZGV4JzogLTJcclxuXHRcdFx0Ly8gJ29wYWNpdHknOiAwXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wUG9zID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0aWYgKCBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDAgKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLm1lbnVEaXYuY3NzKCd0b3AnLCB0b3BQb3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0b3BQb3MgPj0gNDQwICYmIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpIDwgMTA0MCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5jb250YWN0U2VjdGlvbi5jc3Moe1xyXG5cdFx0XHRcdCd6LWluZGV4JzogLTFcclxuXHRcdFx0fSk7XHJcblx0XHRcdHNlbGYuY29uZmlnLmZvb3RlclNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0xXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2VsZi5jb25maWcuY29udGFjdFNlY3Rpb24uY3NzKHtcclxuXHRcdFx0XHQnei1pbmRleCc6IC0yXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5mb290ZXJTZWN0aW9uLmNzcyh7XHJcblx0XHRcdFx0J3otaW5kZXgnOiAtMlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHRvcFBvcyA+PSA0NDAgJiYgc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDQwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgNDQwIC0gKHRvcFBvcyAvIDIwMCkgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLmNvbmZpZy5tYWluSGVhZGluZ0Rpdi5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDIwNyAtICh0b3BQb3MgLyA1KVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuaGVhZGVyQ3RhLmNzcyh7XHJcblx0XHRcdCdvcGFjaXR5JzogMSAtICggdG9wUG9zIC8gMzAwICksXHJcblx0XHRcdCdtYXJnaW4tdG9wJzogMTUgLSAodG9wUG9zIC8gMTMpXHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5pbml0U2xpZGVyID0gZnVuY3Rpb24oIHNsaWRlcldyYXBwZXIgKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5zbGlkZXIgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ3VsLnNsaWRlcicpO1xyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnNsaWRlci1uYXYnKS5maW5kKCdkaXYuZ2FsbGVyeScpO1xyXG5cdHNlbGYuc2xpZGVyQmFjayA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LmJhY2stYnV0dG9uJyk7XHJcblx0c2VsZi5zdmdDb3ZlckxheWVyID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuc3ZnLWNvdmVyJyk7XHJcblx0dmFyIHBhdGhJZCA9IHNlbGYuc3ZnQ292ZXJMYXllci5maW5kKCdwYXRoJykuYXR0cignaWQnKTtcclxuXHRzZWxmLnN2Z1BhdGggPSBuZXcgU25hcCgnIycgKyBwYXRoSWQpO1xyXG5cclxuXHRzZWxmLnBhdGhBcnJheVswXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzFdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA2Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbMl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDInKTtcclxuXHRzZWxmLnBhdGhBcnJheVszXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzRdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAzJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDgnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs2XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNCcpO1xyXG5cdHNlbGYucGF0aEFycmF5WzddID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA5Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDUnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs5XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMTAnKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuam9iU3dpcGUgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdCQoJyNpY29uLXdyYXBwZXInKS5zd2lwZSh7XHJcblx0XHRzd2lwZUxlZnQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0Ly8gc2VsZi5jb25maWcuam9iRGVzY3JpcHRpb24uZXEoMClcclxuXHRcdFx0Y29uc29sZS5sb2coJ3N3aXBlZCBsZWZ0Jyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN3aXBlUmlnaHQ6IGZ1bmN0aW9uKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3N3aXBlZCByaWdodCcpO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0YXA6IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3RhcHBlZCcpO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0cmVzaG9sZDogMFxyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLm5hdkRvdCA9IGZ1bmN0aW9uKCkge1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbGlja2VkRG90SW5kZXggPSAkKHRoaXMpLmluZGV4KCksXHJcblx0XHRcdHRvcEltZ0RvdCA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5maWx0ZXIoJy50b3AtaW1hZ2UnKS5pbmRleCgpLFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpLFxyXG5cdFx0XHRhbGxDbGFzc2VzID0gJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCBib3VuY2VPdXRSaWdodCBnby1mb3J3YXJkIGdvLWJhY2snO1xyXG5cclxuXHRcdGlmICggY2xpY2tlZERvdEluZGV4ID4gdG9wSW1nRG90ICkge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcyhhbGxDbGFzc2VzKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRkZXNjLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHR9LCAzMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoYWxsQ2xhc3Nlcyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0ZGVzYy5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2snKTtcclxuXHRcdFx0fSwgMzAwKTtcclxuXHRcdH1cclxuXHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlJyk7XHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygnYm91bmNlSW4nKTtcclxuXHRcdH0sIDEwMDApO1xyXG5cdH0pOyBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5waWN0dXJlU2xpZGVyID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcclxuXHRzZWxmLmNvbmZpZy5pbWdCYWNrLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcEltZyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykubGVuZ3RoLFxyXG5cdFx0XHRkZXNjID0gJCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpO1xyXG5cclxuXHRcdGlmICggdG9wSW1nSW5kZXggPiAwICkge1xyXG5cdFx0XHR2YXIgcHJldkltZyA9IHRvcEltZ0luZGV4IC0gMTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKHByZXZJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKHByZXZJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrIGJvdW5jZU91dFJpZ2h0JykuZXEocHJldkltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWJhY2snKS5hZGRDbGFzcygnYm91bmNlT3V0UmlnaHQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1iYWNrJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShhbGxJbWdzIC0gMSkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5pbWdGb3J3YXJkLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcEltZyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maWx0ZXIoJy52aXNpYmxlLWltYWdlJyksXHJcblx0XHRcdHRvcEltZ0luZGV4ID0gdG9wSW1nLmluZGV4KCksXHJcblx0XHRcdGFsbEltZ3MgPSAkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykubGVuZ3RoXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0aWYgKCB0b3BJbWdJbmRleCA8IGFsbEltZ3MgLSAxICkge1xyXG5cdFx0XHR2YXIgbmV4dEltZyA9IHRvcEltZ0luZGV4ICsgMTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcShuZXh0SW1nKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCcpLmVxKG5leHRJbWcpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dG9wSW1nLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoMCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEoMCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGJvdW5jZU91dExlZnQnKS5lcSgwKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucmV0cmlldmVWaXNpYmxlU2xpZGUgPSBmdW5jdGlvbiggc2xpZGVyICkge1xyXG5cdHJldHVybiB0aGlzLnNsaWRlci5maW5kKCdsaS52aXNpYmxlJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuc2lkZU1lbnVIaWRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0aWYgKCBzZWxmLmNvbmZpZy53aW5kb3dPYmoud2lkdGgoKSA+IDEwNDAgKSB7XHJcblx0XHRzZWxmLmNvbmZpZy53aW5kb3dPYmoub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcG9zaXRpb24gPSBzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKCk7XHJcblx0XHRcdGlmICggcG9zaXRpb24gPD0gNDQwIHx8IHBvc2l0aW9uID09PSAwICkge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTkwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE2MCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMjApO1xyXG5cdFx0fSlcclxuXHRcdC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5zaWRlTWVudVNjcm9sbC5jc3MoJ3JpZ2h0JywgLTE2MCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUudXBkYXRlU2xpZGUgPSBmdW5jdGlvbiggb2xkU2xpZGUsIG5ld1NsaWRlLCBkaXJlY3Rpb24sIHN2Z0NvdmVyTGF5ZXIsIHBhdGhzLCBzdmdQYXRoICkge1xyXG5cdHZhciBwYXRoMSA9IDAsXHJcblx0XHRwYXRoMiA9IDAsXHJcblx0XHRwYXRoMyA9IDAsXHJcblx0XHRwYXRoNCA9IDAsXHJcblx0XHRwYXRoNSA9IDA7XHJcblxyXG5cdGlmICggZGlyZWN0aW9uID09PSAnZ2FsbGVyeScpIHtcclxuXHRcdHBhdGgxID0gcGF0aHNbMF07XHJcblx0XHRwYXRoMiA9IHBhdGhzWzJdO1xyXG5cdFx0cGF0aDMgPSBwYXRoc1s0XTtcclxuXHRcdHBhdGg0ID0gcGF0aHNbNl07XHJcblx0XHRwYXRoNSA9IHBhdGhzWzhdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRwYXRoMSA9IHBhdGhzWzFdO1xyXG5cdFx0cGF0aDIgPSBwYXRoc1szXTtcclxuXHRcdHBhdGgzID0gcGF0aHNbNV07XHJcblx0XHRwYXRoNCA9IHBhdGhzWzddO1xyXG5cdFx0cGF0aDUgPSBwYXRoc1s5XTtcclxuXHR9XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c3ZnQ292ZXJMYXllci5hZGRDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcblx0c3ZnUGF0aC5hdHRyKCdkJywgcGF0aDEpO1xyXG5cdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoMn0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLmZpcnN0QW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoM30sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLnNlY29uZEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG9sZFNsaWRlLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdG5ld1NsaWRlLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdGlmICggc2VsZi5jb25maWcubWFpblNsaWRlLmhhc0NsYXNzKCd2aXNpYmxlJykgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcChzZWxmLnBvc2l0aW9uQmVmb3JlR2FsbGVyeSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoNH0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLmZpcnN0QW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHN2Z1BhdGguYW5pbWF0ZSh7J2QnOiBwYXRoNX0sIHNlbGYuY29uZmlnLmR1cmF0aW9uLCB0aGlzLnNlY29uZEFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHN2Z0NvdmVyTGF5ZXIucmVtb3ZlQ2xhc3MoJ2lzLWFuaW1hdGluZycpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sIHNlbGYuY29uZmlnLmRlbGF5KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIE1ha2V1cCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgaW5pdFNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2luaXRTbGlkZXInKTtcclxudmFyIHJldHJpZXZlVmlzaWJsZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvcmV0cmlldmVWaXNpYmxlU2xpZGUnKTtcclxudmFyIGhlYWRlclBhcmFsbGF4ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaGVhZGVyUGFyYWxsYXgnKTtcclxudmFyIHVwZGF0ZVNsaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvdXBkYXRlU2xpZGUnKTtcclxudmFyIGV2ZW50V2F0Y2ggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9ldmVudFdhdGNoJyk7XHJcbnZhciBnYWxsZXJ5UGljdHVyZUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9nYWxsZXJ5UGljdHVyZUFuaW0nKTtcclxudmFyIHBpY3R1cmVTbGlkZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9waWN0dXJlU2xpZGVyJyk7XHJcbnZhciBicmFuZHNSYW5kb21BbmltID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbScpO1xyXG52YXIgYnJhbmRzTG9nb0JveCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2JyYW5kc0xvZ29Cb3gnKTtcclxudmFyIHNpZGVNZW51SGlkZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3NpZGVNZW51SGlkZScpO1xyXG52YXIgc2xvd0FuY2hvciA9IHJlcXVpcmUoJy4vdG9vbHMvc2xvd0FuY2hvcicpO1xyXG52YXIgYmV6aWVyID0gcmVxdWlyZSgnLi90b29scy9iZXppZXInKTtcclxudmFyIHNjcm9sbFNwZWVkID0gcmVxdWlyZSgnLi90b29scy9zY3JvbGxTcGVlZCcpO1xyXG52YXIgdG1wbENvbmZpZyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3RtcGxDb25maWcnKTtcclxudmFyIHJlbmRlckdhbGxlcnkgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5Jyk7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdGVtcGxhdGVzJyk7XHJcbnZhciBuYXZEb3QgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9uYXZEb3QnKTtcclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9oZWxwZXJzJyk7XHJcbnZhciBqb2JTd2lwZSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2pvYlN3aXBlJyk7XHJcblxyXG52YXIgbWFrZXVwID0gbmV3IE1ha2V1cCgpOyIsIm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZGVzY3JpcHRpb25IZWxwZXInLCBmdW5jdGlvbihhcmcpIHtcclxuXHR2YXIgb3BlblRhZyA9IFwiPHA+XCIsXHJcblx0XHRjbG9zZVRhZyA9IFwiPC9wPlxcclxcblwiO1xyXG5cdGlmIChhcmcpIHtcclxuXHRcdHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKFxyXG5cdFx0b3BlblRhZ1xyXG5cdFx0KyBhcmcuZm4odGhpcylcclxuXHRcdCsgY2xvc2VUYWcpO1xyXG5cdH1cclxufSk7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvdGVtcGxhdGVzJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnJlbmRlckdhbGxlcnkgPSBmdW5jdGlvbiggYXJnICkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRzZWxmLnNlbGVjdGVkUGljdHVyZXMgPSBbXTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnBpY3R1cmVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZiAoIE51bWJlcihzZWxmLnBpY3R1cmVzW2ldLmlkKSA9PT0gYXJnICkge1xyXG5cdFx0XHRzZWxmLnNlbGVjdGVkUGljdHVyZXMucHVzaChzZWxmLnBpY3R1cmVzW2ldKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciByZW5kZXJlZFBpY3MgPSBnYWxsZXJ5LmdhbGxlcnkoe3BpY3M6IHNlbGYuc2VsZWN0ZWRQaWN0dXJlc30pO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXInKS5odG1sKHJlbmRlcmVkUGljcyk7XHJcblxyXG5cdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5maXJzdCgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlJyk7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLmZpcnN0KCkuYWRkQ2xhc3MoJ3RvcC1pbWFnZScpO1xyXG5cdCQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKS5maXJzdCgpLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uJyk7XHJcblx0XHJcblx0c2VsZi5uYXZEb3QoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsIm1vZHVsZS5leHBvcnRzW1wiZ2FsbGVyeVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyLCBhbGlhczE9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczI9XCJmdW5jdGlvblwiLCBhbGlhczM9dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIlx0XHRcdDxsaT48aW1nIHNyYz1cXFwiYXNzZXRzL2ltYWdlcy9cIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZmlsZVBhdGggfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpbGVQYXRoIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmaWxlUGF0aFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGFsdD1cXFwiXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmlkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiaWRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj48L2xpPlxcclxcblwiO1xufSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgcmV0dXJuIFwiXHRcdDxzcGFuPjwvc3Bhbj5cXHJcXG5cIjtcbn0sXCI1XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgYWxpYXMxPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMyPVwiZnVuY3Rpb25cIiwgYWxpYXMzPWhlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nLCBidWZmZXIgPSBcbiAgXCJcdDxkaXYgY2xhc3M9XFxcInBpY3R1cmUtZGVzY3JpcHRpb25cXFwiPlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNiwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDgsIGRhdGEsIDApLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCxvcHRpb25zKSA6IGhlbHBlcikpO1xuICBpZiAoIWhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIpIHsgc3RhY2sxID0gYWxpYXMzLmNhbGwoZGVwdGgwLHN0YWNrMSxvcHRpb25zKX1cbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXHJcXG5cdDwvZGl2PlxcclxcblwiO1xufSxcIjZcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZmlyc3RMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5maXJzdExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImZpcnN0TGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCI4XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIHRoaXMuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnNlY29uZExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlY29uZExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInNlY29uZExpbmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSk7XG59LFwiMTBcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGhpcmRMaW5lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aGlyZExpbmUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInRoaXJkTGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiBcIjx1bCBjbGFzcz1cXFwiZ2FsbGVyeS1pbWFnZXNcXFwiPlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvdWw+XFxyXFxuPGRpdiBjbGFzcz1cXFwibmF2LWRvdHNcXFwiPlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMywgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIjwvZGl2PlxcclxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAucGljcyA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcbmZ1bmN0aW9uIFBpY3R1cmUoaWQsIGZpbGVQYXRoLCBmaXJzdExpbmUsIHNlY29uZExpbmUsIHRoaXJkTGluZSwgYmdEYXJrKSB7XHJcblx0dGhpcy5pZCA9IGlkO1xyXG5cdHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcclxuXHR0aGlzLmZpcnN0TGluZSA9IGZpcnN0TGluZTtcclxuXHR0aGlzLnNlY29uZExpbmUgPSBzZWNvbmRMaW5lO1xyXG5cdHRoaXMudGhpcmRMaW5lID0gdGhpcmRMaW5lO1xyXG5cdHRoaXMuYmdEYXJrID0gYmdEYXJrO1xyXG59XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVzID0gW1xyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzEuanBnJywgJ1RyZXN6a2FpIEFuZXR0JywgJycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMi5qcGcnLCAnU3phYsOzIENzaWxsYScsICdDc2lsbGFna8OpcCcsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMy5qcGcnLCAnTGFjYSBTb8OzcycsICdQaG90b2dyYXBoeScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nNC5qcGcnLCAnR8OhYm9yIEdpYmLDsyBLaXNzJywgJ0dpYmLDs0FydCBQaG90b2dyYXB5JywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmc1LmpwZycsICdCZXJ0w7NrIFZpZGVvICYgUGhvdG8nLCAnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QxLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTdW5ibG9vbScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0Mi5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnTWV5ZXIgRXN6dGVyLVZpcsOhZycsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzQnLCAnY29udGVzdC9jb250ZXN0My5qcGcnLCAnUHJva29wIEthdGEgU21pbmtpc2tvbGEnLCAnc21pbmt2ZXJzZW55ZScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMS5qcGcnLCAnQsOhbnlhaSBCw6FsaW50JywgJ0Nzb3Jqw6FuIEtyaXN6dGEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjIuanBnJywgJ0ZvdMOzIEJhenNhIEtpcy1Ib3J2w6F0aCcsICdIw6FyaSBIYWpuYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMy5qcGcnLCAnS2F1bml0eiBUYW3DoXMnLCAnVMOzdGggQWxleGFuZHJhJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb240LmpwZycsICdOeWVycyBBdHRpbGEnLCAnU3R5YXN6bmkgRG9yaW5hJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb241LmpwZycsICdOeWVycyBBdHRpbGEnLCAnU3R5YXN6bmkgRG9yaW5hJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb242LmpwZycsICdOeWVycyBBdHRpbGEnLCAnVGF1YmVyIEtpbmdhJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb243LmpwZycsICdOeWVycyBBdHRpbGEnLCAnVGF1YmVyIEtpbmdhJywgJ1NpaXJhIGtvbGxla2Npw7MnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb244LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsycsICdNw6F0w6lmeSBTemFib2xjcycsICdTenR5ZWhsaWsgSWxkaWvDsycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb245LmpwZycsICdaZW1zZSBTQVVSSUEga29sbGVrY2nDsycsICdNw6F0w6lmeSBTemFib2xjcycsICdWZW5jZWwgS3Jpc3p0aW5hJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkxLmpwZycsICdEZWJyZWN6aSBKw6Fub3MnLCAnRGVicmVjemkgSsOhbm9zIEZvdG9ncsOhZmlhJywgJ1PDoW5kb3IgTm/DqW1pJywgdHJ1ZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTIuanBnJywgJ0dhYnJpZWxsYSBCYXJhbnlpJywgJ01vZGVsbCBWaWt0b3JpYSBTYWxldHJvcycsICcnLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5My5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3VuYmxvb20nLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk0LmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdNZXllciBFc3p0ZXItVmlyw6FnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5NS5qcGcnLCAnTcOhdMOpZnkgU3phYm9sY3MnLCAnU3rFsWNzIEtyaXN6dGluYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTYuanBnJywgJ1N6YWJvIE1pa2xvcycsICdTY2hlbGxlbmJlcmdlciBac3V6c2FubmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk3LmpwZycsICdTemlzemlrIETDoW5pZWwnLCAnRsO8Z2VkaSBEw7NyYSBUw61tZWEnLCAnJywgZmFsc2UpXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5iZXppZXIgPSBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGVwc2lsb24gKSB7XHJcblxyXG5cdHZhciBjdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHgxICsgMyAqIHYgKiB0ICogdCAqIHgyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBjdXJ2ZVkgPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqIHYgKiB2ICogdCAqIHkxICsgMyAqIHYgKiB0ICogdCAqIHkyICsgdCAqIHQgKiB0O1xyXG5cdH07XHJcblxyXG5cdHZhciBkZXJpdmF0aXZlQ3VydmVYID0gZnVuY3Rpb24odCl7XHJcblx0XHR2YXIgdiA9IDEgLSB0O1xyXG5cdFx0cmV0dXJuIDMgKiAoMiAqICh0IC0gMSkgKiB0ICsgdiAqIHYpICogeDEgKyAzICogKC0gdCAqIHQgKiB0ICsgMiAqIHYgKiB0KSAqIHgyO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbih0KXtcclxuXHJcblx0XHR2YXIgeCA9IHQsIHQwLCB0MSwgdDIsIHgyLCBkMiwgaTtcclxuXHJcblx0XHQvLyBGaXJzdCB0cnkgYSBmZXcgaXRlcmF0aW9ucyBvZiBOZXd0b24ncyBtZXRob2QgLS0gbm9ybWFsbHkgdmVyeSBmYXN0LlxyXG5cdFx0Zm9yICh0MiA9IHgsIGkgPSAwOyBpIDwgODsgaSsrKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpIC0geDtcclxuXHRcdFx0aWYgKE1hdGguYWJzKHgyKSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRkMiA9IGRlcml2YXRpdmVDdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoZDIpIDwgMWUtNikgYnJlYWs7XHJcblx0XHRcdHQyID0gdDIgLSB4MiAvIGQyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHQwID0gMDsgdDEgPSAxOyB0MiA9IHg7XHJcblxyXG5cdFx0aWYgKHQyIDwgdDApIHJldHVybiBjdXJ2ZVkodDApO1xyXG5cdFx0aWYgKHQyID4gdDEpIHJldHVybiBjdXJ2ZVkodDEpO1xyXG5cclxuXHRcdC8vIEZhbGxiYWNrIHRvIHRoZSBiaXNlY3Rpb24gbWV0aG9kIGZvciByZWxpYWJpbGl0eS5cclxuXHRcdHdoaWxlICh0MCA8IHQxKXtcclxuXHRcdFx0eDIgPSBjdXJ2ZVgodDIpO1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIgLSB4KSA8IGVwc2lsb24pIHJldHVybiBjdXJ2ZVkodDIpO1xyXG5cdFx0XHRpZiAoeCA+IHgyKSB0MCA9IHQyO1xyXG5cdFx0XHRlbHNlIHQxID0gdDI7XHJcblx0XHRcdHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmFpbHVyZVxyXG5cdFx0cmV0dXJuIGN1cnZlWSh0Mik7XHJcblxyXG5cdH07XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9ucy9NYWtldXAnKTtcclxuXHJcblx0bWFrZXVwLnByb3RvdHlwZS5zY3JvbGxTcGVlZCA9IGZ1bmN0aW9uKHN0ZXAsIHNwZWVkLCBlYXNpbmcpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgJGRvY3VtZW50ID0gJChkb2N1bWVudCksXHJcbiAgICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXHJcbiAgICAgICAgICAgICRib2R5ID0gJCgnaHRtbCwgYm9keScpLFxyXG4gICAgICAgICAgICBvcHRpb24gPSBlYXNpbmcgfHwgJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICByb290ID0gMCxcclxuICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbFksXHJcbiAgICAgICAgICAgIHNjcm9sbFgsXHJcbiAgICAgICAgICAgIHZpZXc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgJHdpbmRvdy5vbignbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBkZWx0YVkgPSBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YVksXHJcbiAgICAgICAgICAgICAgICBkZXRhaWwgPSBlLm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWSA9ICRkb2N1bWVudC5oZWlnaHQoKSA+ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxYID0gJGRvY3VtZW50LndpZHRoKCkgPiAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZIDwgMCB8fCBkZXRhaWwgPiAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gKHJvb3QgKyB2aWV3KSA+PSAkZG9jdW1lbnQuaGVpZ2h0KCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHJvb3RcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgc3BlZWQsIG9wdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFgpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldyA9ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC53aWR0aCgpID8gcm9vdCA6IHJvb3QgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA+IDAgfHwgZGV0YWlsIDwgMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJvb3QgPD0gMCA/IDAgOiByb290IC09IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRib2R5LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSByb290ID0gJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxZICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LmhlaWdodCgpO1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCAmJiAhc2Nyb2xsKSB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAkLmVhc2luZy5kZWZhdWx0ID0gZnVuY3Rpb24gKHgsdCxiLGMsZCkge1xyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zbG93QW5jaG9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHRoaXMuY29uZmlnLmFsbEFuY2hvci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgPT09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpICYmIGxvY2F0aW9uLmhvc3RuYW1lID09PSB0aGlzLmhvc3RuYW1lKSB7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMuaGFzaCk7XHJcblx0XHRcdHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcclxuXHRcdFx0aWYgKCB0YXJnZXQubGVuZ3RoICkge1xyXG5cdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcFxyXG5cdFx0XHRcdH0sIDEwMDApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7Il19
