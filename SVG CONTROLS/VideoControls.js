/**
 * Created by nkatz on 7/28/15.
 */


function VideoControls()
{
    this.parent = null;
    this.vidPlayer = null;
    this.controlsDiv = null;
    this.videoCompDiv = null;

    this.rollOffTime = 3;

    this.autoShowHideControls = true;
    this.isVideoComplete = true;
    this.isControlsShown = false;

    this.videoSelectorBtns = null;
    this.currentVideoBtn = null;
    this.videoID = null;

    this.valuesSet = false;
}


VideoControls.prototype.destroy = function()
{
    this.clearTimer();

    this.vidPlayer = null;
    this.controlsDiv = null;
    this.videoCompDiv = null;

    this.autoShowHideControls = true;
    this.isVideoComplete = true;
    this.isControlsShown = false;

    this.dragging = false;
    this.sliderTransition = null;

    this.videoSelectorBtns = null;
    this.currentVideoBtn = null;
    this.isEnabled = false;

    this.timer = null;
    this.parent = null;
};


VideoControls.prototype.init = function()
{
    NotificationManager.sendNotification( Constants.VIDEO_CONTROLS_READY );
    this.addListeners();
};


VideoControls.prototype.updatePlayerTarget = function( _vidPlayer )
{
    this.removeListeners();
    if( this.vidPlayer ) this.vidPlayer.clearEvents();
    this.vidPlayer = _vidPlayer;
    this.addListeners();
};


VideoControls.prototype.setValues = function( _force )
{
    if(( !this.slider || !this.progressDiv || this.valuesSet ) && !_force ) return;
    this.valuesSet = true;
};


VideoControls.prototype.enable = function( isEnabled )
{
    this.isEnabled = isEnabled;
};


VideoControls.prototype.addVideoBtn = function( _btn, _videoID, _handleSelected )
{
    if( !this.videoSelectorBtns ) this.videoSelectorBtns = {};
    this.videoSelectorBtns[_btn.id] = { btn:_btn, id:_videoID, handleSelected:_handleSelected };
};


VideoControls.prototype.startTimer = function()
{
    if( this.rollOffTime == -1 ) return;

    this.clearTimer();

    this.timer = setTimeout( createDelegate( this, this.hideControls ), this.rollOffTime * 1000 );
};


VideoControls.prototype.clearTimer = function()
{
    if( this.timer )
    {
        clearTimeout( this.timer );
        this.timer = null;
    }
};


VideoControls.prototype.handleNotification = function( _data )
{
    console.log( "CONTROLS :: NOTIFICATION :: ", _data.interest, _data.data );

    switch( _data.interest )
    {
        case Constants.PLAY_VIDEO:
            this.playVideo();
            break;

        case Constants.PAUSE_VIDEO:
            this.pauseVideo();
            break;

        case Constants.PLAY_PAUSE_VIDEO:
            this.playPauseVideo();
            break;

        case Constants.AUDIO_TOGGLE:
            this.audioToggle();
            break;

        case Constants.SEEK_VIDEO:
            this.seekVideo( _data.data );
            break;

        case Constants.REPLAY_VIDEO:
            this.replayVideo();
            break;
    }
};


VideoControls.prototype.replayVideo = function()
{
    this.vidPlayer.replayVideo();
};


VideoControls.prototype.playUserVideo = function( _btn )
{
    var btnObj = this.videoSelectorBtns[_btn.id];
    if( btnObj )
    {
        this.videoID = btnObj.id;
        this.vidPlayer.playVideoByID( btnObj.id );
        this.updateSelectedVideoBtns( _btn );
    }
};


VideoControls.prototype.selectVideoBtn = function( _btn )
{
    if( !_btn ) return;

    this.unselectVideoBtn( this.currentVideoBtn );

    addClass( _btn, 'videoBtn_selected' );
    this.currentVideoBtn = _btn;
};


VideoControls.prototype.unselectVideoBtn = function( _btn )
{
    if( !_btn ) return;
    removeClass( _btn, 'videoBtn_selected' );
};


