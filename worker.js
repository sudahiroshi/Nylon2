//nylonのWebWorkersのworker側モジュール読み込み
importScripts( "nylon.webworkers.client.js" );
// メッセージの受信
on( "worker", function( num ) {
	var result = 0;
	for( var i=0; i <= num; i++ )	result += i;
	// 答えの送信
	emit( "result", result );
});
// 準備ができたことを通知
emit( "worker_set" );
// メイン側nylonに，キーワード「on」が届いたら，こちらに送ってもらうように依頼
emit( "on", { keyword: "worker" } );