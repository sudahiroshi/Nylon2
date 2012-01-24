(function(window, undefined) {

    function EventEmitter() {};

    EventEmitter.map = {};
    EventEmitter.oring = null;
    EventEmitter.source = null;

    var eventToString = function(event) {
        event = event.type || event;
        return event.toString();
    };

    EventEmitter.prototype.addEventListener = function(event, listener) {
        var events = EventEmitter.map[event] || [];
        events.push([listener, this]);
        EventEmitter.map[event] = events;
        if( (EventEmitter.source != null) && (EventEmitter.origin != null) )	EventEmitter.source.postMessage( JSON.stringify({ keyword: "on", message: event }), EventEmitter.origin ); 
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;

    EventEmitter.prototype.removeEventListener = function(event, listener) {
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

    EventEmitter.prototype.emit = function(event) {
        if( EventEmitter.source != null && EventEmitter.origin != null )	EventEmitter.source.postMessage( JSON.stringify( {keyword: event, message: arguments[1]} ), EventEmitter.origin ); 
        var obj = this;
        var args = [];
        for (var n = 0, p = arguments.length; n < p; n++) {
            args.push(arguments[n]);
        }
        var keywords = event.split("|");
        for (var j = 0, len_j = keywords.length; j < len_j; j++) {
            var events = EventEmitter.map[keywords[j]] || [];
            for (var i = 0, len = events.length; i < len; i++)(function(fx) {
                if (!(events[i][1] == obj)) setTimeout(function() {
                    fx.apply(null, args)
                }, 0);
            })(events[i][0]);
        }
    };

    EventEmitter.prototype.extends = function(obj) {
        for (var func in EventEmitter.prototype) {
            obj[func] = EventEmitter.prototype[func];
        };

        return obj;
    };

    EventEmitter.prototype.create = function() {
        return new EventEmitter();
    }

    window.nylon = EventEmitter;
    window.nylon.client = new nylon();
})(window);

(function( nylon ) {
//	var exports = {};
	function exports() {};
	exports.prototype = new nylon();
	
	exports.callback = null;

	exports.prototype.onconnect = function( _callback ) {
		exports.callback = _callback;
		var a = 0;
	}
	window.addEventListener('message', function( event ) {
		var mes = JSON.parse( event.data );
		if( mes.keyword == "init" && !nylon.origin) {
			nylon.origin = event.origin;
			nylon.source = event.source;
			if( exports.callback != null )	exports.callback();
		} else {
			var obj = this;
			var args = [];
			for (var n = 0, p = arguments.length; n < p; n++) {
				args.push(arguments[n]);
			}
			var keywords = mes.keyword.split("|");
			for (var j = 0, len_j = keywords.length; j < len_j; j++) {
				var events = nylon.map[keywords[j]] || [];
				for (var i = 0, len = events.length; i < len; i++)(function(fx) {
					if (!(events[i][1] == obj)) setTimeout(function() {
						fx.apply(null, [mes.keyword, mes.message]);
					}, 0);
				})(events[i][0]);
			}
		}
	}, false);

	exports.create = function( _element, _target ) {
//		exports.Module.prototype = new nylon();
		return new exports();
	};
	nylon.iframe_child = exports;
})( nylon );
