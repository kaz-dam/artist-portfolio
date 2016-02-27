(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = 

	function Makeup() {
		var self = this;

		self.slider = 'heeey';
		self.sliderNavigation = {};
		self.sliderBack = {};
		self.svgCoverLayer = {};
		self.svgPath = {};
		self.firstAnimation = {};
		self.secondAnimation = {};
		self.pathArray = [];
		self.selectedGallery = {};
		self.positionBeforeGallery = {};

		/*self.config = {
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
		};*/
	}
},{}],2:[function(require,module,exports){
//var makeup = require('./Makeup');


/*Makeup.prototype.construct = function(text) {
		console.log(text);
}*/

module.exports = function construct(text) {
	console.log(text);
	headerParallax();
}
},{}],3:[function(require,module,exports){
module.exports = function headerParallax() {

	console.log('from header');
	//headerParallax = function() {
			/*var self = this;

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
			});*/
	//}
};
},{}],4:[function(require,module,exports){
var Makeup = require('./functions/Makeup');
var construct = require('./functions/construct');
var headerParallax = require('./functions/headerParallax');


//var makeup = new Makeup();

Makeup.prototype = {
	construct: construct,
	headerParallax: headerParallax
}

construct(Makeup.slider);

console.log(makeup);
},{"./functions/Makeup":1,"./functions/construct":2,"./functions/headerParallax":3}]},{},[4]);
