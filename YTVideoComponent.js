/**
 * Created by nkatz on 10/05/15.
 */


function YTVideoComponent( _videoId, _useYTControls )
{
    this.videos = {};
    this.events = {};
    this.ytPlayer = null;
    this.videoID = _videoId;
    this.currentVidVo = null;
    this.isPlaying = false;
    this.isReady = false;
    this.isMuted = false;
    this.playerID = 'default';
    this.initVideoID = '';
    this.firedProgressEvents = [];
    this.startMuted = true;
    this.userMuted = false;
    this.animationFrame = null;

    this.vidDuration = 0;
    this.videoProgress = 0;
    this.isEngaged = false;
    this.isEngagedTimerRunning = false;
    this.isAutoplay = true;
    this.useYTControls = ( _useYTControls ) ? '2' : '0';

    this.init();
}


YTVideoComponent.apiReady = false;


YTVideoComponent.videoEventList = [
    Constants.VIDEO_0_PERCENT,
    Constants.VIDEO_25_PERCENT,
    Constants.VIDEO_50_PERCENT,
    Constants.VIDEO_75_PERCENT,
    Constants.VIDEO_100_PERCENT
];


YTVideoComponent.prototype.destroy = function()
{
    this.pauseVideo();
    this.stopTimer();
    this.stopVideoTimer();

    this.videos = null;
    this.events = null;
    this.video = null;
    this.currentVidVo = null;
    this.isPlaying = null;
    this.isMuted = null;
    this.playerID = null;
    this.initVideoID = null;
    this.vidDuration = null;
    this.videoProgress = null;
    this.firedProgressEvents = null;
    this.ytPlayer.destroy();
};


YTVideoComponent.prototype.init = function()
{
    if( !YTVideoComponent.apiReady ) return;
};


YTVideoComponent.prototype.addVideo = function( _id, _trackingId )
{
    var vidVo = new YTVideoVO();
    vidVo.id = _id;
    vidVo.videoReportingID = _trackingId;

    this.videos[_trackingId] = vidVo;
};


YTVideoComponent.prototype.addVideoEvent = function( _scope, _event, _callback )
{
    var eventVo = new VideoEventVO();
    eventVo.event = _event;
    eventVo.callback = _callback;
    eventVo.scope = _scope;

    if( !this.events[_event] ) this.events[_event] = [];
    this.events[_event].push( eventVo );
};


YTVideoComponent.prototype.clearEvents = function()
{
    this.events = {};
};


YTVideoComponent.prototype.addProgressEvent = function( _scope, _time, _videoID, _method, _fromEnd )
{
    if( !this.progressEventManager ) this.progressEventManager = new ProgressEventManager();
    this.progressEventManager.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
};


YTVideoComponent.prototype.resetProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.resetEvents();
};


YTVideoComponent.prototype.clearProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.clearProgressEvents();
};


YTVideoComponent.prototype.playInitVideo = function()
{
    this.setUpVideo(this.initVideoID);
};


YTVideoComponent.prototype.setCurrentVideo = function( _vidID )
{
    this.setUpVideo( _vidID );
};


YTVideoComponent.prototype.playVideoByID = function( _vidID )
{
    this.setUpVideo( _vidID );
};


YTVideoComponent.prototype.loadVideoByID = function( _vidID )
{
    this.isAutoplay = false;
    this.setUpVideo( _vidID );
};


YTVideoComponent.prototype.setUpVideo = function( _vidID )
{
    this.stopVideoTimer();
    this.isReady = false;

    this.currentVidVo = this.videos[_vidID];
    if( !this.currentVidVo ) return;

    this.firedProgressEvents = [];

    var that = this;

    if( this.ytPlayer ) this.ytPlayer.destroy();
    this.ytPlayer = null;

    this.ytPlayer = new YT.Player(
        that.videoID,
        {
            playerVars: { controls:that.useYTControls, modestbranding:1, iv_load_policy:3, showinfo:0, rel:0, enablejsapi:1, allowSeekAhead:0, autohide:1 },
            videoId: that.currentVidVo.id,
            events:
            {
                'onReady':       createDelegate( that, that.playerReady ),
                'onStateChange': createDelegate( that, that.onPlayerStateChange )
            }
        }
    );
};


