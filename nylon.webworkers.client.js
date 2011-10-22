var map = {};
var emit = function( keywords, param ) {
	var data = JSON.stringify( { keyword: keywords, message: param } );
	postMessage( data );
};
var on = function( keyword, callback ) {
	var events = map[ keyword ] || [];
	events.push( callback );
	map[ keyword ] = events;
};

addEventListener( 'message', function( event ) {
	var mes = JSON.parse( event.data );
	var args = [];
	args.push( mes.message );

	var events = map[ mes.keyword ] || [];
	for( var i=0, len=events.length; i< len; i++ ) ( function( fx ) {
		setTimeout( function() { fx.apply( null, args ) }, 0 );
	})( events[i] );
});
