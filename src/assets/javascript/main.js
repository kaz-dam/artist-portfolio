var Makeup = require('./functions/Makeup');
var construct = require('./functions/construct');
var headerParallax = require('./functions/headerParallax');


var makeup = new Makeup();

makeup.prototype = {
	construct: construct,
	headerParallax: headerParallax
}

construct(makeup.slider);

console.log(makeup);