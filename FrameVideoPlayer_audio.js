
function FrameVideoPlayer( _videoTarget, _audioTarget )
{
    this.audioTarget         = _audioTarget;
    this.videoTarget         = _videoTarget;
    this.video               = {};
    this.isPlaying           = false;

    this.events              = {};
    this.video.vidComp       = this;
    this.playerID            = 'framePlayer';
    this.firedProgressEvents = [];

    this.vidDuration         = 0;
    this.videoProgress       = 0;
    this.loadStartTime       = 0;
    this.loadTime            = 0;
    this.animationFrame      = null;
    this.readyToPlay         = false;
}


FrameVideoPlayer.videoEventList = [
    Constants.VIDEO_0_PERCENT,
    Constants.VIDEO_25_PERCENT,
    Constants.VIDEO_50_PERCENT,
    Constants.VIDEO_75_PERCENT,
    Constants.VIDEO_100_PERCENT
];


FrameVideoPlayer.prototype.addVideo = function( _frameName, _totalFrames, _fps, _audioPath, _buffer, _playOnLoad, _reportingID, _ext )
{
    this.video = {};
    this.video.prevImage        = null;
    this.video.ext              = _ext || 'jpg';
    this.video.audioPath        = _audioPath;
    this.video.index            = -1;
    this.video.framesLoaded     = -1;
    this.video.currentBuffered  = 0;
    this.video.bufferAmount     = _buffer;
    this.video.totalFrames      = _totalFrames;
    this.video.FPS              = _fps;
    this.video.vidFrameName     = _frameName;
    this.video.playOnLoad       = _playOnLoad;
    this.video.duration         = _totalFrames / _fps;
    this.video.reportingID      = _reportingID;
    this.video.frameTime        = 1000 / _fps;
    this.video.then             = 0;

    this.setAudioListeners();
};


FrameVideoPlayer.prototype.addVideoEvent = function( _scope, _event, _callback )
{
    var eventVo = new VideoEventVO();
    eventVo.event = _event;
    eventVo.callback = _callback;
    eventVo.scope = _scope;

    if( !this.events[_event] ) this.events[_event] = [];
    this.events[_event].push( eventVo );
};


FrameVideoPlayer.prototype.addProgressEvent = function( _scope, _time, _videoID, _method, _fromEnd )
{
    if( !this.progressEventManager ) this.progressEventManager = new ProgressEventManager();
    this.progressEventManager.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
};


FrameVideoPlayer.prototype.playVideo = function()
{
    console.log( "\n\n\nPLAYING VIDEO\n\n\n");

    if( this.isPlaying ) return;
    this.isPlaying = true;

    this.setUpVideo();
    this.playAudio();
    this.animationFrame.startAnimation();
};


FrameVideoPlayer.prototype.playAudio = function()
{
    console.log( "PLAY AUDIO CALLED" );

    this.audioTarget.play();

    if( this.hasAudio() && this.isBuffered() )
    {
        console.log( "\n\n\nBUFFERED :: PLAYING VIDEO\n\n\n");
        this.audioTarget.play();
    }
    else
    {
        console.log( "\n\n\nWAITING FOR VIDEO TO BUFFER\n\n\n");
        this.readyToPlay = true;
        this.audioTarget.pause();
    }
};


FrameVideoPlayer.prototype.pauseVideo = function()
{
    this.animationFrame.pauseAnimation();
};


FrameVideoPlayer.prototype.setUpVideo = function()
{
    console.log( "SET UP VIDEO CALLED" );

    var fps = this.video.FPS;
    if( this.hasAudio() )
    {
        this.audioTarget.setAttribute( 'src', this.video.audioPath );
        fps = 100;
    }

    this.animationFrame = new AnimationFrameUtil();
    this.animationFrame.setAnimation( this, fps, 'updateVideo' );
    //this.animationFrame.startAnimation();

    this.setFrames();
};


FrameVideoPlayer.prototype.setUpAudio = function()
{
    console.log( "SET UP AUDIO CALLED" );
    if( !this.hasAudio() ) return;
	//
    //var fps = this.video.FPS;
    //this.audioTarget.setAttribute( 'src', this.video.audioPath );
    //this.audioTarget.addEventListener()
	//
    //this.animationFrame = new AnimationFrameUtil();
    //this.animationFrame.setAnimation( this, 100, 'updateVideo', 'videoComplete', this.video.duration );
	//
    //this.setFrames();
};


FrameVideoPlayer.prototype.hasAudio = function()
{
    return ( this.video.audioPath && this.audioTarget );
};


FrameVideoPlayer.prototype.setFrames = function()
{
    this.video.videoFrames = [];

    var frame = {};

    for( var i = 1; i <= this.video.totalFrames; i++ )
    {
        frame = {};
        frame.url = this.video.vidFrameName + this.formatTime( i ) + "." + this.video.ext + "?bust=" + Math.random() * 1000;
        frame.isLoaded = false;
        this.video.videoFrames.push( frame );
    }

    this.loadFrame();
};


FrameVideoPlayer.prototype.loadFrame = function()
{
    var index = this.video.framesLoaded + 1;
    if( index > this.video.videoFrames.length ) return;

    var frame = this.video.videoFrames[index];
    if( !frame ) return;

    var image = new Image();
    image.onload = this.frameLoaded.bind( this );
    image.src = frame.url;
    frame.image = image;
    this.loadStartTime = new Date().getTime();
};


