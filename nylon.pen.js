(function( nylon ) {
	var exports = {};
	exports.Module = function() {

		//変数準備
		var self = this;
		var can;
		var ctx;
		var mouse_condition = false;
		var data = new Array();

		self.setCanvas = function( _canvas ) {
			can = _canvas;
			ctx = can.getContext('2d');
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.beginPath();
			ctx.arc( 10,10,5,0,Math.PI*2,false);
			ctx.fill();
		}

		self.addController = function() {
			var mousedown = function() {
				mouse_condition = true;
				data.length = 0;
			};
			var mousemove = function(e) {
				if( mouse_condition ) {
					var rect = e.target.getBoundingClientRect();
					var x = e.clientX - rect.left;
					var y = e.clientY - rect.top;
					ctx.beginPath();
					ctx.arc( x, y, 2, 0, Math.PI*2, false );
					ctx.fill();
					data.push( [x, y] );
				};
			};
			var touchmove = function(e) {
				if( mouse_condition ) {
					var rect = e.target.getBoundingClientRect();
					var x = e.touches[0].pageX - rect.left;
					var y = e.touches[0].pageY - rect.top;
					ctx.beginPath();
					ctx.arc( x, y, 2, 0, Math.PI*2, false );
					ctx.fill();
					data.push( [x, y] );
				};
				e.preventDefault();
			};
			var mouseup = function() {
				mouse_condition = false;
				//console.log( ">>> " + JSON.stringify( data ));
				self.emit( "pen_draw|broadcast", {
					name: "pen",
					data: JSON.stringify( data )
				});
				data.length = 0;
			};
			can.addEventListener( 'mousedown', mousedown, true );
			can.addEventListener( 'touchstart', mousedown, true );
			can.addEventListener( 'mousemove', mousemove, true );
			can.addEventListener( 'touchmove', touchmove, true );
			can.addEventListener( 'mouseup', mouseup, true );
			can.addEventListener( 'touchend', mouseup, true );
		}

		self.onreceive = function( flag ) {
			var func1 = function( tag, param ) {
//console.log(param);
				var data = JSON.parse( param.data );
				for( var i=0; i<data.length; i++ ) {
					ctx.beginPath();
					ctx.arc( data[i][0], data[i][1], 2, 0, Math.PI*2, false );
					ctx.fill();
				};
			};
			var func2 = function( tag, param ) {
				ctx.clearRect( 0, 0, canvas.width, canvas.height );
			};

			if( flag == true ) {
				self.on( "pen_draw", func1 );
				self.on( "pen_clear", func2 );
			} else {
				self.removeListener( "pen_draw", func1 );
				self.removeListener( "pen_clear", func2 );
			}
		};
		self.confirm = function() {
			self.emit( "pen_req|server" );
		};
	};
	exports.create = function( _canvas ) {
		exports.Module.prototype = new nylon();
		var c1 = new exports.Module();
		c1.setCanvas( _canvas );
		return c1;
	};
	nylon.pen = exports;
})( nylon );
