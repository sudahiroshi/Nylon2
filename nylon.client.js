(function(window, undefined) {

    function EventEmitter() {};

	EventEmitter.map = {};
	
	var eventToString = function(event) {
		event = event.type || event;
		return event.toString();
    };

    EventEmitter.prototype.addEventListener = function( event, listener ) {
        var events = EventEmitter.map[event] || [];
	events.push( [ listener, this ] );
        EventEmitter.map[event] = events;
    };
    
    EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;

    EventEmitter.prototype.removeEventListener = function( event, listener ) {
        if (!this._events) this._events = {};

        var eventName = eventToString(event);
        var listeners = this._events[eventName] || [];

        for (var i = (listeners.length - 1); i >= 0; i--) {
            if (listeners[i] == listener) {
                listeners.splice(i, 1);
            };
        };

        this._events[eventName] = listeners;
    };

    EventEmitter.prototype.emit = function( event ) {
		var obj = this;
        var args = [];
		for (var n=0, p=arguments.length; n<p; n++) {
			args.push(arguments[n]);
		}
		var keywords = event.split("|");
		for (var j=0, len_j = keywords.length; j<len_j; j++ ) {
			var events = EventEmitter.map[ keywords[ j ] ] || [];
			for (var i=0, len=events.length; i<len; i++) ( function( fx ) {
				if( !( events[ i ][ 1 ] == obj ) )	setTimeout( function() { fx.apply( null, args ) }, 0 );
			})( events[ i ][ 0 ] );
		}
    };

    EventEmitter.prototype.extends = function( obj ) {
        for ( var func in EventEmitter.prototype ) {
            obj[ func ] = EventEmitter.prototype[ func ];
        };

        return obj;
    };
    
    EventEmitter.prototype.create = function() {
    	return new EventEmitter();
    }

    window.nylon = EventEmitter;
    window.nylon.client = new nylon();
})(window);
