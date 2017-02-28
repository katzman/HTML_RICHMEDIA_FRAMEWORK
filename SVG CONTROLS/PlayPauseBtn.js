/**
 * Created by nkatz on 6/27/16.
 */

function PlayPauseBtn()
{
	// Grab player id from object id in html file.
	var id = window.frameElement.id.split('_')[0];
	var btn = document.querySelector('#play_pause_btn');
	var pause = document.querySelector('#pause_btn');

	var pauseShape_1 = document.querySelector('#pause_1');
	var pauseShape_2 = document.querySelector('#pause_2');

	var playShape_1 = document.querySelector('#play_1');
	var playShape_2 = document.querySelector('#play_2');

	//var play = document.querySelector('#play_btn');

	btn.style.cursor = 'hand';

	top.TweenLite.set( pause, { display:'none' });

	btn.addEventListener( 'click', updateVideo );
	top.NotificationManager.regisiterNotificationInterest( top.Constants.VIDEO_CONTROLS_READY, 'controlsReady', this );
	top.NotificationManager.regisiterNotificationInterests( [top.Constants.VIDEO_COMPLETE, top.Constants.VIDEO_PAUSED, top.Constants.VIDEO_PLAYING], 'updateControls', this );

	
	// PRIVATE
	function updateVideo( e )
	{
		top.NotificationManager.sendNotification( top.Constants.PLAY_PAUSE_VIDEO, id );
	}


	// PUBLIC
	this.controlsReady = function( _data )
	{
		console.log( "CONTROLS READY" );
		// not sure what i need to do here yet.
	};

	// called when video status changes.
	this.updateControls = function( _data )
	{
		// console.log( "UPDATE CONTROLS CALLED :: " + _data.data.playerID + "   " + id );
		if( _data.data.playerID != id ) return;

		switch( _data.interest )
		{
			case top.Constants.VIDEO_COMPLETE:
			case top.Constants.VIDEO_PAUSED:
				this.showPaused();
				break;

			case top.Constants.VIDEO_PLAYING:
				this.showPlaying();
				break;
		}
	};

	this.showPlaying = function()
	{
		console.log( "SHOW PLAYING" );
		top.TweenLite.to( playShape_1, .3, {morphSVG:{shape:pauseShape_1, shapeIndex:0}});
		top.TweenLite.to( playShape_2, .3, {morphSVG:{shape:pauseShape_2, shapeIndex:0}});
	};

	this.showPaused = function()
	{
		console.log( "SHOW PAUSED" );
		top.TweenLite.to( playShape_1, .4, {morphSVG:{shape:playShape_1, shapeIndex:0}});
		top.TweenLite.to( playShape_2, .4, {morphSVG:{shape:playShape_2, shapeIndex:0}});
	};
}

// TODO: figure out a better way to handle this.
var item = new PlayPauseBtn();
