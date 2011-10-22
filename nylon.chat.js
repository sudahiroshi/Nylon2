(function(nylon) {
	var exports = {};
	exports.Module = function() {
		var self = this;
//		var exports = {};
		var panel;
		var newMessage = function( tag, message ) {
			var p = document.createElement( "p" );
			p.innerHTML = message.name + " : " + message.text;
			panel.appendChild( p );
		};
		var clearMessage = function() {
			var e;
			while(e = panel.firstChild) {
				panel.removeChild(e);
			}
		};
		self.addControl = function( form, element ){
			var name = form["sendName"].value;
			var text = form["sendText"].value;
			var button = form["sendButton"];	
			var clear = form["clearButton"];
			panel = element;
			
			button.addEventListener('click', function() {
				var mes = { name: form["sendName"].value, text: form["sendText"].value };
				newMessage( "", mes );
				self.emit("chat_send|broadcast", mes );
			});
		
			clear.addEventListener( 'click', function() {
				self.emit( "chat_clear|broadcast" );
				clearMessage();
			});
		}
		self.setMessage = function( flag, element ) {
			if( flag == true )	self.on( "chat_send", newMessage );
			else	self.removeListener( "chat_send", newMessage );
			if( flag == true )	self.on( "chat_clear", clearMessage );
			else	self.removeListener( "chat_clear", clearMessage );
		}
				
	}
	exports.create = function() {
		exports.Module.prototype = new nylon();
		return new exports.Module();
	};
	nylon.chat = exports;
})( nylon );
