
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
}


FrameVideoPlayer.videoEventList = [
    Constants.VIDEO_0_PERCENT,
    Constants.VIDEO_25_PERCENT,
    Constants.VIDEO_50_PERCENT,
    Constants.VIDEO_75_PERCENT,
    Constants.VIDEO_100_PERCENT
];


FrameVideoPlayer.prototype.addVideo = function( _frameName, _totalFrames, _fps, _buffer, _playOnLoad, _reportingID, _ext )
{
    this.video = {};
    this.video.prevImage        = null;
    this.video.ext              = _ext || 'jpg';
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

    this.setUpVideo();
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
    //if( !this.progressEventManager ) this.progressEventManager = new ProgressEventManager();
    //this.progressEventManager.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
};


FrameVideoPlayer.prototype.playVideo = function()
{
    console.log( "\n\n\nPLAYING VIDEO\n\n\n");

    if( this.isPlaying ) return;
    this.isPlaying = true;
    this.animationFrame.startAnimation();
};


FrameVideoPlayer.prototype.pauseVideo = function()
{
    this.animationFrame.pauseAnimation();
};


FrameVideoPlayer.prototype.setUpVideo = function()
{
    console.log( "SET UP VIDEO CALLED" );

    this.animationFrame = new AnimationFrameUtil();
    this.animationFrame.setAnimation( this, this.video.FPS, 'updateVideo', 'videoComplete', this.video.duration );
    this.animationFrame.startAnimation();

    this.setFrames();
};


FrameVideoPlayer.prototype.setFrames = function()
{
    this.video.videoFrames = [];

    var frame = {};

    for( var i = 1; i <= this.video.totalFrames; i++ )
    {
        frame = {};
        frame.url = this.video.vidFrameName + this.formatTime( i ) + "." + this.video.ext;
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

    if( this.isBuffered()) this.playVideo();
};


FrameVideoPlayer.prototype.isBuffered = function()
{
    var bufferTime = ( new Date().getTime() - this.loadStartTime ) / 1000;
    //console.log( "BUFFER TIME :: " + bufferTime );

    var buffered = this.video.framesLoaded / this.video.FPS;
    return ( buffered >= this.video.bufferAmount );
};


FrameVideoPlayer.prototype.updateVideo = function()
{
    this.video.index++;
    if( this.video.index >= this.video.videoFrames.length )
    {
        this.videoComplete();
        return;
    }

    var frame = this.video.videoFrames[this.video.index];
    var image = frame.image;

    if( this.video.prevImage ) this.videoTarget.removeChild( this.video.prevImage );
    this.videoTarget.appendChild( image );
    this.video.prevImage = image;

    this.updateProgress();
    this.checkForProgressCallback();
    //this.updateVideoTimer();
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
    // sends event to video tracking manager or whoever else is listening.
    // NotificationManager.sendNotification( _event, { playerID:this.playerID, videoID:this.video.reportingID, data:_data });

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