FrameVideoPlayer.prototype.frameLoaded = function( event )
{
    this.video.framesLoaded++;

    var frame = this.video.videoFrames[this.video.framesLoaded];
    frame.isLoaded = true;

    if( this.video.framesLoaded < this.video.videoFrames.length -1 )
    {
        this.loadFrame();
    }

    if( this.isBuffered() && this.readyToPlay ) this.playAudio();
};


FrameVideoPlayer.prototype.isBuffered = function()
{
    // var bufferTime = ( new Date().getTime() - this.loadStartTime ) / 1000;
    var buffered = this.video.framesLoaded / this.video.FPS;
    return ( buffered >= this.video.bufferAmount );
};


FrameVideoPlayer.prototype.updateAudio = function()
{
    var frame = this.video.frameTime / 1000;
    var frameIndex = Math.floor( this.audioTarget.currentTime / frame );

    if( this.video.index != frameIndex )
    {
        this.video.index = frameIndex;
        this.updateFrame();
    }
};


FrameVideoPlayer.prototype.updateVideo = function()
{
    if( this.video.index >= this.video.videoFrames.length )
    {
        this.videoComplete();
        return;
    }

    if( this.hasAudio() )
    {
        this.updateAudio();
    }
    else
    {
        this.video.index++;
        this.updateFrame();
    }
};


FrameVideoPlayer.prototype.updateFrame = function()
{
    if( this.video.prevImage ) this.videoTarget.removeChild( this.video.prevImage );

    var frame = this.video.videoFrames[this.video.index];
    if( !frame ) return;

    var image = frame.image;
    if( !image )
    {
        console.log( "FRAME ERROR :: INDEX: " + this.video.index );
        console.log( "FRAME ERROR :: FRAME: ", frame );
        return;
    }

    this.videoTarget.appendChild( image );
    this.video.prevImage = image;

    this.updateProgress();
    this.checkForProgressCallback();
};


FrameVideoPlayer.prototype.videoComplete = function()
{
    console.log( "VIDEO COMPLETE" );

    this.animationFrame.stopAnimation();
    this.sendVideoEvent( Constants.VIDEO_COMPLETE );
};


FrameVideoPlayer.prototype.updateProgress = function()
{
    this.videoProgress = ( this.video.index / ( this.video.videoFrames.length -1 )) || 0;
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


FrameVideoPlayer.prototype.isFired = function( _event )
{
    return ( this.firedProgressEvents.indexOf( _event ) > -1 );
};


FrameVideoPlayer.prototype.sendVideoEvent = function( _event, _data )
{
    var events = this.events[_event];
    var eventVo;

    for ( var index in events )
    {
        // fires local event for all registered listeners
        eventVo = events[index];
        if( !eventVo.hasOwnProperty( 'callback' ) ) continue;
        eventVo.scope[eventVo.callback]({ type:eventVo.event, playerID:this.playerID, videoID:this.video.reportingID, data:_data });
    }
};


FrameVideoPlayer.prototype.checkForProgressCallback = function()
{
    if( !this.progressEventManager || !this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID )) return;

    var eventList = this.progressEventManager.getProgressList( this.currentVidVo.videoReportingID );
    var obj;
    var checkTime;
    var length = eventList.length;

    for( var i = 0; i < length; i++ )
    {
        obj = eventList[ i ];
        checkTime = ( obj.fromEnd ) ? this.vidDuration - obj.time : obj.time;

        if( this.video.currentTime >= checkTime && !obj.fired )
        {
            obj.fired = true;
            obj.scope[obj.callback]( obj.value );
        }
    }
};


FrameVideoPlayer.prototype.startVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;
    this.sendVideoEvent( Constants.VIDEO_TIMER_START, this.currentVidVo.videoReportingID );
};


FrameVideoPlayer.prototype.stopVideoTimer = function()
{
    if( !this.currentVidVo || !this.currentVidVo.videoReportingID ) return;
    this.sendVideoEvent( Constants.VIDEO_TIMER_END, this.currentVidVo.videoReportingID );
};


FrameVideoPlayer.prototype.setAudioListeners = function()
{
    if( !this.hasAudio() ) return;

    this.audioTarget.addEventListener( 'ended',           createDelegate( this, this.videoComplete ),  false );
    //this.audio.addEventListener( 'volumechange',    this.audioUpdated,   false );
    //this.audio.addEventListener( 'error',           createDelegate( this, this.audioError ),     false );
    //this.audio.addEventListener( 'loadedmetadata',  createDelegate( this, this.metaDataLoaded ), false );
    //this.audio.addEventListener( 'play',            createDelegate( this, this.audioPlaying ),   false );
    //this.audio.addEventListener( 'pause',           createDelegate( this, this.audioPaused ),    false );
    //this.audio.addEventListener( 'canplay',         this.audioCanplay,   false );
    //this.audio.addEventListener( 'timeupdate',      this.timerUpdated,   false );
    //this.audio.addEventListener( 'waiting',         this.showBuffer,     false );
    //this.audio.addEventListener( 'progress',        this.updateLoad,     false );
};


FrameVideoPlayer.prototype.formatTime = function( _time )
{
    var time = _time + "";
    while( time.length < 3 )
    {
      time = '0'+time;
    }

    return time;
};


FrameVideoPlayer.prototype.bufferVideo = function()
{

};


function VideoEventVO()
{
    this.event = '';
    this.scope = '';
    this.callback = '';
};