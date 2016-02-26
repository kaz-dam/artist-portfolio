(function(){

	renderGallery();

	function renderGallery() {
		var template = $('#gallery-tmpl').html(),
			compiled = Handlebars.compile(template),
			rendered = compiled();

		$('#gallery-rendered').html(rendered);
	}

})();