YTVideoComponent.prototype.startTimer = function()
{
    this.animationFrame = new AnimationFrameUtil();
    this.animationFrame.setAnimation( this, 24, 'timerUpdated' );
    this.animationFrame.startAnimation();
};


YTVideoComponent.prototype.stopTimer = function()
{
    if( !this.animationFrame ) return;
    this.animationFrame.stopAnimation();
};


YTVideoComponent.prototype.timerUpdated = function()
{
    if( !this.isReady ) return;

    this.checkMuted();
    this.updateLoad();
    this.updateProgress();
    this.checkForProgressCallback();
    this.updateTimeCode();
    this.sendVideoEvent( Constants.VIDEO_UPDATED );
};


/* VIDEO CONTROLLER METHODS */
YTVideoComponent.prototype.playVideo = function( _isUser )
{
    if( !this.ytPlayer || !this.currentVidVo ) return;
    if( _isUser ) this.isEngaged = true;
    this.ytPlayer.playVideo();
};


YTVideoComponent.prototype.stopVideo = function()
{
    if( !this.ytPlayer ) return;
    this.stopTimer();
    this.ytPlayer.stopVideo();
};


YTVideoComponent.prototype.pauseVideo = function( _isUser )
{
    if( !this.ytPlayer || !this.ytPlayer['pauseVideo'] ) return;

    this.stopTimer();
    this.ytPlayer.pauseVideo();
    if( _isUser ) this.setEngaged( true );
};


YTVideoComponent.prototype.replayVideo = function()
{
    if( !this.ytPlayer ) return;

    this.isEngaged = true;
    this.firedProgressEvents = [];
    this.sendVideoEvent( Constants.VIDEO_REPLAYING );
    this.seekVideo( 0 );
    this.ytPlayer.playVideo();
};


YTVideoComponent.prototype.muteVideo = function( _isUser )
{
    if( !this.ytPlayer ) return;

    if( _isUser ) this.userMuted = true;
    this.ytPlayer.mute();
    this.isMuted = true;
    this.audioUpdated();
};


YTVideoComponent.prototype.unmuteVideo = function( _isUser )
{
    if( !this.ytPlayer ) return;

    if( _isUser ) this.userMuted = false;
    this.setEngaged();
    this.ytPlayer.unMute();
    this.isMuted = false;
    this.audioUpdated();
};


YTVideoComponent.prototype.seekVideo = function( pos, _isUser )
{
    if( !this.ytPlayer ) return;
    if( _isUser ) this.setEngaged();
    //if( _isUser ) this.isEngaged = true;
    this.ytPlayer.seekTo( this.vidDuration * pos, true );
};


YTVideoComponent.prototype.stopAndResetVideo = function()
{
    if( !this.isPlaying ) return;

    this.pauseVideo();
    this.seekVideo( 0 );
    this.sendVideoEvent( Constants.VIDEO_STOPPED );
};


/* VIDEO EVENTS */
YTVideoComponent.prototype.videoComplete = function()
{
    this.isPlaying = false;
    this.updateUnfiredVideoEvents();
    this.sendVideoEvent( Constants.VIDEO_COMPLETE );
};


YTVideoComponent.prototype.audioUpdated = function()
{
    if( this.isMuted ) this.sendVideoEvent( Constants.VIDEO_MUTED );
    else this.sendVideoEvent( Constants.VIDEO_UNMUTED );
};


YTVideoComponent.prototype.metaDataLoaded = function( e )
{
    this.vidDuration = this.ytPlayer.getDuration();
    this.sendVideoEvent( Constants.VIDEO_STARTED );
    this.isVideoMuted();
};


