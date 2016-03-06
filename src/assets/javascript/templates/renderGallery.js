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