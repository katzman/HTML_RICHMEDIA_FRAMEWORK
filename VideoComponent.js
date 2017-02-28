/**
 * Created by nkatz on 7/23/15.
 */


function VideoComponent( _video )
{
    "use strict";

    // PRIVATE VARS
    var videos                  = {};
    var events                  = {};
    var firedProgressEvents     = [];
    var userMuted               = false;
    var currentVidVo            = null;
    var vidDuration             = 0;
    var video                   = _video;
    var progressEventManager    = null;
    var scope                   = this;
    var pauseVideoOnStart       = false;

    // PUBLIC VARS
    this.videoProgress          = 0;
    this.loopVideoNum = 0;
    this.isPlaying    = false;
    this.isMuted      = false;
    this.playerID     = 'default';
    this.initVideoID  = '';
    this.startMuted   = true;
    this.isEngaged    = false;

    var videoEventList = [
        Constants.VIDEO_0_PERCENT,
        Constants.VIDEO_25_PERCENT,
        Constants.VIDEO_50_PERCENT,
        Constants.VIDEO_75_PERCENT,
        Constants.VIDEO_100_PERCENT
    ];


    // PUBLIC METHODS
    this.destroy = function()
    {
        this.removeListeners();
        this.pauseVideo();
        this.removeAllVideoEvents();

        this.isPlaying      = null;
        this.isMuted        = null;
        this.playerID       = null;
        this.initVideoID    = null;
        this.videoProgress  = null;

        videos              = null;
        events              = null;
        video               = null;
        currentVidVo        = null;
        vidDuration         = null;
        firedProgressEvents = null;
        scope            = null;
    };


    this.init = function()
    {
        setListeners();
    };


    this.addVideo = function( _mp4, _webm, _ogg, _id )
    {
        var vidVo              = new VideoVO();
        vidVo.pathMP4          = _mp4;
        vidVo.pathWEBM         = _webm;
        vidVo.pathOGG          = _ogg;
        vidVo.videoReportingID = _id;

        videos[ _id ] = vidVo;
    };


    this.addVideoEvent = function( _scope, _event, _callback )
    {
        var eventVo      = new VideoEventVO();
        eventVo.event    = _event;
        eventVo.callback = _callback;
        eventVo.scope    = _scope;

        if( !events[ _event ] ) events[ _event ] = [];
        events[ _event ].push( eventVo );
    };


    this.removeVideoEvent = function( _scope, _event, _callback )
    {
        if( !events || !events[ _event ] ) return;

        var items = events[ _event ];
        var length = items.length;
        var event;

        for( var i = 0; i < length; i++ )
        {
            event = events[ i ];
            if( event.scope == _scope && event.callback == _callback )
            {
                events.splice( i, 1 );
                break;
            }
        }
    };


    this.removeAllVideoEvents = function()
    {
        for( var event in events )
        {
            delete events[ event ];
        }

        events = {};
    };


    this.addProgressEvent = function( _scope, _time, _videoID, _method, _fromEnd )
    {
        if( !progressEventManager ) progressEventManager = new ProgressEventManager();
        progressEventManager.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
    };


    this.resetProgressEvents = function()
    {
        if( progressEventManager ) progressEventManager.resetEvents();
    };


    this.clearProgressEvents = function()
    {
        if( progressEventManager ) progressEventManager.clearProgressEvents();
    };


    this.playInitVideo = function()
    {
        if( !this.initVideoID ) return;

        setUpVideo( this.initVideoID );
        this.playVideo();
    };


    this.setCurrentVideo = function( _vidID )
    {
        currentVidVo = videos[ _vidID ];
        if( !currentVidVo ) return;

        setUpVideo();
    };


    this.loadAndPauseVideo = function( _vidID )
    {
        if( !videos[ _vidID ] ) return;

        currentVidVo = videos[ _vidID ];
        pauseVideoOnStart = true;

        setUpVideo( _vidID );
        this.playVideo();
    };


    this.playVideoByID = function( _id )
    {
        setUpVideo( _id );
        this.playVideo();
    };


    /* VIDEO CONTROLLER METHODS */
    this.playVideo = function()
    {
        if( !video || !currentVidVo ) return;
        video.play();
    };


    this.pauseVideo = function( event )
    {
        if( !video ) return;
        video.pause();
    };


    this.replayVideo = function()
    {
        if( !video || !currentVidVo )
        {
            this.playInitVideo();
            return;
        }

        this.isEngaged           = true;
        video.currentTime   = 0;
        firedProgressEvents = [];
        this.sendVideoEvent( Constants.VIDEO_REPLAYING );
        video.play();
    };


    this.muteVideo = function( _isUser )
    {
        if( !video ) return;

        if( _isUser ) this.userMuted = true;
        video.muted = true;
        this.isMuted     = true;
    };


    this.unmuteVideo = function( _isUser )
    {
        if( !video ) return;

        if( _isUser ) userMuted = false;
        this.isEngaged   = true;
        video.muted = false;
        this.isMuted     = false;
    };


    this.seekVideo = function( pos )
    {
        if( !video ) return;
        video.currentTime = this.vidDuration * pos;
    };


    /**
     * stops the currently playing video, sets it's playback position to 0 and sends the event that the video has been stopped.
     */
    this.stopAndResetVideo = function()
    {
        if( !this.isPlaying ) return;

        this.pauseVideo();
        video.currentTime = 0;
        sendVideoEvent( Constants.VIDEO_STOPPED );
    };


    /**
     * Sends out the video timer start event and will send out the engaged video timer start event if video is currently engaged.
     */
    this.startVideoTimer = function()
    {
        if( !currentVidVo || !currentVidVo.videoReportingID ) return;

        if( this.isEngaged ) sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_START );
        sendVideoEvent( Constants.VIDEO_TIMER_START, currentVidVo.videoReportingID );
    };

    /**
     * Sends out the video timer stop event and will send out the engaged video timer stop event if video is currently engaged.
     */
    this.stopVideoTimer = function()
    {
        if( !currentVidVo || !currentVidVo.videoReportingID ) return;

        if( this.isEngaged ) sendVideoEvent( Constants.VIDEO_ENGAGED_TIMER_END );
        sendVideoEvent( Constants.VIDEO_TIMER_END, currentVidVo.videoReportingID );
    };


    // PRIVATE METHODS
    /**
     * Adds the video src to the video object, resets the firedProgressEvents list, sets the currentVidVo to the new video.
     */
    function setUpVideo( _id )
    {
        scope.stopVideoTimer();

        if( !videos[ _id ] ) return;
        currentVidVo = videos[ _id ];

        firedProgressEvents = [];
        video.setAttribute( 'src', getVideoPath());
    }


    /**
     * Video complete event, fired from the current video object.
     */
    function videoComplete( e )
    {
        if( !scope ) return;

        scope.isPlaying = false;
        firedProgressEvents = [];
        sendVideoEvent( Constants.VIDEO_COMPLETE );
    }


    function audioUpdated( e )
    {
        if( !scope ) return;

        if( this.muted ) sendVideoEvent( Constants.VIDEO_MUTED );
        else sendVideoEvent( Constants.VIDEO_UNMUTED );
    }


    function metaDataLoaded( e )
    {
        if( !scope ) return;
        scope.vidDuration = this.duration;
        isVideoMuted();
        isPausedAtStart();
    }


    function videoPlaying( e )
    {
        if( !scope ) return;

        scope.isPlaying = true;
        scope.startVideoTimer();
        updateVideoProps();
        sendVideoEvent( Constants.VIDEO_PLAYING );
    }


    function videoPaused( e )
    {
        if( !scope || !scope.isPlaying ) return;

        scope.isPlaying = false;
        scope.stopVideoTimer();
        sendVideoEvent( Constants.VIDEO_PAUSED );
    }


    /**
     * Checks for progress callback events and fires the callback at the specified video progress position.
     */
    function videoCanplay( e )
    {
        console.log( "video can play" );
        console.log( e );

        sendVideoEvent( Constants.VIDEO_STARTED );
    }


    /**
     * Checks if video should be paused after it initializes.
     */
    function isPausedAtStart()
    {
        if( !pauseVideoOnStart ) return;

        pauseVideoOnStart = false;
        scope.pauseVideo();
        sendVideoEvent( Constants.VIDEO_READY );
    }


    function videoError( e )
    {
        console.log( "video error" );
        console.log( e );
    }


    /**
     * anything that needs to be updated on video tick goes here.
     */
    function timerUpdated( e )
    {
        updateVideoProps();
        sendVideoEvent( Constants.VIDEO_UPDATED );
    }


    /**
     * checks if video should start muted, it will mute/unmute it and send the corresponding event.
     */
    function isVideoMuted()
    {
        if( !scope ) return;

        if( scope.startMuted || scope.userMuted )
        {
            scope.muteVideo();
            sendVideoEvent( Constants.VIDEO_START_MUTED );
        }
        else
        {
            scope.unmuteVideo();
            sendVideoEvent( Constants.VIDEO_START_UNMUTED );
        }
    }


    /**
     * Updates progress bar load bar, only works on progressive loads.
     */
    function updateLoad( e )
    {
        if( !scope ) return;

        var loadProgress;
        if( this.buffered && this.buffered.length > 0 && this.buffered.end && this.duration )
        {
            loadProgress = this.buffered.end( 0 ) / scope.vidDuration;
            sendVideoEvent( Constants.VIDEO_LOAD_PROGRESS, loadProgress );
        }
    }


    /**
     * fired from video event, sends the show buffer event.
     */
    function showBuffer( e )
    {
        if( !scope ) return;

        sendVideoEvent( Constants.VIDEO_SHOW_BUFFER );
    }


    /**
     * Tracks video progress, fires events based on current progress.
     */
    function updateProgress()
    {
        scope.videoProgress = ( video.currentTime / scope.vidDuration ) || 0;
        var eventType;

        if( scope.videoProgress > 0 && !isFired( Constants.VIDEO_0_PERCENT )) eventType = Constants.VIDEO_0_PERCENT;
        else if( scope.videoProgress > .25 && !isFired( Constants.VIDEO_25_PERCENT )) eventType = Constants.VIDEO_25_PERCENT;
        else if( scope.videoProgress > .5 && !isFired( Constants.VIDEO_50_PERCENT )) eventType = Constants.VIDEO_50_PERCENT;
        else if( scope.videoProgress > .75 && !isFired( Constants.VIDEO_75_PERCENT )) eventType = Constants.VIDEO_75_PERCENT;
        else if( scope.videoProgress > .98 && !isFired( Constants.VIDEO_100_PERCENT )) eventType = Constants.VIDEO_100_PERCENT;

        if( !isFired( eventType ) && eventType != undefined )
        {
            sendVideoEvent( eventType );
            firedProgressEvents.push( eventType );
        }
    }


    /**
     * Checks if progress event has been fired.
     */
    function isFired( _event )
    {
        if( !firedProgressEvents ) return -1;
        return ( firedProgressEvents.indexOf( _event ) > -1 );
    }


    /**
     * Checks for supported video and returns the correct path.
     */
    function getVideoPath()
    {
        var codecs = [
            { type: 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"', path: 'pathMP4' },
            { type: 'video/webm; codecs="vp8.0, vorbis"', path: 'pathWEBM' },
            { type: 'video/ogg; codecs="theora, vorbis"', path: 'pathOGG' }
        ];

        for( var index in codecs )
        {
            var canPlay = video.canPlayType( codecs[index].type );
            if( canPlay == "probably" )
            {
                return currentVidVo[ codecs[index].path ];
            }
        }

        return currentVidVo.pathMP4;
    }


    /**
     * Sends video events, both locally and through the notification manager.
     * The video tracking manager listens for video events using the notification manager.
     */
    function sendVideoEvent( _event, _data )
    {
        if( !currentVidVo ) return;

        NotificationManager.sendNotification( _event, { playerID:scope.playerID, videoID:currentVidVo.videoReportingID, data:_data });
        engagedVideoTracking( _event );

        var items = events[ _event ];
        var eventVo;

        for( var index in items )
        {
            eventVo = items[ index ];
            if( !eventVo.hasOwnProperty( 'callback' ) ) continue;
            eventVo.scope[ eventVo.callback ]( { type:eventVo.event, playerID:scope.playerID, videoID:currentVidVo.videoReportingID, data:_data });
        }
    }


    /**
     * anything that needs to be updated on video tick goes here.
     */
    function updateVideoProps()
    {
        updateProgress();
        checkForProgressCallback();
    }


    /**
     * Checks for progress callback events and fires the callback at the specified video progress position.
     */
    function checkForProgressCallback()
    {
        if( !progressEventManager || !progressEventManager.getProgressList( currentVidVo.videoReportingID ) ) return;

        var eventList = progressEventManager.getProgressList( currentVidVo.videoReportingID );
        var obj;
        var checkTime;
        var length    = eventList.length;

        for( var i = 0; i < length; i++ )
        {
            obj       = eventList[ i ];
            checkTime = ( obj.fromEnd ) ? vidDuration - obj.time : obj.time;

            if( video.currentTime >= checkTime && checkTime != -1 && !obj.fired )
            {
                obj.fired = true;
                obj.scope[ obj.callback ]( obj );
            }
        }
    }


    /**
     * fires engaged video tracking events if video is currently engaged.
     */
    function engagedVideoTracking( _event )
    {
        if( !scope.isEngaged ) return;

        switch( _event )
        {
            case Constants.VIDEO_PLAYING:
                sendVideoEvent( Constants.VIDEO_ENGAGED_PLAYING );
                break;

            case Constants.VIDEO_50_PERCENT:
                sendVideoEvent( Constants.VIDEO_ENGAGED_MIDPOINT );
                break;

            case Constants.VIDEO_COMPLETE:
                sendVideoEvent( Constants.VIDEO_ENGAGED_COMPLETE );
                break;
        }
    }


    function setListeners()
    {
        video.addEventListener( 'ended', videoComplete, false );
        video.addEventListener( 'volumechange', audioUpdated, false );
        video.addEventListener( 'error', videoError, false );
        video.addEventListener( 'loadedmetadata', metaDataLoaded, false );
        video.addEventListener( 'play', videoPlaying, false );
        video.addEventListener( 'pause', videoPaused, false );
        video.addEventListener( 'canplay', videoCanplay, false );
        video.addEventListener( 'timeupdate', timerUpdated, false );
        video.addEventListener( 'waiting', showBuffer, false );
        video.addEventListener( 'progress', updateLoad, false );
    }


    function removeListeners()
    {
        video.removeEventListener( 'ended', videoComplete, false );
        video.removeEventListener( 'volumechange', audioUpdated, false );
        video.removeEventListener( 'error', videoError, false );
        video.removeEventListener( 'loadedmetadata', metaDataLoaded, false );
        video.removeEventListener( 'play', videoPlaying, false );
        video.removeEventListener( 'pause', videoPaused, false );
        video.removeEventListener( 'canplay', videoCanplay, false );
        video.removeEventListener( 'timeupdate', timerUpdated, false );
        video.removeEventListener( 'waiting', showBuffer, false );
        video.removeEventListener( 'progress', updateLoad, false );
    }

    this.init();
}


/**
 * Video variable object.
 */
function VideoVO()
{
    this.mmID = '';
    this.pathMP4 = '';
    this.pathWEBM = '';
    this.pathOGG = '';
    this.videoReportingID = '';
}


/**
 * Video event variable object.
 */
function VideoEventVO()
{
    this.event = '';
    this.scope = '';
    this.callback = '';
}