YTVideoComponent.prototype.videoPlaying = function( e )
{
    this.isPlaying = true;
    //this.startVideoTimer();
    this.timerUpdated();
    this.sendVideoEvent( Constants.VIDEO_PLAYING );
};


YTVideoComponent.prototype.videoPaused = function()
{
    if( !this.isPlaying ) return;

    this.isPlaying = false;
    //this.stopVideoTimer();
    this.sendVideoEvent( Constants.VIDEO_PAUSED );
};


YTVideoComponent.prototype.playerReady = function( e )
{
    this.isReady = true;
    this.ytPlayer.setPlaybackQuality( 'hd1080' );
    if( this.isAutoplay ) this.playVideo();
};


YTVideoComponent.prototype.videoError = function( e )
{
    console.log( "video error" );
    console.log( e );
};


YTVideoComponent.prototype.onPlayerStateChange = function( e )
{
    console.log( "" );
    console.log( "" );
    console.log( "PLAYER STATE CHANGE: ", e.data );

    switch( e.data )
    {
        case -1:
            console.log( "UNSTARTED" );
            break;

        case YT.PlayerState.ENDED:
            console.log( "COMPLETE" );
            this.videoComplete();
            this.stopTimer();
            this.stopVideoTimer();
            break;

        case YT.PlayerState.PLAYING:
            console.log( "PLAYING" );
            this.metaDataLoaded();
            this.videoPlaying();
            this.startTimer();
            this.startVideoTimer();
            break;

        case YT.PlayerState.PAUSED:
            console.log( "PAUSED" );
            this.videoPaused();
            this.stopTimer();
            this.stopVideoTimer();
            break;

        case YT.PlayerState.BUFFERING:
            console.log( "BUFFERING" );
            this.showBuffer();
            break;

        case YT.PlayerState.CUED:
            console.log( "VIDEO CUED" );
            break;
    }
    console.log( "" );
    console.log( "" );
};


YTVideoComponent.prototype.isVideoMuted = function()
{
    if( this.startMuted || this.userMuted ) this.muteVideo();
    else this.unmuteVideo();
};


/**
 * Updates progress bar load bar, only works on progressive loads.
 */
YTVideoComponent.prototype.updateLoad = function()
{
    var loadProgress = ( this.ytPlayer && this.ytPlayer['getVideoLoadedFraction'] ) ? this.ytPlayer.getVideoLoadedFraction() : 0;
    this.sendVideoEvent( Constants.VIDEO_LOAD_PROGRESS, loadProgress );
};


YTVideoComponent.prototype.showBuffer = function()
{
    this.sendVideoEvent( Constants.VIDEO_SHOW_BUFFER );
};


YTVideoComponent.prototype.checkMuted = function()
{
    if( !this.ytPlayer ) return;

    if( this.isMuted && !this.ytPlayer.isMuted() )
    {
        //this.isEngaged = true;
        this.isMuted = false;
        this.audioUpdated();
    }
    else if( !this.isMuted && this.ytPlayer.isMuted() )
    {
        this.isMuted = true;
        this.audioUpdated();
    }
};


YTVideoComponent.prototype.updateProgress = function()
{
    var currentTime = ( this.ytPlayer && this.ytPlayer['getCurrentTime'] ) ? this.ytPlayer.getCurrentTime() : 0;

    this.videoProgress = ( currentTime / this.vidDuration );
    var eventType;

    if( this.videoProgress < .25 )      eventType = Constants.VIDEO_0_PERCENT;
    else if( this.videoProgress < .5 )  eventType = Constants.VIDEO_25_PERCENT;
    else if( this.videoProgress < .75 ) eventType = Constants.VIDEO_50_PERCENT;
    else if( this.videoProgress < .97 ) eventType = Constants.VIDEO_75_PERCENT;
    else                                eventType = Constants.VIDEO_100_PERCENT;

    if( !this.isFired( eventType ))
    {
        this.sendVideoEvent( eventType );
        this.firedProgressEvents.push( eventType );
    }
};


