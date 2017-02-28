function ExpandVideoPanel( _parent, _timerID )
{
    var parent = _parent;
    var timerID = _timerID;

    var panel = document.getElementById('videoPanel');
    var video = document.getElementById('videoTarget');
    var controlsDiv = document.getElementById('user_controls');

    var controls;
    var vidPlayer;

    var isShown = false;
    var isUser = false;
    var scope = this;

    var animationType = 'show';


    this.init = function ()
    {
        setUpVideo();
    };


    this.destroy = function ()
    {
        vidPlayer.destroy();
        vidPlayer = null;

        controls.destroy();
        controls = null;

        animationType = null;
        parent = null;
        panel = null;
        video = null;
    };


    this.playInitVideo = function( _isUser )
    {
        isUser = _isUser;
        controls.enable( true );
        if( isUser ) vidPlayer.startMuted = false;
        vidPlayer.playVideoByID( VIDEO_ID_1 );
    };

     this.showPanel = function()
     {
         console.log( "SHOW VIDEO PANEL" );

         TrackingManager.timerStart( timerID );

        isShown = true;
        panel.style.display = 'block';
        animationType = 'show';

        showPanelAnimation();
    };


    // play hide animation if there is one.
    this.hidePanel = function()
    {
        TrackingManager.timerStop( timerID );

        isShown = false;
        animationType = 'hide';
        panel.style.display = 'none';

        if( vidPlayer ) vidPlayer.pauseVideo();

        hidePanelAnimation();
    };


    function showPanelAnimation()
    {
        panel.style.display = 'block';
        animationComplete();
    }


    function hidePanelAnimation()
    {
        animationComplete();
    }


    function animationComplete()
    {
        if( animationType == "show" )
        {
            panel.style.display = 'block';
            parent.panelIsOpen();
        }
        else if( animationType == "hide" )
        {
            panel.style.display = 'none';
            vidPlayer.stopAndResetVideo();
            parent.panelIsClosed();
        }
    }


    this.videoPlaying = function( data )
    {
        console.log( "======================================================= VIDEO PLAYING: ", data );
    };


    this.videoStarted = function (_data)
    {
        console.log( "======================================================= VIDEO STARTED: ", _data );
        TweenLite.to( '#videoHolder', .3, { delay:.3, opacity:1 });
        TweenLite.to( "#replayBtnHolder", .5, { autoAlpha:0 });
    };


    this.videoComplete = function( data )
    {
        if( isUser ) TweenLite.to( "#replayBtnHolder",.5, { autoAlpha:1 });
        TweenLite.to( '#videoHolder', .3, { opacity:0 });
        parent.videoComplete();
    };


    this.replayVideo = function( _btn )
    {
        this.playInitVideo();
    };


    function showControls()
    {
        TweenLite.to( this.controlsDiv, .5, { delay: .5, autoAlpha: 1 });
    }


    function setUpVideo()
    {
        var video1 = DynamicContent.getVideoByID( DynamicContent.VIDEO_1 );
        var videoObj = document.getElementById( 'videoTarget' );

        vidPlayer = new VideoComponent( videoObj );
        vidPlayer.playerID = "userVideo";
        vidPlayer.initVideoID = VIDEO_ID_1;
        vidPlayer.startMuted = true;

        // add videos
        vidPlayer.addVideo( video1, null, null, VIDEO_ID_1 );

        // add video events
        vidPlayer.addVideoEvent( scope, Constants.VIDEO_STARTED, 'videoStarted' );
        vidPlayer.addVideoEvent( scope, Constants.VIDEO_COMPLETE, 'videoComplete' );
        vidPlayer.addVideoEvent( scope, Constants.VIDEO_PLAYING, 'videoPlaying' );

        // initialize video controls
        controls = new VideoControls();
        controls.autoShowHideControls = true;
        controls.parent = scope;
        controls.vidPlayer = vidPlayer;

        controls.videoCompDiv  = panel;
        controls.controlsDiv   = controlsDiv;

        // play pause button
        controls.playPauseBtn = document.getElementById('user_playPause');

        // audio button
        controls.audioBtn = document.getElementById('user_audio');

        controls.progressDiv = document.getElementById('user_progress');
        controls.progressBar = document.getElementById('user_progressBar');
        controls.loadBar = document.getElementById('user_loadBar');
        controls.slider = document.getElementById('user_slider');

        // init controls
        controls.init();
    }

    this.init();
}

