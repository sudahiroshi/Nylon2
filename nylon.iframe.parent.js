(function( nylon ) {
	var exports = {};
	exports.Module = function( _element, _target ) {
		// publics
		var self = this;
		var child = _element.contentWindow;
		var target = _target;

		window.addEventListener( 'message', function( event ) {
			var mes = JSON.parse( event.data );
			if( mes.keyword == "on" ) {
				self.on( mes.message, function( keywords, param ) {
					var data = JSON.stringify( { keyword: keywords, message: param } );
					child.postMessage( data, target );
				} );
			}
			else self.emit( mes.keyword, mes.message );
		});
		
		// 暫定的に設置するメソッドかも
		self.postMessage = function( keywords, param ) {
			var data = JSON.stringify( { keyword: keywords, message: param } );
			child.postMessage( data, target );
		};
	}

	exports.create = function( _element, _target ) {
		exports.Module.prototype = new nylon();
		var dummy = new exports.Module( _element, _target );
		var data = JSON.stringify( { keyword: "init" } );
		_element.contentWindow.postMessage( data, _target );
		return dummy;
	};
	nylon.iframe_parent = exports;
})( nylon );
