(function( nylon ) {
	var exports = {};
	exports.Module = function( _filename ) {
		// publics
		var self = this;
		var worker = new Worker( _filename );	

		worker.addEventListener( 'message', function( msg ) {
			var mes = JSON.parse( msg.data );
			if( mes.keyword == "on" ) {
				self.on( mes.message.keyword, function( keywords, param ) {
					var data = JSON.stringify( { keyword: keywords, message: param } );
					worker.postMessage( data );
				} );
			}
			else self.emit( mes.keyword, mes.message );
		});
		
		// 暫定的に設置するメソッドかも
		self.postMessage = function( keywords, param ) {
			var data = JSON.stringify( { keyword: keywords, message: param } );
			worker.postMessage( data );
		}
	}

	exports.create = function( filename ) {
		exports.Module.prototype = new nylon();
		return new exports.Module( filename );
	};
	nylon.webworkers = exports;
})( nylon );