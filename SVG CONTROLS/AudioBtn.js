/**
 * Created by nkatz on 6/27/16.
 */

function AudioBtn()
{
	// Grab player id from object id in html file.
	var id = window.frameElement.id.split('_')[0];
	//console.log( "PLAY PAUSE BTN JS LOADED :: ", top.Banner.css );


	var btn = document.querySelector('#audio_btn');
	var lines = document.querySelector('#speaker_lines');
	var disabled = document.querySelector('#disabled');

	btn.style.cursor = 'hand';

	top.TweenLite.set( lines, { autoAlpha:0 });
	top.TweenLite.set( disabled, { autoAlpha:1 });

	btn.addEventListener( 'click', updateAudio );

	top.NotificationManager.regisiterNotificationInterest( top.Constants.VIDEO_CONTROLS_READY, 'controlsReady', this );
	top.NotificationManager.regisiterNotificationInterests( [top.Constants.VIDEO_MUTED, top.Constants.VIDEO_UNMUTED, top.Constants.VIDEO_START_MUTED, top.Constants.VIDEO_START_UNMUTED], 'updateControls', this );

	
	// PRIVATE
	function updateAudio( e )
	{
		top.NotificationManager.sendNotification( top.Constants.AUDIO_TOGGLE, id );
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
		// console.log( "UPDATE AUDIO CONTROLS CALLED :: ", _data.interest );
		if( _data.data.playerID != id ) return;

		switch( _data.interest )
		{
			case top.Constants.VIDEO_UNMUTED:
			case top.Constants.VIDEO_START_UNMUTED:
				this.showUnmuted();
				break;

			case top.Constants.VIDEO_MUTED:
			case top.Constants.VIDEO_START_MUTED:
				this.showMuted();
				break;
		}
	};

	this.showUnmuted = function()
	{
		top.TweenLite.to( lines, .5, { autoAlpha:1 });
		top.TweenLite.to( disabled, .5, { autoAlpha:0 });
	};

	this.showMuted = function()
	{
		top.TweenLite.to( lines, .5, { autoAlpha:0 });
		top.TweenLite.to( disabled, .5, { autoAlpha:1 });
	};

	this.showDisabled = function()
	{
		top.TweenLite.to( lines, .5, { autoAlpha:0 });
		top.TweenLite.to( disabled, .5, { autoAlpha:1 });
	};
}

// TODO: figure out a better way to handle this.
var item = new AudioBtn();
