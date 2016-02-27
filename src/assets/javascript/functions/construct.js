var makeup = require('./Makeup');

var Makeup = new makeup();

Makeup.prototype = {
	construct: function(text) {
		console.log(text);
	}
}

module.exports = Makeup.construct();