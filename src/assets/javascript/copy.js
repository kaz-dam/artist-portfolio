/*(function(){

	/*function Makeup() {
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
	}

	var Makeup1 = {

		slider: {},
		sliderNavigation: {},
		sliderBack: {},
		svgCoverLayer: {},
		svgPath: {},
		firstAnimation: {},
		secondAnimation: {},
		pathArray: [],
		selectedGallery: {},
		positionBeforeGallery: {},
	
		init: function( config ) {
			this.config = config;
			var self= this,
				epsilon = (1000 / 60 / this.config.duration) / 4;
				this.firstAnimation = this.bezier(0.42,0,0.58,1, epsilon);
				this.secondAnimation = this.bezier(0.42,0,1,1, epsilon);
			this.config.sliderWrapper.each( function() {
				self.initSlider( $(this) );
			});
			this.events();
			this.galleryPictureAnim();
			this.brandsRandomAnim();
			this.brandsLogoBox();
		},

		initSlider: function( sliderWrapper ) {
			this.slider = sliderWrapper.find('ul.slider');
			this.sliderNavigation = sliderWrapper.find('div.slider-nav').find('div.gallery');
			this.sliderBack = sliderWrapper.find('div.back-button');
			this.svgCoverLayer = sliderWrapper.find('div.svg-cover');
			var pathId = this.svgCoverLayer.find('path').attr('id');
			this.svgPath = new Snap('#' + pathId);

			this.pathArray[0] = this.svgCoverLayer.data('step1');
			this.pathArray[1] = this.svgCoverLayer.data('step6');
			this.pathArray[2] = this.svgCoverLayer.data('step2');
			this.pathArray[3] = this.svgCoverLayer.data('step7');
			this.pathArray[4] = this.svgCoverLayer.data('step3');
			this.pathArray[5] = this.svgCoverLayer.data('step8');
			this.pathArray[6] = this.svgCoverLayer.data('step4');
			this.pathArray[7] = this.svgCoverLayer.data('step9');
			this.pathArray[8] = this.svgCoverLayer.data('step5');
			this.pathArray[9] = this.svgCoverLayer.data('step10');
		},

		retrieveVisibleSlide: function(slider) {
			return this.slider.find('li.visible');
		},

		updateSlide: function(oldSlide, newSlide, direction, svgCoverLayer, paths, svgPath) {
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
		},

		events: function() {
			var self = this;

			self.sliderNavigation.on('click', function() {
				self.selectedGallery = $(this);
				var selectedSlidePosition = self.selectedGallery.data('gallery-count'), //use this as a reference for the database to find the right images
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
		},

		headerParallax: function() {
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
		},

		galleryPictureAnim: function() {
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
		},

		pictureSlider: function() {
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
		},

		brandsRandomAnim: function() {
			var self = this;
			setInterval(function() {
				var randomNum = Math.floor(Math.random() * 6);
				self.config.brandSpans.eq(randomNum).addClass('brand-anim')
					.siblings().removeClass('brand-anim');
			}, 3000);
		},

		brandsLogoBox: function() {
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
		},

		sideMenuHide: function() {
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
		},

		slowAnchor: function() {
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
		},

		bezier: function(x1, y1, x2, y2, epsilon) {
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
	};

	scrollSpeed( 100, 500 );

	var makeup = new Makeup();

	makeup.construct();

	Makeup1.init({
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
	});

})();