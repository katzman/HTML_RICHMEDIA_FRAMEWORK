/**
 * Created by nkatz on 7/23/15.
 */


function AudioComponent( _audio )
{
    this.audios = {};
    this.events = {};
    this.audio = _audio;
    this.audio.audioComp = this;
    this.loopVideoNum = 0;
    this.currentAudioVo = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.playerID = 'default';
    this.initAudioID = '';
    this.firedProgressEvents = [];
    this.startMuted = true;
    this.userMuted = false;

    this.audioDuration = 0;
    this.audioProgress = 0;
    this.isEngaged = false;

    this.init();
}


AudioComponent.prototype.destroy = function()
{
    this.removeListeners();
    this.pauseAudio();

    this.audios = null;
    this.events = null;
    this.audio.audioComp = null;
    this.audio = null;
    this.currentAudioVo = null;
    this.isPlaying = null;
    this.isMuted = null;
    this.playerID = null;
    this.initAudioID = null;
    this.audioDuration = null;
    this.audioProgress = null;
    this.firedProgressEvents = null;
};


AudioComponent.prototype.init = function()
{
    this.setListeners();
};


AudioComponent.prototype.addAudio = function( _path, _id )
{
    this.audios[_id] = { path:_path, id:_id };
};


AudioComponent.prototype.addAudioEvent = function( _scope, _event, _callback )
{
    var eventVo = new AudioEventVO();
    eventVo.event = _event;
    eventVo.callback = _callback;
    eventVo.scope = _scope;

    if( !this.events[_event] ) this.events[_event] = [];
    this.events[_event].push( eventVo );
};


AudioComponent.prototype.addProgressEvent = function( _scope, _time, _audioID, _method, _fromEnd )
{
    if( !this.progressEventManager ) this.progressEventManager = new ProgressEventManager();
    this.progressEventManager.addProgressEvent( _scope, _time, _audioID, _method, _fromEnd );
};


AudioComponent.prototype.resetProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.resetEvents();
};


AudioComponent.prototype.clearProgressEvents = function()
{
    if( this.progressEventManager ) this.progressEventManager.clearProgressEvents();
};


AudioComponent.prototype.playAudioByID = function( _id )
{
    this.setUpAudio(_id);
    this.playAudio();
};


AudioComponent.prototype.setUpAudio = function( _id )
{
    this.currentAudioVo = this.audios[_id];
    if( !this.currentAudioVo ) return;

    this.firedProgressEvents = [];
    this.audio.setAttribute( 'src', this.currentAudioVo.path );
};


/* VIDEO CONTROLLER METHODS */
AudioComponent.prototype.playAudio = function()
{
    if( !this.audio || !this.currentAudioVo ) return;
    this.audio.play();
};


AudioComponent.prototype.pauseAudio = function()
{
    if( !this.audio ) return;
    this.audio.pause();
};


AudioComponent.prototype.replayAudio = function()
{
    if( !this.audio ) return;
    
    this.audio.currentTime = 0;
    this.firedProgressEvents = [];
    this.sendAudioEvent( Constants.VIDEO_REPLAYING );
    this.audio.play();
};


AudioComponent.prototype.muteAudio = function( _isUser )
{
    if( !this.audio ) return;

    if( _isUser ) this.userMuted = true;
    this.audio.muted = true;
    this.isMuted = true;
};


AudioComponent.prototype.unmuteAudio = function( _isUser )
{
    if( !this.audio ) return;

    if( _isUser ) this.userMuted = false;
    this.isEngaged = true;
    this.audio.muted = false;
    this.isMuted = false;
};


AudioComponent.prototype.seekAudio = function( pos )
{
    if( !this.audio ) return;
    this.audio.currentTime = this.audioDuration * pos;
};


AudioComponent.prototype.stopAndResetAudio = function()
{
    if( !this.isPlaying ) return;

    this.pauseAudio();
    this.audio.currentTime = 0;
    this.sendAudioEvent( Constants.VIDEO_STOPPED );
};


/* VIDEO EVENTS */
AudioComponent.prototype.audioComplete = function( e )
{
    if( !this.audioComp ) return;

    this.audioComp.isPlaying = false;
    this.audioComp.updateUnfiredVideoEvents();
    this.audioComp.sendAudioEvent( Constants.VIDEO_COMPLETE );
};


AudioComponent.prototype.audioUpdated = function( e )
{
    if( !this.audioComp ) return;

    if( this.muted ) this.audioComp.sendAudioEvent( Constants.VIDEO_MUTED );
    else this.audioComp.sendAudioEvent( Constants.VIDEO_UNMUTED );
};


