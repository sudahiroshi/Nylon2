(function( nylon ) {
	var exports = {};
	exports.Module = function() {
		// publics
		var self = this;
		var socket = io.connect();
	
		self.onmessage = function( flag ) {
			var s = socket;
			var func1 = function( msg ) {
				var keys = msg.keyword.split("|");
				var index = keys.indexOf("broadcast");
				if (index != -1) keys.splice(index,1);
				var key = keys.join("|");
				self.emit( key, msg.message );
				//console.log(msg);
			};
			if( flag == true )	socket.on( 'message', func1 );
			else	socket.removeListener( 'message', func1 );
		}
	
		self.onreceive = function( flag ) {
			var func1 = function( keywords, param ) {
				socket.json.send( { keyword: keywords, message: param } );
			};
			if( flag == true)	self.on( "broadcast", func1 );
			else	self.removeListener( "broadcast", func1 );
			if( flag == true)	self.on( "server", func1 );
			else	self.removeListener( "server", func1 );
		}

		self.onconnect = function( callback ) {
			socket.on( 'connect', function() {
				callback();
			}, true);
		};
	}
	exports.create = function() {
		exports.Module.prototype = new nylon();
		var coe = new exports.Module();
		coe.onreceive( true );
		coe.onmessage( true );
		return coe;
	};
	nylon.coe = exports;
})( nylon );
