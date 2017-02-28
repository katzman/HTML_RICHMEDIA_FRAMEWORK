/**
 * Created by nkatz on 6/27/16.
 */

function ProgressBarComp()
{
	// Grab player id from object id in html file.
	var container = window.frameElement;
	var id = container.id.split('_')[0];

	var slider = document.querySelector('#progress_btn');
	var progress_comp = document.querySelector('#progress_comp');
	var progressGroup = document.querySelector('#progress_group');
	var loadBar = document.querySelector('#load_bar');
	var progressBar = document.querySelector('#progress_bar');

	var clientStartX = progressGroup.getBoundingClientRect().left;
	var clientWidth = progressGroup.getBoundingClientRect().width - clientStartX;

	var barWidth = loadBar.x2.baseVal.value - loadBar.x1.baseVal.value;

	var dragging = false;
	var isPaused = false;
	var playerPos = 0;

	progress_comp.style.cursor = 'hand';
	slider.style.cursor = 'hand';

	top.TweenLite.set( progressBar, { drawSVG:0 });
	top.TweenLite.set( loadBar, 	{ drawSVG:0 });

	slider.addEventListener( 'mousedown', sliderMouseDown );
	window.addEventListener( 'mouseup', sliderMouseUp );

	progressGroup.addEventListener( 'click', progressClicked );
	progressGroup.addEventListener( 'mousemove', draggingSlider );

	top.NotificationManager.regisiterNotificationInterest( top.Constants.VIDEO_CONTROLS_READY, 'controlsReady', this );
	top.NotificationManager.regisiterNotificationInterests( [top.Constants.VIDEO_UPDATED, top.Constants.VIDEO_LOAD_PROGRESS, top.Constants.VIDEO_PAUSED, top.Constants.VIDEO_PLAYING], 'updateControls', this );


	// PUBLIC METHODS
	this.controlsReady = function( _data )
	{
		console.log( "CONTROLS READY" );
		// may come in handy later.
	};


	// Called from video component notification.
	this.updateControls = function( _data )
	{
		if( _data.data.playerID != id ) return;

		switch( _data.interest )
		{
			case top.Constants.VIDEO_UPDATED:
				playerPos = _data.data.data;
				updateSlider();
				break;

			case top.Constants.VIDEO_LOAD_PROGRESS:
				updateLoad( _data.data.data );
				break;

			case top.Constants.VIDEO_PAUSED:
				if( dragging ) return;
				isPaused = true;
				break;

			case top.Constants.VIDEO_PLAYING:
				isPaused = false;
				break;
		}
	};


	// PRIVATE METHODS
	function updateLoad( _load )
	{
		var pos = Math.round(( barWidth * _load ));
		top.TweenLite.to( loadBar, .3, {drawSVG:pos+'px'});
	}


	function progressClicked( e )
	{
		var pos = (( e.clientX - clientStartX ) / clientWidth );
		top.NotificationManager.sendNotification( top.Constants.SEEK_VIDEO, pos );
	}


	function sliderMouseDown( e )
	{
		dragging = true;
		top.NotificationManager.sendNotification( top.Constants.PAUSE_VIDEO );
	}


	function sliderMouseUp( e )
	{
		if( dragging && !isPaused ) top.NotificationManager.sendNotification( top.Constants.PLAY_VIDEO );
		dragging = false;
	}


	function draggingSlider( e )
	{
		if( !dragging ) return;

		var pos = (( e.clientX - clientStartX ) / clientWidth );
		var sliderPos = Math.round( barWidth * pos );

		top.TweenLite.to( slider, .3, { x:sliderPos });
		top.NotificationManager.sendNotification( top.Constants.SEEK_VIDEO, pos );
	}


	function updateSlider()
	{
		if( dragging ) return;

		var pos = Math.round(( barWidth * playerPos ));
		top.TweenLite.to( slider, .3, { x:pos });
		top.TweenLite.to( progressBar, .3, {drawSVG:pos+'px'});
	}
}

// TODO: figure out a better way to handle this.
var item = new ProgressBarComp();