VideoControls.prototype.updateSelectedVideoBtns = function( _btn )
{
    if( _btn )
    {
        this.selectVideoBtn( _btn );
        return;
    }

    for ( var btnObj in this.videoSelectorBtns )
    {
        if( this.videoID == this.videoSelectorBtns[btnObj].id && this.videoSelectorBtns[btnObj].handleSelected )
        {
            this.selectVideoBtn( this.videoSelectorBtns[btnObj].btn );
            break;
        }
    }
};


VideoControls.prototype.playPauseVideo = function()
{
    if( this.vidPlayer.isPlaying ) this.pauseVideo();
    else this.playVideo();
};



VideoControls.prototype.playVideo = function()
{
    console.log( "CONTROLS :: PLAY VIDEO CALLED" );
    this.vidPlayer.playVideo();
};


VideoControls.prototype.pauseVideo = function()
{
    this.vidPlayer.pauseVideo();
};


VideoControls.prototype.audioToggle = function()
{
    if( this.vidPlayer.isMuted )
    {
        this.vidPlayer.unmuteVideo( true );
    }
    else
    {
        this.vidPlayer.muteVideo( true );
    }
};


VideoControls.prototype.seekVideo = function( pos )
{
    this.vidPlayer.seekVideo( pos );
};


VideoControls.prototype.stopAndResetVideo = function()
{
    this.vidPlayer.stopAndResetVideo();
    this.resetControls();
};


VideoControls.prototype.pauseAndResetVideo = function()
{
    this.vidPlayer.pauseVideo();
    this.resetControls();
};


VideoControls.prototype.resetControls = function()
{
    this.unselectVideoBtn( this.currentVideoBtn );
};


VideoControls.prototype.showControls = function()
{
    if( !this.controlsDiv || this.isVideoComplete || this.isControlsShown || !this.autoShowHideControls ) return;

    this.isControlsShown = true;

    addClass( this.controlsDiv, "showControls" );
    removeClass( this.controlsDiv, "hideControls" );
};


VideoControls.prototype.hideControls = function( _force )
{
    if(( !this.controlsDiv || !this.autoShowHideControls ) && !_force ) return;

    this.isControlsShown = false;
    removeClass( this.controlsDiv, "showControls" );
    addClass( this.controlsDiv, "hideControls" );
};


// process video events
VideoControls.prototype.videoUpdated = function( _event )
{
    this.videoID = _event.videoID;

    //console.log( "CONTROLS VIDEO UPDATED :: " + _event.type );

    switch( _event.type )
    {
        case Constants.VIDEO_STARTED:
        case Constants.VIDEO_REPLAYING:
            this.isVideoComplete = false;
            this.updateSelectedVideoBtns();
            this.setValues();
            break;

        case Constants.VIDEO_COMPLETE:
            this.isVideoComplete = true;
            this.hideControls();
            this.resetControls();
            break;

        case Constants.VIDEO_STOPPED:
            this.unselectVideoBtn( this.currentVideoBtn );
            this.resetControls();
            break;
    }
};


VideoControls.prototype.addListeners = function()
{
    if( !this.vidPlayer ) return;

    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_COMPLETE, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_REPLAYING, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_MUTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_UNMUTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_PAUSED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_PLAYING, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_RESUMED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_STOPPED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_STARTED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_UPDATED, 'videoUpdated' );
    this.vidPlayer.addVideoEvent( this, Constants.VIDEO_LOAD_PROGRESS, 'videoUpdated' );


    NotificationManager.regisiterNotificationInterests([
        Constants.MUTE_VIDEO,
        Constants.UNMUTE_VIDEO,
        Constants.AUDIO_TOGGLE,
        Constants.PLAY_VIDEO,
        Constants.PAUSE_VIDEO,
        Constants.SEEK_VIDEO,
        Constants.STOP_VIDEO,
        Constants.PLAY_PAUSE_VIDEO,
        Constants.REPLAY_VIDEO],
        'handleNotification', this
    );
};


VideoControls.prototype.removeListeners = function()
{
    if( !this.vidPlayer ) return;
    this.vidPlayer.removeAllVideoEvents();
};