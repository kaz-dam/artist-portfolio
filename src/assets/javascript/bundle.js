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
},{"./Makeup":1}],9:[function(require,module,exports){
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
var helpers = require('./templates/helpers');

var makeup = new Makeup();
},{"./functions/Makeup":1,"./functions/brandsLogoBox":2,"./functions/brandsRandomAnim":3,"./functions/eventWatch":4,"./functions/galleryPictureAnim":5,"./functions/headerParallax":6,"./functions/initSlider":7,"./functions/navDot":8,"./functions/pictureSlider":9,"./functions/retrieveVisibleSlide":10,"./functions/sideMenuHide":11,"./functions/updateSlide":12,"./templates/helpers":14,"./templates/renderGallery":15,"./templates/templates":16,"./templates/tmplConfig":17,"./tools/bezier":18,"./tools/scrollSpeed":19,"./tools/slowAnchor":20}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{"../functions/Makeup":1,"../templates/templates":16}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{"../functions/Makeup":1}],18:[function(require,module,exports){
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
},{"../functions/Makeup":1}],19:[function(require,module,exports){
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
},{"../functions/Makeup":1}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvZnVuY3Rpb25zL01ha2V1cC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvYnJhbmRzUmFuZG9tQW5pbS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZXZlbnRXYXRjaC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvZ2FsbGVyeVBpY3R1cmVBbmltLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheC5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvaW5pdFNsaWRlci5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvbmF2RG90LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9waWN0dXJlU2xpZGVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy9yZXRyaWV2ZVZpc2libGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9mdW5jdGlvbnMvc2lkZU1lbnVIaWRlLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L2Z1bmN0aW9ucy91cGRhdGVTbGlkZS5qcyIsInNyYy9hc3NldHMvamF2YXNjcmlwdC9tYWluLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9oZWxwZXJzLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy9yZW5kZXJHYWxsZXJ5LmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdGVtcGxhdGVzL3RtcGxDb25maWcuanMiLCJzcmMvYXNzZXRzL2phdmFzY3JpcHQvdG9vbHMvYmV6aWVyLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Njcm9sbFNwZWVkLmpzIiwic3JjL2Fzc2V0cy9qYXZhc2NyaXB0L3Rvb2xzL3Nsb3dBbmNob3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBcclxuXHJcblx0ZnVuY3Rpb24gTWFrZXVwKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHNlbGYuc2xpZGVyID0ge307XHJcblx0XHRzZWxmLnNsaWRlck5hdmlnYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2xpZGVyQmFjayA9IHt9O1xyXG5cdFx0c2VsZi5zdmdDb3ZlckxheWVyID0ge307XHJcblx0XHRzZWxmLnN2Z1BhdGggPSB7fTtcclxuXHRcdHNlbGYuZmlyc3RBbmltYXRpb24gPSB7fTtcclxuXHRcdHNlbGYuc2Vjb25kQW5pbWF0aW9uID0ge307XHJcblx0XHRzZWxmLnBhdGhBcnJheSA9IFtdO1xyXG5cdFx0c2VsZi5zZWxlY3RlZEdhbGxlcnkgPSB7fTtcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0ge307XHJcblx0XHRzZWxmLnNlbGVjdGVkUGljdHVyZXMgPSBbXTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZyA9IHtcclxuXHRcdFx0d2luZG93T2JqOiAkKHdpbmRvdyksXHJcblx0XHRcdGRvY3VtZW50T2JqOiAkKGRvY3VtZW50KSxcclxuXHRcdFx0bWVudTogJCgndWwubWVudSBsaSBhJyksXHJcblx0XHRcdHNpZGVNZW51U2Nyb2xsOiAkKCdkaXYuc2Nyb2xsLW1lbnUnKSxcclxuXHRcdFx0c2xpZGVyV3JhcHBlcjogJCgnZGl2LnNsaWRlci13cmFwcGVyJyksXHJcblx0XHRcdG1haW5TbGlkZTogJCgndWwuc2xpZGVyIGxpOmZpcnN0LWNoaWxkJyksXHJcblx0XHRcdGR1cmF0aW9uOiAzMDAsXHJcblx0XHRcdGRlbGF5OiAzMDAsXHJcblx0XHRcdGFsbEFuY2hvcjogJCgnYVtocmVmKj1cXFxcI106bm90KFtocmVmPVxcXFwjXSknKSxcclxuXHRcdFx0dG9wTWVudTogJCgndWwubWVudScpLFxyXG5cdFx0XHRtZW51RGl2OiAkKCdzZWN0aW9uLmhlYWRlciBkaXYubWVudScpLFxyXG5cdFx0XHRtYWluSGVhZGluZ0RpdjogJCgnZGl2LmhlYWRpbmcnKSxcclxuXHRcdFx0bWFpbkhlYWRpbmc6ICQoJ2Rpdi5oZWFkaW5nIGgxJyksXHJcblx0XHRcdG1haW5IZWFkaW5nUGFyOiAkKCdkaXYuaGVhZGluZyBwJyksXHJcblx0XHRcdGhlYWRlckN0YTogJCgnZGl2LmN0YS1oZWFkZXInKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb25BcnJvdzogJCgnZGl2Lmljb24td3JhcHBlciBzdmcuYXJyb3cnKSxcclxuXHRcdFx0am9iRGVzY3JpcHRpb246ICQoJ3VsLmRlc2NyaXB0aW9uIGxpJyksXHJcblx0XHRcdGdhbGxlcnlJbWFnZXNTbWFsbDogJCgnZGl2LnNsaWRlci1uYXYgZGl2LmltYWdlcycpLFxyXG5cdFx0XHRicmFuZFNwYW5zOiAkKCdzZWN0aW9uLmFib3V0IHAgc3Bhbi5icmFuZHMnKSxcclxuXHRcdFx0YnJhbmRQb3B1cDogJCgnc2VjdGlvbi5hYm91dCBwIHNwYW4ucG9wdXAnKSxcclxuXHRcdFx0Ly8gZ2FsbGVyeUltZzogJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0Ly8gbmF2RG90czogJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLFx0bm90IGRlZmluZWRcclxuXHRcdFx0aW1nQmFjazogJCgnbGkuZ2FsbGVyeSBkaXYuYmFja3dhcmQnKSxcclxuXHRcdFx0aW1nRm9yd2FyZDogJCgnbGkuZ2FsbGVyeSBkaXYuZm9yd2FyZCcpLFxyXG5cdFx0XHRhYm91dFNlY3Rpb246ICQoJ3NlY3Rpb24uYWJvdXQnKSxcclxuXHRcdFx0Y29udGFjdFNlY3Rpb246ICQoJ3NlY3Rpb24uY29udGFjdCcpLFxyXG5cdFx0XHRmb290ZXJTZWN0aW9uOiAkKCdzZWN0aW9uLmZvb3RlcicpXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBlcHNpbG9uID0gKDEwMDAgLyA2MCAvIHNlbGYuY29uZmlnLmR1cmF0aW9uKSAvIDQ7XHJcblx0XHRzZWxmLmZpcnN0QW5pbWF0aW9uID0gc2VsZi5iZXppZXIoMC40MiwwLDAuNTgsMSwgZXBzaWxvbik7XHJcblx0XHRzZWxmLnNlY29uZEFuaW1hdGlvbiA9IHNlbGYuYmV6aWVyKDAuNDIsMCwxLDEsIGVwc2lsb24pO1xyXG5cdFx0c2VsZi5jb25maWcuc2xpZGVyV3JhcHBlci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5pbml0U2xpZGVyKCAkKHRoaXMpICk7XHJcblx0XHR9KTtcclxuXHRcdHNlbGYuZXZlbnRXYXRjaCgpO1xyXG5cdFx0c2VsZi5nYWxsZXJ5UGljdHVyZUFuaW0oKTtcclxuXHRcdHNlbGYuYnJhbmRzUmFuZG9tQW5pbSgpO1xyXG5cdFx0c2VsZi5icmFuZHNMb2dvQm94KCk7XHJcblx0XHRzZWxmLnNjcm9sbFNwZWVkKCAxMDAsIDUwMCApO1xyXG5cclxuXHR9OyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5icmFuZHNMb2dvQm94ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBtb3VzZVggPSAwLFxyXG5cdFx0bW91c2VZID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy5kb2N1bWVudE9iai5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRtb3VzZVggPSBlLnBhZ2VYO1xyXG5cdFx0bW91c2VZID0gZS5wYWdlWTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmNzcyh7XHJcblx0XHRcdFx0J3RvcCc6IG1vdXNlWSArIDE1LFxyXG5cdFx0XHRcdCdsZWZ0JzogbW91c2VYICsgNVxyXG5cdFx0XHR9KS5zaG93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJyYW5kc1JhbmRvbUFuaW0gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNik7XHJcblx0XHRzZWxmLmNvbmZpZy5icmFuZFNwYW5zLmVxKHJhbmRvbU51bSkuYWRkQ2xhc3MoJ2JyYW5kLWFuaW0nKVxyXG5cdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYnJhbmQtYW5pbScpO1xyXG5cdH0sIDMwMDApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmV2ZW50V2F0Y2ggPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdHNlbGYuc2VsZWN0ZWRHYWxsZXJ5ID0gJCh0aGlzKTtcclxuXHRcdHZhciBzZWxlY3RlZFNsaWRlUG9zaXRpb24gPSBzZWxmLnNlbGVjdGVkR2FsbGVyeS5kYXRhKCdnYWxsZXJ5LWNvdW50JyksXHJcblx0XHRcdHNlbGVjdGVkU2xpZGUgPSBzZWxmLnNsaWRlci5jaGlsZHJlbignbGknKS5lcSgxKSxcclxuXHRcdFx0dmlzaWJsZVNsaWRlID0gc2VsZi5yZXRyaWV2ZVZpc2libGVTbGlkZShzZWxmLnNsaWRlciksXHJcblx0XHRcdHZpc2libGVTbGlkZVBvc2l0aW9uID0gdmlzaWJsZVNsaWRlLmluZGV4KCksXHJcblx0XHRcdGRpcmVjdGlvbiA9ICdnYWxsZXJ5JztcclxuXHRcdHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5ID0gc2VsZi5jb25maWcud2luZG93T2JqLnNjcm9sbFRvcCgpO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHJcblx0XHRzZWxmLnJlbmRlckdhbGxlcnkoIHNlbGVjdGVkU2xpZGVQb3NpdGlvbiApO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNsaWRlckJhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhclx0c2VsZWN0ZWRTbGlkZSA9IHNlbGYuc2xpZGVyLmNoaWxkcmVuKCdsaScpLmVxKDApLFxyXG5cdFx0XHR2aXNpYmxlU2xpZGUgPSBzZWxmLnJldHJpZXZlVmlzaWJsZVNsaWRlKHNlbGYuc2xpZGVyKSxcclxuXHRcdFx0ZGlyZWN0aW9uID0gJ2hvbWUnO1xyXG5cdFx0c2VsZi51cGRhdGVTbGlkZSh2aXNpYmxlU2xpZGUsIHNlbGVjdGVkU2xpZGUsIGRpcmVjdGlvbiwgc2VsZi5zdmdDb3ZlckxheWVyLCBzZWxmLnBhdGhBcnJheSwgc2VsZi5zdmdQYXRoKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zaWRlTWVudUhpZGUoKTtcclxuXHJcblx0c2VsZi5zbGlkZXJOYXZpZ2F0aW9uLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcclxuXHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRvcGFjaXR5OiAnMScsXHJcblx0XHRcdGxldHRlclNwYWNpbmc6ICc0cHgnXHJcblx0XHR9LCA0MDApO1xyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnNsaWRlck5hdmlnYXRpb24ub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBob3ZlcmVkR2FsbGVyeSA9ICQodGhpcyksXHJcblx0XHRcdGdhbGxlcnlOYW1lID0gaG92ZXJlZEdhbGxlcnkuZmluZCgnaDInKTtcclxuXHRcdGdhbGxlcnlOYW1lLmFuaW1hdGUoe1xyXG5cdFx0XHRvcGFjaXR5OiAnMCcsXHJcblx0XHRcdGxldHRlclNwYWNpbmc6ICcxNXB4J1xyXG5cdFx0fSwgNDAwKTtcclxuXHR9KTtcclxuXHJcblx0c2VsZi5zbG93QW5jaG9yKCk7XHJcblxyXG5cdHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdHZhciBjbGlja2VkRWxlbSA9ICQodGhpcyksXHJcblx0XHRcdFx0Y2xpY2tlZEVsZW1JbmRleCA9IHNlbGYuY29uZmlnLmpvYkRlc2NyaXB0aW9uQXJyb3cuaW5kZXgoY2xpY2tlZEVsZW0pLFxyXG5cdFx0XHRcdGVsZW1Ub1Nob3cgPSBzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5lcShjbGlja2VkRWxlbUluZGV4KTtcclxuXHJcblx0XHRcdGlmICggIWVsZW1Ub1Nob3cuaGFzQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJykgKSB7XHJcblx0XHRcdFx0ZWxlbVRvU2hvdy5hZGRDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy5qb2JEZXNjcmlwdGlvbi5ub3QoZWxlbVRvU2hvdykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWRlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZWxlbVRvU2hvdy5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtZGVzY3JpcHRpb24nKTtcclxuXHRcdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzZWxmLnBpY3R1cmVTbGlkZXIoKTtcclxuXHJcblx0c2VsZi5oZWFkZXJQYXJhbGxheCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmdhbGxlcnlQaWN0dXJlQW5pbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjb3VudGVyID0gMCxcclxuXHRcdHNlbGYgPSB0aGlzLFxyXG5cdFx0YmdXZWRkaW5nID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy93ZWRkaW5nL3dlZGRpbmcxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL3dlZGRpbmcvd2VkZGluZzItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvd2VkZGluZy93ZWRkaW5nMy1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdGYXNoaW9uID0gW1xyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9mYXNoaW9uL2Zhc2hpb24xLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2Zhc2hpb24vZmFzaGlvbjItc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvZmFzaGlvbi9mYXNoaW9uMy1zbWFsbC5qcGcnXHJcblx0XHRdLFxyXG5cdFx0YmdCZWF1dHkgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkxLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkyLXNtYWxsLmpwZycsXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2JlYXV0eS9iZWF1dHkzLXNtYWxsLmpwZydcclxuXHRcdF0sXHJcblx0XHRiZ0NvbnRlc3QgPSBbXHJcblx0XHRcdCdhc3NldHMvaW1hZ2VzL2NvbnRlc3QvY29udGVzdDEtc21hbGwuanBnJyxcclxuXHRcdFx0J2Fzc2V0cy9pbWFnZXMvY29udGVzdC9jb250ZXN0Mi1zbWFsbC5qcGcnLFxyXG5cdFx0XHQnYXNzZXRzL2ltYWdlcy9jb250ZXN0L2NvbnRlc3QzLXNtYWxsLmpwZydcclxuXHRcdF07XHJcblxyXG5cdFx0c2VsZi5jb25maWcuZ2FsbGVyeUltYWdlc1NtYWxsLmZpcnN0KCkuY3NzKHtcclxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnRmFzaGlvbltjb3VudGVyXSArICcpJ1xyXG5cdFx0fSkubmV4dCgpLmNzcyh7XHJcblx0XHRcdGJhY2tncm91bmRJbWFnZTogJ3VybCgnICsgYmdCZWF1dHlbY291bnRlcl0gKyAnKSdcclxuXHRcdH0pLm5leHQoKS5jc3Moe1xyXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0fSk7XHJcblx0XHQrK2NvdW50ZXI7XHJcblxyXG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggY291bnRlciA+IDIgKSB7XHJcblx0XHRcdFx0Y291bnRlciA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuY29uZmlnLmdhbGxlcnlJbWFnZXNTbWFsbC5maXJzdCgpLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ1dlZGRpbmdbY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0Zhc2hpb25bY291bnRlcl0gKyAnKSdcclxuXHRcdFx0fSkubmV4dCgpLmRlbGF5KDI1MDApLmNzcyh7XHJcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiAndXJsKCcgKyBiZ0JlYXV0eVtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHR9KS5uZXh0KCkuZGVsYXkoMjUwMCkuY3NzKHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGJnQ29udGVzdFtjb3VudGVyXSArICcpJ1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Kytjb3VudGVyO1xyXG5cdFx0fSwgMjUwMCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUuaGVhZGVyUGFyYWxsYXggPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzZWxmLmNvbmZpZy53aW5kb3dPYmoub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRvcFBvcyA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRcclxuXHRcdGlmICggc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDAwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgdG9wUG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHRvcFBvcyA+PSA0NDAgJiYgc2VsZi5jb25maWcud2luZG93T2JqLndpZHRoKCkgPiAxMDAwICkge1xyXG5cdFx0XHRzZWxmLmNvbmZpZy5tZW51RGl2LmNzcygndG9wJywgNDQwIC0gKHRvcFBvcyAvIDIwMCkgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLmNvbmZpZy5tYWluSGVhZGluZ0Rpdi5jc3Moe1xyXG5cdFx0XHQnb3BhY2l0eSc6IDEgLSAoIHRvcFBvcyAvIDMwMCApLFxyXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDIwNyAtICh0b3BQb3MgLyA1KVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuaGVhZGVyQ3RhLmNzcyh7XHJcblx0XHRcdCdvcGFjaXR5JzogMSAtICggdG9wUG9zIC8gMzAwICksXHJcblx0XHRcdCdtYXJnaW4tdG9wJzogMTUgLSAodG9wUG9zIC8gMTMpXHJcblx0XHR9KTtcclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5pbml0U2xpZGVyID0gZnVuY3Rpb24oIHNsaWRlcldyYXBwZXIgKSB7XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0c2VsZi5zbGlkZXIgPSBzbGlkZXJXcmFwcGVyLmZpbmQoJ3VsLnNsaWRlcicpO1xyXG5cdHNlbGYuc2xpZGVyTmF2aWdhdGlvbiA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LnNsaWRlci1uYXYnKS5maW5kKCdkaXYuZ2FsbGVyeScpO1xyXG5cdHNlbGYuc2xpZGVyQmFjayA9IHNsaWRlcldyYXBwZXIuZmluZCgnZGl2LmJhY2stYnV0dG9uJyk7XHJcblx0c2VsZi5zdmdDb3ZlckxheWVyID0gc2xpZGVyV3JhcHBlci5maW5kKCdkaXYuc3ZnLWNvdmVyJyk7XHJcblx0dmFyIHBhdGhJZCA9IHNlbGYuc3ZnQ292ZXJMYXllci5maW5kKCdwYXRoJykuYXR0cignaWQnKTtcclxuXHRzZWxmLnN2Z1BhdGggPSBuZXcgU25hcCgnIycgKyBwYXRoSWQpO1xyXG5cclxuXHRzZWxmLnBhdGhBcnJheVswXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMScpO1xyXG5cdHNlbGYucGF0aEFycmF5WzFdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA2Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbMl0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDInKTtcclxuXHRzZWxmLnBhdGhBcnJheVszXSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNycpO1xyXG5cdHNlbGYucGF0aEFycmF5WzRdID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXAzJyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbNV0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDgnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs2XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwNCcpO1xyXG5cdHNlbGYucGF0aEFycmF5WzddID0gc2VsZi5zdmdDb3ZlckxheWVyLmRhdGEoJ3N0ZXA5Jyk7XHJcblx0c2VsZi5wYXRoQXJyYXlbOF0gPSBzZWxmLnN2Z0NvdmVyTGF5ZXIuZGF0YSgnc3RlcDUnKTtcclxuXHRzZWxmLnBhdGhBcnJheVs5XSA9IHNlbGYuc3ZnQ292ZXJMYXllci5kYXRhKCdzdGVwMTAnKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi9NYWtldXAnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUubmF2RG90ID0gZnVuY3Rpb24oKSB7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsaWNrZWREb3RJbmRleCA9ICQodGhpcykuaW5kZXgoKSxcclxuXHRcdFx0dG9wSW1nRG90ID0gJCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLmZpbHRlcignLnRvcC1pbWFnZScpLmluZGV4KCksXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyksXHJcblx0XHRcdGFsbENsYXNzZXMgPSAnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0IGJvdW5jZU91dFJpZ2h0IGdvLWZvcndhcmQgZ28tYmFjayc7XHJcblxyXG5cdFx0aWYgKCBjbGlja2VkRG90SW5kZXggPiB0b3BJbWdEb3QgKSB7XHJcblx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKGFsbENsYXNzZXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGRlc2MuZXEoY2xpY2tlZERvdEluZGV4KS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1mb3J3YXJkJyk7XHJcblx0XHRcdH0sIDMwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcShjbGlja2VkRG90SW5kZXgpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0ZGVzYy5yZW1vdmVDbGFzcyhhbGxDbGFzc2VzKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRkZXNjLmVxKGNsaWNrZWREb3RJbmRleCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjaycpO1xyXG5cdFx0XHR9LCAzMDApO1xyXG5cdFx0fVxyXG5cdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UnKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCdib3VuY2VJbicpO1xyXG5cdFx0fSwgMTAwMCk7XHJcblx0fSk7IFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwidmFyIG1ha2V1cCA9IHJlcXVpcmUoJy4vTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnBpY3R1cmVTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFxyXG5cdHNlbGYuY29uZmlnLmltZ0JhY2sub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGgsXHJcblx0XHRcdGRlc2MgPSAkKCcjdG1wbC13cmFwcGVyIGRpdi5waWN0dXJlLWRlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0aWYgKCB0b3BJbWdJbmRleCA+IDAgKSB7XHJcblx0XHRcdHZhciBwcmV2SW1nID0gdG9wSW1nSW5kZXggLSAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEocHJldkltZykuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UgZ28tYmFjaycpO1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgZGl2Lm5hdi1kb3RzIHNwYW4nKS5yZW1vdmVDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJykuZXEocHJldkltZykuYWRkQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWJhY2sgYm91bmNlT3V0UmlnaHQnKS5lcShwcmV2SW1nKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tYmFjaycpLmFkZENsYXNzKCdib3VuY2VPdXRSaWdodCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1iYWNrJykuYWRkQ2xhc3MoJ2JvdW5jZU91dFJpZ2h0Jyk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLnJlbW92ZUNsYXNzKCkuZXEoYWxsSW1ncyAtIDEpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWJhY2snKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tYmFjayBib3VuY2VPdXRSaWdodCcpLmVxKGFsbEltZ3MgLSAxKS5hZGRDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBnby1iYWNrJyk7XHJcblx0XHRcdFx0fSwgMzAwKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuY29uZmlnLmltZ0ZvcndhcmQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdG9wSW1nID0gJCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpbHRlcignLnZpc2libGUtaW1hZ2UnKSxcclxuXHRcdFx0dG9wSW1nSW5kZXggPSB0b3BJbWcuaW5kZXgoKSxcclxuXHRcdFx0YWxsSW1ncyA9ICQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5sZW5ndGhcclxuXHRcdFx0ZGVzYyA9ICQoJyN0bXBsLXdyYXBwZXIgZGl2LnBpY3R1cmUtZGVzY3JpcHRpb24nKTtcclxuXHJcblx0XHRpZiAoIHRvcEltZ0luZGV4IDwgYWxsSW1ncyAtIDEgKSB7XHJcblx0XHRcdHZhciBuZXh0SW1nID0gdG9wSW1nSW5kZXggKyAxO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRvcEltZy5yZW1vdmVDbGFzcygnZ28tZm9yd2FyZCcpLmFkZENsYXNzKCdib3VuY2VPdXRMZWZ0Jyk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJyN0bXBsLXdyYXBwZXIgdWwuZ2FsbGVyeS1pbWFnZXMgbGknKS5yZW1vdmVDbGFzcygpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd2aXNpYmxlLWltYWdlIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykucmVtb3ZlQ2xhc3MoJ3RvcC1pbWFnZSBib3VuY2VJbicpLmVxKG5leHRJbWcpLmFkZENsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0ZGVzYy5yZW1vdmVDbGFzcygnY3VycmVudC1kZXNjcmlwdGlvbiBib3VuY2VPdXRMZWZ0JykuZXEobmV4dEltZykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gZ28tZm9yd2FyZCcpO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0b3BJbWcucmVtb3ZlQ2xhc3MoJ2dvLWZvcndhcmQnKS5hZGRDbGFzcygnYm91bmNlT3V0TGVmdCcpO1xyXG5cdFx0XHR9LCA0MDApO1xyXG5cdFx0XHRkZXNjLnJlbW92ZUNsYXNzKCdnby1mb3J3YXJkJykuYWRkQ2xhc3MoJ2JvdW5jZU91dExlZnQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcjdG1wbC13cmFwcGVyIHVsLmdhbGxlcnktaW1hZ2VzIGxpJykucmVtb3ZlQ2xhc3MoKS5lcSgwKS5hZGRDbGFzcygndmlzaWJsZS1pbWFnZSBnby1mb3J3YXJkJyk7XHJcblx0XHRcdFx0JCgnI3RtcGwtd3JhcHBlciBkaXYubmF2LWRvdHMgc3BhbicpLnJlbW92ZUNsYXNzKCd0b3AtaW1hZ2UgYm91bmNlSW4nKS5lcSgwKS5hZGRDbGFzcygndG9wLWltYWdlIGJvdW5jZUluJyk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGRlc2MucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24gYm91bmNlT3V0TGVmdCcpLmVxKDApLmFkZENsYXNzKCdjdXJyZW50LWRlc2NyaXB0aW9uIGdvLWZvcndhcmQnKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5yZXRyaWV2ZVZpc2libGVTbGlkZSA9IGZ1bmN0aW9uKCBzbGlkZXIgKSB7XHJcblx0cmV0dXJuIHRoaXMuc2xpZGVyLmZpbmQoJ2xpLnZpc2libGUnKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS5zaWRlTWVudUhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRpZiAoIHNlbGYuY29uZmlnLndpbmRvd09iai53aWR0aCgpID4gMTAwMCApIHtcclxuXHRcdHNlbGYuY29uZmlnLndpbmRvd09iai5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBwb3NpdGlvbiA9IHNlbGYuY29uZmlnLndpbmRvd09iai5zY3JvbGxUb3AoKTtcclxuXHRcdFx0aWYgKCBwb3NpdGlvbiA8PSA0NDAgfHwgcG9zaXRpb24gPT09IDAgKSB7XHJcblx0XHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0xOTApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi5jb25maWcuc2lkZU1lbnVTY3JvbGwuY3NzKCdyaWdodCcsIC0yMCk7XHJcblx0XHR9KVxyXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY29uZmlnLnNpZGVNZW51U2Nyb2xsLmNzcygncmlnaHQnLCAtMTYwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuL01ha2V1cCcpO1xyXG5cclxubWFrZXVwLnByb3RvdHlwZS51cGRhdGVTbGlkZSA9IGZ1bmN0aW9uKCBvbGRTbGlkZSwgbmV3U2xpZGUsIGRpcmVjdGlvbiwgc3ZnQ292ZXJMYXllciwgcGF0aHMsIHN2Z1BhdGggKSB7XHJcblx0dmFyIHBhdGgxID0gMCxcclxuXHRcdHBhdGgyID0gMCxcclxuXHRcdHBhdGgzID0gMCxcclxuXHRcdHBhdGg0ID0gMCxcclxuXHRcdHBhdGg1ID0gMDtcclxuXHJcblx0aWYgKCBkaXJlY3Rpb24gPT09ICdnYWxsZXJ5Jykge1xyXG5cdFx0cGF0aDEgPSBwYXRoc1swXTtcclxuXHRcdHBhdGgyID0gcGF0aHNbMl07XHJcblx0XHRwYXRoMyA9IHBhdGhzWzRdO1xyXG5cdFx0cGF0aDQgPSBwYXRoc1s2XTtcclxuXHRcdHBhdGg1ID0gcGF0aHNbOF07XHJcblx0fSBlbHNlIHtcclxuXHRcdHBhdGgxID0gcGF0aHNbMV07XHJcblx0XHRwYXRoMiA9IHBhdGhzWzNdO1xyXG5cdFx0cGF0aDMgPSBwYXRoc1s1XTtcclxuXHRcdHBhdGg0ID0gcGF0aHNbN107XHJcblx0XHRwYXRoNSA9IHBhdGhzWzldO1xyXG5cdH1cclxuXHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRzdmdDb3ZlckxheWVyLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuXHRzdmdQYXRoLmF0dHIoJ2QnLCBwYXRoMSk7XHJcblx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgyfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGgzfSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0b2xkU2xpZGUucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0bmV3U2xpZGUuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdFx0aWYgKCBzZWxmLmNvbmZpZy5tYWluU2xpZGUuaGFzQ2xhc3MoJ3Zpc2libGUnKSApIHtcclxuXHRcdFx0XHRzZWxmLmNvbmZpZy53aW5kb3dPYmouc2Nyb2xsVG9wKHNlbGYucG9zaXRpb25CZWZvcmVHYWxsZXJ5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg0fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuZmlyc3RBbmltYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c3ZnUGF0aC5hbmltYXRlKHsnZCc6IHBhdGg1fSwgc2VsZi5jb25maWcuZHVyYXRpb24sIHRoaXMuc2Vjb25kQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c3ZnQ292ZXJMYXllci5yZW1vdmVDbGFzcygnaXMtYW5pbWF0aW5nJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgc2VsZi5jb25maWcuZGVsYXkpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgTWFrZXVwID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcbnZhciBpbml0U2xpZGVyID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvaW5pdFNsaWRlcicpO1xyXG52YXIgcmV0cmlldmVWaXNpYmxlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9yZXRyaWV2ZVZpc2libGVTbGlkZScpO1xyXG52YXIgaGVhZGVyUGFyYWxsYXggPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9oZWFkZXJQYXJhbGxheCcpO1xyXG52YXIgdXBkYXRlU2xpZGUgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy91cGRhdGVTbGlkZScpO1xyXG52YXIgZXZlbnRXYXRjaCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2V2ZW50V2F0Y2gnKTtcclxudmFyIGdhbGxlcnlQaWN0dXJlQW5pbSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL2dhbGxlcnlQaWN0dXJlQW5pbScpO1xyXG52YXIgcGljdHVyZVNsaWRlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL3BpY3R1cmVTbGlkZXInKTtcclxudmFyIGJyYW5kc1JhbmRvbUFuaW0gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9icmFuZHNSYW5kb21BbmltJyk7XHJcbnZhciBicmFuZHNMb2dvQm94ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvYnJhbmRzTG9nb0JveCcpO1xyXG52YXIgc2lkZU1lbnVIaWRlID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvc2lkZU1lbnVIaWRlJyk7XHJcbnZhciBzbG93QW5jaG9yID0gcmVxdWlyZSgnLi90b29scy9zbG93QW5jaG9yJyk7XHJcbnZhciBiZXppZXIgPSByZXF1aXJlKCcuL3Rvb2xzL2JlemllcicpO1xyXG52YXIgc2Nyb2xsU3BlZWQgPSByZXF1aXJlKCcuL3Rvb2xzL3Njcm9sbFNwZWVkJyk7XHJcbnZhciB0bXBsQ29uZmlnID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdG1wbENvbmZpZycpO1xyXG52YXIgcmVuZGVyR2FsbGVyeSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3JlbmRlckdhbGxlcnknKTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxudmFyIG5hdkRvdCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL25hdkRvdCcpO1xyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2hlbHBlcnMnKTtcclxuXHJcbnZhciBtYWtldXAgPSBuZXcgTWFrZXVwKCk7IiwibW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdkZXNjcmlwdGlvbkhlbHBlcicsIGZ1bmN0aW9uKGFyZykge1xyXG5cdHZhciBvcGVuVGFnID0gXCI8cD5cIixcclxuXHRcdGNsb3NlVGFnID0gXCI8L3A+XFxyXFxuXCI7XHJcblx0aWYgKGFyZykge1xyXG5cdFx0cmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoXHJcblx0XHRvcGVuVGFnXHJcblx0XHQrIGFyZy5mbih0aGlzKVxyXG5cdFx0KyBjbG9zZVRhZyk7XHJcblx0fVxyXG59KTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG52YXIgZ2FsbGVyeSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy90ZW1wbGF0ZXMnKTtcclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucmVuZGVyR2FsbGVyeSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcyA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucGljdHVyZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmICggTnVtYmVyKHNlbGYucGljdHVyZXNbaV0uaWQpID09PSBhcmcgKSB7XHJcblx0XHRcdHNlbGYuc2VsZWN0ZWRQaWN0dXJlcy5wdXNoKHNlbGYucGljdHVyZXNbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHJlbmRlcmVkUGljcyA9IGdhbGxlcnkuZ2FsbGVyeSh7cGljczogc2VsZi5zZWxlY3RlZFBpY3R1cmVzfSk7XHJcblx0JCgnI3RtcGwtd3JhcHBlcicpLmh0bWwocmVuZGVyZWRQaWNzKTtcclxuXHJcblx0JCgnI3RtcGwtd3JhcHBlciB1bC5nYWxsZXJ5LWltYWdlcyBsaScpLmZpcnN0KCkuYWRkQ2xhc3MoJ3Zpc2libGUtaW1hZ2UnKTtcclxuXHQkKCcjdG1wbC13cmFwcGVyIGRpdi5uYXYtZG90cyBzcGFuJykuZmlyc3QoKS5hZGRDbGFzcygndG9wLWltYWdlJyk7XHJcblx0JCgnI3RtcGwtd3JhcHBlciBkaXYucGljdHVyZS1kZXNjcmlwdGlvbicpLmZpcnN0KCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZGVzY3JpcHRpb24nKTtcclxuXHRcclxuXHRzZWxmLm5hdkRvdCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWtldXA7IiwibW9kdWxlLmV4cG9ydHNbXCJnYWxsZXJ5XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXIsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiXHRcdFx0PGxpPjxpbWcgc3JjPVxcXCJhc3NldHMvaW1hZ2VzL1wiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maWxlUGF0aCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZmlsZVBhdGggOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcImZpbGVQYXRoXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgYWx0PVxcXCJcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuaWQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmlkIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJpZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPjwvbGk+XFxyXFxuXCI7XG59LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICByZXR1cm4gXCJcdFx0PHNwYW4+PC9zcGFuPlxcclxcblwiO1xufSxcIjVcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgaGVscGVyLCBvcHRpb25zLCBhbGlhczE9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczI9XCJmdW5jdGlvblwiLCBhbGlhczM9aGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcsIGJ1ZmZlciA9IFxuICBcIlx0PGRpdiBjbGFzcz1cXFwicGljdHVyZS1kZXNjcmlwdGlvblxcXCI+XFxyXFxuXHRcdFwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjcmlwdGlvbkhlbHBlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLChvcHRpb25zPXtcIm5hbWVcIjpcImRlc2NyaXB0aW9uSGVscGVyXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcclxcblx0XHRcIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzY3JpcHRpb25IZWxwZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwob3B0aW9ucz17XCJuYW1lXCI6XCJkZXNjcmlwdGlvbkhlbHBlclwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLG9wdGlvbnMpIDogaGVscGVyKSk7XG4gIGlmICghaGVscGVycy5kZXNjcmlwdGlvbkhlbHBlcikgeyBzdGFjazEgPSBhbGlhczMuY2FsbChkZXB0aDAsc3RhY2sxLG9wdGlvbnMpfVxuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXHJcXG5cdFx0XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb25IZWxwZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2NyaXB0aW9uSGVscGVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKG9wdGlvbnM9e1wibmFtZVwiOlwiZGVzY3JpcHRpb25IZWxwZXJcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEwLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAsb3B0aW9ucykgOiBoZWxwZXIpKTtcbiAgaWYgKCFoZWxwZXJzLmRlc2NyaXB0aW9uSGVscGVyKSB7IHN0YWNrMSA9IGFsaWFzMy5jYWxsKGRlcHRoMCxzdGFjazEsb3B0aW9ucyl9XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcclxcblx0PC9kaXY+XFxyXFxuXCI7XG59LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maXJzdExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpcnN0TGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlyc3RMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gdGhpcy5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2Vjb25kTGluZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2Vjb25kTGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwic2Vjb25kTGluZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKTtcbn0sXCIxMFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aGlyZExpbmUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRoaXJkTGluZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJzLmhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBcImZ1bmN0aW9uXCIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwidGhpcmRMaW5lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuIFwiPHVsIGNsYXNzPVxcXCJnYWxsZXJ5LWltYWdlc1xcXCI+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPC91bD5cXHJcXG48ZGl2IGNsYXNzPVxcXCJuYXYtZG90c1xcXCI+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgzLCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPC9kaXY+XFxyXFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5waWNzIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg1LCBkYXRhLCAwKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIik7XG59LFwidXNlRGF0YVwiOnRydWV9KTsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuZnVuY3Rpb24gUGljdHVyZShpZCwgZmlsZVBhdGgsIGZpcnN0TGluZSwgc2Vjb25kTGluZSwgdGhpcmRMaW5lLCBiZ0RhcmspIHtcclxuXHR0aGlzLmlkID0gaWQ7XHJcblx0dGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG5cdHRoaXMuZmlyc3RMaW5lID0gZmlyc3RMaW5lO1xyXG5cdHRoaXMuc2Vjb25kTGluZSA9IHNlY29uZExpbmU7XHJcblx0dGhpcy50aGlyZExpbmUgPSB0aGlyZExpbmU7XHJcblx0dGhpcy5iZ0RhcmsgPSBiZ0Rhcms7XHJcbn1cclxuXHJcbm1ha2V1cC5wcm90b3R5cGUucGljdHVyZXMgPSBbXHJcblx0bmV3IFBpY3R1cmUoJzEnLCAnd2VkZGluZy93ZWRkaW5nMS5qcGcnLCAnVHJlc3prYWkgQW5ldHQnLCAnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmcyLmpwZycsICdTemFiw7MgQ3NpbGxhJywgJ0NzaWxsYWdrw6lwJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmczLmpwZycsICdMYWNhIFNvw7NzJywgJ1Bob3RvZ3JhcGh5JywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMScsICd3ZWRkaW5nL3dlZGRpbmc0LmpwZycsICdHw6Fib3IgR2liYsOzIEtpc3MnLCAnR2liYsOzQXJ0IFBob3RvZ3JhcHknLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcxJywgJ3dlZGRpbmcvd2VkZGluZzUuanBnJywgJ0JlcnTDs2sgVmlkZW8gJiBQaG90bycsICcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCc0JywgJ2NvbnRlc3QvY29udGVzdDEuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N1bmJsb29tJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QyLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdNZXllciBFc3p0ZXItVmlyw6FnJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnNCcsICdjb250ZXN0L2NvbnRlc3QzLmpwZycsICdQcm9rb3AgS2F0YSBTbWlua2lza29sYScsICdzbWlua3ZlcnNlbnllJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24xLmpwZycsICdCw6FueWFpIELDoWxpbnQnLCAnQ3NvcmrDoW4gS3Jpc3p0YScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzInLCAnZmFzaGlvbi9mYXNoaW9uMi5qcGcnLCAnRm90w7MgQmF6c2EgS2lzLUhvcnbDoXRoJywgJ0jDoXJpIEhham5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMicsICdmYXNoaW9uL2Zhc2hpb24zLmpwZycsICdLYXVuaXR6IFRhbcOhcycsICdUw7N0aCBBbGV4YW5kcmEnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjQuanBnJywgJ055ZXJzIEF0dGlsYScsICdTdHlhc3puaSBEb3JpbmEnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjUuanBnJywgJ055ZXJzIEF0dGlsYScsICdTdHlhc3puaSBEb3JpbmEnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjYuanBnJywgJ055ZXJzIEF0dGlsYScsICdUYXViZXIgS2luZ2EnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjcuanBnJywgJ055ZXJzIEF0dGlsYScsICdUYXViZXIgS2luZ2EnLCAnU2lpcmEga29sbGVrY2nDsycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjguanBnJywgJ1plbXNlIFNBVVJJQSBrb2xsZWtjacOzJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1N6dHllaGxpayBJbGRpa8OzJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCcyJywgJ2Zhc2hpb24vZmFzaGlvbjkuanBnJywgJ1plbXNlIFNBVVJJQSBrb2xsZWtjacOzJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ1ZlbmNlbCBLcmlzenRpbmEnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTEuanBnJywgJ0RlYnJlY3ppIErDoW5vcycsICdEZWJyZWN6aSBKw6Fub3MgRm90b2dyw6FmaWEnLCAnU8OhbmRvciBOb8OpbWknLCB0cnVlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Mi5qcGcnLCAnR2FicmllbGxhIEJhcmFueWknLCAnTW9kZWxsIFZpa3RvcmlhIFNhbGV0cm9zJywgJycsIHRydWUpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHkzLmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTdW5ibG9vbScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTQuanBnJywgJ03DoXTDqWZ5IFN6YWJvbGNzJywgJ01leWVyIEVzenRlci1WaXLDoWcnLCAnJywgZmFsc2UpLFxyXG5cdG5ldyBQaWN0dXJlKCczJywgJ2JlYXV0eS9iZWF1dHk1LmpwZycsICdNw6F0w6lmeSBTemFib2xjcycsICdTesWxY3MgS3Jpc3p0aW5hJywgJycsIGZhbHNlKSxcclxuXHRuZXcgUGljdHVyZSgnMycsICdiZWF1dHkvYmVhdXR5Ni5qcGcnLCAnU3phYm8gTWlrbG9zJywgJ1NjaGVsbGVuYmVyZ2VyIFpzdXpzYW5uYScsICcnLCBmYWxzZSksXHJcblx0bmV3IFBpY3R1cmUoJzMnLCAnYmVhdXR5L2JlYXV0eTcuanBnJywgJ1N6aXN6aWsgRMOhbmllbCcsICdGw7xnZWRpIETDs3JhIFTDrW1lYScsICcnLCBmYWxzZSlcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLmJlemllciA9IGZ1bmN0aW9uKCB4MSwgeTEsIHgyLCB5MiwgZXBzaWxvbiApIHtcclxuXHJcblx0dmFyIGN1cnZlWCA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogdiAqIHYgKiB0ICogeDEgKyAzICogdiAqIHQgKiB0ICogeDIgKyB0ICogdCAqIHQ7XHJcblx0fTtcclxuXHJcblx0dmFyIGN1cnZlWSA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0dmFyIHYgPSAxIC0gdDtcclxuXHRcdHJldHVybiAzICogdiAqIHYgKiB0ICogeTEgKyAzICogdiAqIHQgKiB0ICogeTIgKyB0ICogdCAqIHQ7XHJcblx0fTtcclxuXHJcblx0dmFyIGRlcml2YXRpdmVDdXJ2ZVggPSBmdW5jdGlvbih0KXtcclxuXHRcdHZhciB2ID0gMSAtIHQ7XHJcblx0XHRyZXR1cm4gMyAqICgyICogKHQgLSAxKSAqIHQgKyB2ICogdikgKiB4MSArIDMgKiAoLSB0ICogdCAqIHQgKyAyICogdiAqIHQpICogeDI7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKHQpe1xyXG5cclxuXHRcdHZhciB4ID0gdCwgdDAsIHQxLCB0MiwgeDIsIGQyLCBpO1xyXG5cclxuXHRcdC8vIEZpcnN0IHRyeSBhIGZldyBpdGVyYXRpb25zIG9mIE5ld3RvbidzIG1ldGhvZCAtLSBub3JtYWxseSB2ZXJ5IGZhc3QuXHJcblx0XHRmb3IgKHQyID0geCwgaSA9IDA7IGkgPCA4OyBpKyspe1xyXG5cdFx0XHR4MiA9IGN1cnZlWCh0MikgLSB4O1xyXG5cdFx0XHRpZiAoTWF0aC5hYnMoeDIpIDwgZXBzaWxvbikgcmV0dXJuIGN1cnZlWSh0Mik7XHJcblx0XHRcdGQyID0gZGVyaXZhdGl2ZUN1cnZlWCh0Mik7XHJcblx0XHRcdGlmIChNYXRoLmFicyhkMikgPCAxZS02KSBicmVhaztcclxuXHRcdFx0dDIgPSB0MiAtIHgyIC8gZDI7XHJcblx0XHR9XHJcblxyXG5cdFx0dDAgPSAwOyB0MSA9IDE7IHQyID0geDtcclxuXHJcblx0XHRpZiAodDIgPCB0MCkgcmV0dXJuIGN1cnZlWSh0MCk7XHJcblx0XHRpZiAodDIgPiB0MSkgcmV0dXJuIGN1cnZlWSh0MSk7XHJcblxyXG5cdFx0Ly8gRmFsbGJhY2sgdG8gdGhlIGJpc2VjdGlvbiBtZXRob2QgZm9yIHJlbGlhYmlsaXR5LlxyXG5cdFx0d2hpbGUgKHQwIDwgdDEpe1xyXG5cdFx0XHR4MiA9IGN1cnZlWCh0Mik7XHJcblx0XHRcdGlmIChNYXRoLmFicyh4MiAtIHgpIDwgZXBzaWxvbikgcmV0dXJuIGN1cnZlWSh0Mik7XHJcblx0XHRcdGlmICh4ID4geDIpIHQwID0gdDI7XHJcblx0XHRcdGVsc2UgdDEgPSB0MjtcclxuXHRcdFx0dDIgPSAodDEgLSB0MCkgKiAwLjUgKyB0MDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGYWlsdXJlXHJcblx0XHRyZXR1cm4gY3VydmVZKHQyKTtcclxuXHJcblx0fTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiLCJ2YXIgbWFrZXVwID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL01ha2V1cCcpO1xyXG5cclxuXHRtYWtldXAucHJvdG90eXBlLnNjcm9sbFNwZWVkID0gZnVuY3Rpb24oc3RlcCwgc3BlZWQsIGVhc2luZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KSxcclxuICAgICAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcclxuICAgICAgICAgICAgJGJvZHkgPSAkKCdodG1sLCBib2R5JyksXHJcbiAgICAgICAgICAgIG9wdGlvbiA9IGVhc2luZyB8fCAnZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIHJvb3QgPSAwLFxyXG4gICAgICAgICAgICBzY3JvbGwgPSBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsWSxcclxuICAgICAgICAgICAgc2Nyb2xsWCxcclxuICAgICAgICAgICAgdmlldztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZClcclxuICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAkd2luZG93Lm9uKCdtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhWSxcclxuICAgICAgICAgICAgICAgIGRldGFpbCA9IGUub3JpZ2luYWxFdmVudC5kZXRhaWw7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxZID0gJGRvY3VtZW50LmhlaWdodCgpID4gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFggPSAkZG9jdW1lbnQud2lkdGgoKSA+ICR3aW5kb3cud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbCA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwIHx8IGRldGFpbCA+IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSAocm9vdCArIHZpZXcpID49ICRkb2N1bWVudC5oZWlnaHQoKSA/IHJvb3QgOiByb290ICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChkZWx0YVkgPiAwIHx8IGRldGFpbCA8IDApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByb290IDw9IDAgPyAwIDogcm9vdCAtPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkYm9keS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcm9vdFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LCBzcGVlZCwgb3B0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsWCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3ID0gJHdpbmRvdy53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGRlbHRhWSA8IDAgfHwgZGV0YWlsID4gMClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IChyb290ICsgdmlldykgPj0gJGRvY3VtZW50LndpZHRoKCkgPyByb290IDogcm9vdCArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFZID4gMCB8fCBkZXRhaWwgPCAwKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICByb290ID0gcm9vdCA8PSAwID8gMCA6IHJvb3QgLT0gc3RlcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJGJvZHkuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiByb290XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIHNwZWVkLCBvcHRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgcm9vdCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHJvb3QgPSAkd2luZG93LnNjcm9sbExlZnQoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFkgJiYgIXNjcm9sbCkgdmlldyA9ICR3aW5kb3cuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxYICYmICFzY3JvbGwpIHZpZXcgPSAkd2luZG93LndpZHRoKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQuZWFzaW5nLmRlZmF1bHQgPSBmdW5jdGlvbiAoeCx0LGIsYyxkKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgcmV0dXJuIC1jICogKCh0PXQvZC0xKSp0KnQqdCAtIDEpICsgYjtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZXVwOyIsInZhciBtYWtldXAgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvTWFrZXVwJyk7XHJcblxyXG5tYWtldXAucHJvdG90eXBlLnNsb3dBbmNob3IgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0dGhpcy5jb25maWcuYWxsQW5jaG9yLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCcnKSA9PT0gdGhpcy5wYXRobmFtZS5yZXBsYWNlKC9eXFwvLywnJykgJiYgbG9jYXRpb24uaG9zdG5hbWUgPT09IHRoaXMuaG9zdG5hbWUpIHtcclxuXHRcdFx0dmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyAnXScpO1xyXG5cdFx0XHRpZiAoIHRhcmdldC5sZW5ndGggKSB7XHJcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXHJcblx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2V1cDsiXX0=
