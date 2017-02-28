/**
 * Created by nkatz on 6/27/16.
 */

function ReplayBtn()
{
	// Grab player id from object id in html file.
	var id = window.frameElement.id.split('_')[0];
	var btn = document.querySelector('#replay_btn');
	var graphic = document.querySelector('#replay_group');

	btn.style.cursor = 'hand';

	btn.addEventListener( 'click', updateVideo );
	btn.addEventListener( 'mouseover', showOver );
	btn.addEventListener( 'mouseout', showOut );
	top.NotificationManager.regisiterNotificationInterest( top.Constants.VIDEO_CONTROLS_READY, 'controlsReady', this );
	//top.NotificationManager.regisiterNotificationInterests( [top.Constants.VIDEO_COMPLETE, top.Constants.VIDEO_PAUSED, top.Constants.VIDEO_PLAYING], 'updateControls', this );

	
	// PRIVATE
	function updateVideo( e )
	{
		console.log( "UPDATE VIDEO" );
		top.NotificationManager.sendNotification( top.Constants.REPLAY_VIDEO, id );
	}


	// PUBLIC
	this.controlsReady = function( _data )
	{
		console.log( "CONTROLS READY" );
		// not sure what i need to do here yet.
	};

	function showOver( e )
	{
		top.TweenLite.to( graphic, .5, { rotation:-360, transformOrigin:"50% 50%" });
	}

	function showOut( e )
	{
		top.TweenLite.to( graphic, .5, { rotation:0, transformOrigin:"50% 50%" });
	}
}

// TODO: figure out a better way to handle this.
var item = new ReplayBtn();