AudioComponent.prototype.metaDataLoaded = function( e )
{
    if( !this.audioComp ) return;

    console.log( "AUDIO META DATA LOADED" );

    this.audioComp.audioDuration = this.duration;
    this.audioComp.sendAudioEvent( Constants.VIDEO_STARTED );
    this.audioComp.isAudioMuted();
};


AudioComponent.prototype.audioPlaying = function( e )
{
    if( !this.audioComp ) return;

    this.audioComp.isPlaying = true;
    this.audioComp.startVideoTimer();
    this.audioComp.updateVideoProps();
    this.audioComp.sendAudioEvent( Constants.VIDEO_PLAYING );
};


AudioComponent.prototype.audioPaused = function( e )
{
    if( !this.audioComp || !this.audioComp.isPlaying ) return;

    this.audioComp.isPlaying = false;
    this.audioComp.sendAudioEvent( Constants.VIDEO_PAUSED );
};


AudioComponent.prototype.audioError = function( e )
{
    console.log( "audio error" );
    console.log( e );
};


AudioComponent.prototype.timerUpdated = function( e )
{
    this.audioComp.updateVideoProps();
    this.audioComp.sendAudioEvent( Constants.VIDEO_UPDATED );
};


AudioComponent.prototype.isAudioMuted = function()
{
    if( this.startMuted || this.userMuted ) this.muteAudio();
    else this.unmuteAudio();
};


AudioComponent.prototype.showBuffer = function( e )
{
    this.audioComp.sendAudioEvent( Constants.VIDEO_SHOW_BUFFER );
};


AudioComponent.prototype.updateProgress = function()
{
    this.audioProgress = ( this.audio.currentTime / this.audioDuration ) || 0;
};


AudioComponent.prototype.getAudioTime = function()
{
    return this.audio.currentTime || 0;
};


AudioComponent.prototype.sendAudioEvent = function( _event, _data )
{
    var events = this.events[_event];
    var eventVo;

    for ( var index in events )
    {
        eventVo = events[index];
        if( !eventVo.hasOwnProperty( 'callback' ) ) continue;
        eventVo.scope[eventVo.callback]({ type:eventVo.event, playerID:this.playerID, audioID:this.currentAudioVo.audioReportingID, data:_data });
    }
};


// anything that needs to be updated on audio tick goes here.
AudioComponent.prototype.updateVideoProps = function()
{
    this.updateProgress();
    this.checkForProgressCallback();
};


AudioComponent.prototype.checkForProgressCallback = function()
{
    if( !this.progressEventManager || !this.progressEventManager.getProgressList( this.currentAudioVo.audioReportingID )) return;

    var eventList = this.progressEventManager.getProgressList( this.currentAudioVo.audioReportingID );
    var obj;
    var checkTime;
    var length = eventList.length;

    for( var i = 0; i < length; i++ )
    {
        obj = eventList[ i ];
        checkTime = ( obj.fromEnd ) ? this.audioDuration - obj.time : obj.time;

        if( this.audio.currentTime >= checkTime && !obj.fired )
        {
            obj.fired = true;
            obj.scope[obj.callback]( obj.value );
        }
    }
};


AudioComponent.prototype.setListeners = function()
{
    this.audio.addEventListener( 'ended',           this.audioComplete,  false );
    this.audio.addEventListener( 'volumechange',    this.audioUpdated,   false );
    this.audio.addEventListener( 'error',           this.audioError,     false );
    this.audio.addEventListener( 'loadedmetadata',  this.metaDataLoaded, false );
    this.audio.addEventListener( 'play',            this.audioPlaying,   false );
    this.audio.addEventListener( 'pause',           this.audioPaused,    false );
    this.audio.addEventListener( 'waiting',         this.showBuffer,     false );

    //webkitfullscreenchange mozfullscreenchange fullscreenchange
};


AudioComponent.prototype.removeListeners = function()
{
    this.audio.removeEventListener( 'ended',           this.audioComplete,  false );
    this.audio.removeEventListener( 'volumechange',    this.audioUpdated,   false );
    this.audio.removeEventListener( 'error',           this.audioError,     false );
    this.audio.removeEventListener( 'loadedmetadata',  this.metaDataLoaded, false );
    this.audio.removeEventListener( 'play',            this.audioPlaying,   false );
    this.audio.removeEventListener( 'pause',           this.audioPaused,    false );
    this.audio.removeEventListener( 'waiting',         this.showBuffer,     false );
};


function AudioEventVO()
{
    this.event = '';
    this.scope = '';
    this.callback = '';
};