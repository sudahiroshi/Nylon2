(function( nylon ) {
	var exports = {};
	exports.Module = function() {
		var self = this;
	};
	exports.create = function( _canvas ) {
		exports.Module.prototype = new nylon();
		return new exports.Module();
	};
	nylon.slides = exports;
})( nylon );