YTVideoComponent.prototype.isFired = function( _event )
{
    if( !this.firedProgressEvents ) return -1;
    return ( this.firedProgressEvents.indexOf( _event ) > -1 );
};


YTVideoComponent.prototype.updateUnfiredVideoEvents = function()
{
    var eventType;
    var length = YTVideoComponent.videoEventList.length;

    for( var i = 0; i < length; i++ )
    {
        eventType = YTVideoComponent.videoEventList[i];
        if( !this.isFired( eventType ) )
        {
            this.sendVideoEvent( eventType );
        }
    }

    this.firedProgressEvents = [];
};


YTVideoComponent.prototype.sendVideoEvent = function( _event, _data )
{
    if( !this.currentVidVo ) return;

    NotificationManager.sendNotification( _event, { playerID:this.playerID, videoID:this.currentVidVo.videoReportingID, data:_data });
    this.engagedVideoTracking( _event );

    var events = this.events[_event];
    var eventVo;

    for ( var index in events )
    {
        eventVo = events[index];
        if( !eventVo.hasOwnProperty( 'callback' ) ) continue;
        eventVo.scope[eventVo.callback]({ type:eventVo.event, playerID:this.playerID, videoID:this.currentVidVo.videoReportingID, data:_data });
    }
};


YTVideoComponent.prototype.updateTimeCode = function()
{
    if( !this.events[Constants.VIDEO_TIMECODE] ) return;
    this.sendVideoEvent( Constants.VIDEO_TIMECODE, formatTime( this.ytPlayer.getCurrentTime() * 1000 ));
};


YTVideoComponent.prototype.checkForProgressCallback = function()
{
    if( !this.currentVidVo || !this.progressEventManager || !this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID )) return;

    var eventList = this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID );
    var obj;
    var checkTime;
    var length = eventList.length;

    for( var i = 0; i < length; i++ )
    {
        obj = eventList[ i ];
        checkTime = ( obj.fromEnd ) ? this.vidDuration - obj.time : obj.time;
        if( this.ytPlayer.getCurrentTime() >= checkTime && !obj.fired )
        {
            obj.fired = true;
            obj.scope[obj.callback]( obj.value );
        }
    }
};


YTVideoComponent.prototype.startVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;

    if( this.isEngaged ) this.setEngaged();
    this.sendVideoEvent( Constants.VIDEO_TIMER_START, this.currentVidVo.videoReportingID );
};


YTVideoComponent.prototype.setEngaged = function( _isPaused )
{
    this.sendVideoEvent( Constants.VIDEO_ENGAGED_PLAYING );
    this.isEngaged = true;

    console.log( "VIDEO COMPONENT :: SET ENGAGED CALLED :: " + this.isEngagedTimerRunning + "   " + this.isPlaying );

    if( this.isEngagedTimerRunning || !this.isPlaying || _isPaused ) return;
    this.isEngagedTimerRunning = true;
    this.sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_START );
};


YTVideoComponent.prototype.stopVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;

    if( this.isEngaged && this.isEngagedTimerRunning ) this.sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_END );
    this.isEngagedTimerRunning = false;
    this.sendVideoEvent( Constants.VIDEO_TIMER_END, this.currentVidVo.videoReportingID );
};


YTVideoComponent.prototype.engagedVideoTracking = function( _event )
{
    if( !this.isEngaged ) return;

    switch( _event )
    {
        case Constants.VIDEO_PLAYING:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_PLAYING );
            break;

        case Constants.VIDEO_50_PERCENT:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_MIDPOINT );
            break;

        case Constants.VIDEO_COMPLETE:
            this.sendVideoEvent( Constants.VIDEO_ENGAGED_COMPLETE );
            break;
    }
};


function YTVideoVO()
{
    this.id = '';
    this.videoReportingID = '';
}


function VideoEventVO()
{
    this.event = '';
    this.scope = '';
    this.callback = '';
}


// fires when youtube API is loaded and ready.
function onYouTubeIframeAPIReady()
{
    console.log( "YOUTUBE API READY" );
    YTVideoComponent.apiReady = true;
}