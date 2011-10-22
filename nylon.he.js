(function( nylon ) {
	var exports = {};
	exports.Module = function() {

		//変数準備
		var self = this;
		var mycount = 0;
		var allcount = 0;
		var my = null;
		var all = null;

		self.addController = function( _form ) {
			var hebutton = _form["he"];
			hebutton.addEventListener( 'click', function(){
				mycount = mycount + 1;
				allcount = allcount + 1;
				document.getElementById("mycount").innerHTML = mycount + "へぇ";
				document.getElementById("allcount").innerHTML = allcount + "へぇ";
				self.emit( "he|server" );
			}, true );
		}
		self.onreceive = function( flag ) {
			var self2 = self;
			var func1 = function( tag, param ) {
				console.log("receiving he");
				allcount = param.count;
				document.getElementById("allcount").innerHTML = param.count + "へぇ" ;
			};
			if( flag == true )      self2.on( "allhe", func1 );
			else    self2.removeListener( "allhe", func1 );
		}
		self.confirm = function() {
			self.emit( 'hereq|server' );
		}
	};
	
	exports.create = function () {
		exports.Module.prototype = new nylon();
		return new exports.Module();
	};
	nylon.he = exports;
})(nylon);
