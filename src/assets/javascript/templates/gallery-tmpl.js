var makeup = require('../functions/Makeup');

makeup.prototype.renderGallery = function( /* pass in the gallery-count id */ ) {

// create var with the pictures of the selected gallery

	var template = $('#gallery-tmpl').html(),
		compiled = Handlebars.compile(template),
		rendered = compiled();

	$('#gallery-rendered').html(rendered);
};

module.exports = makeup;