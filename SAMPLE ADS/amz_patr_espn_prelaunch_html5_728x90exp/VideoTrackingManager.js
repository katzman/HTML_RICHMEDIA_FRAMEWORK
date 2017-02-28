/**
 * Created by nkatz on 8/4/15.
 */

function VideoTrackingManager() {}


VideoTrackingManager.init = function()
{
    this.setAdData();
};


VideoTrackingManager.setAdData = function()
{
    this.setTrackingValues();
    this.addNotificationInterests();
};


VideoTrackingManager.setTrackingValues = function()
{
    this.videoEventRef = {};
    this.videoEventRef[Constants.VIDEO_STARTED] 			= STARTED   || "started";
    this.videoEventRef[Constants.VIDEO_50_PERCENT] 		    = MIDPOINT  || "midpoint";
    this.videoEventRef[Constants.VIDEO_COMPLETE] 		    = COMPLETE  || "complete";
    this.videoEventRef[Constants.VIDEO_MUTED] 			    = MUTE      || "mute";
    this.videoEventRef[Constants.VIDEO_UNMUTED] 			= UNMUTE    || "unmute";
    this.videoEventRef[Constants.VIDEO_PAUSED] 			    = PAUSE     || "pause";
    this.videoEventRef[Constants.VIDEO_PLAYING] 			= PLAY      || "play";
    this.videoEventRef[Constants.VIDEO_REPLAYING] 		    = REPLAY    || "replay";
    this.videoEventRef[Constants.PLAY_WITH_SOUND_CALLED]    = REPLAY    || "replay";
    this.videoEventRef[Constants.VIDEO_STOPPED] 			= STOP      || "stop";
};


VideoTrackingManager.addNotificationInterests = function()
{
    var videoEvents = [
        Constants.VIDEO_COMPLETE,
        Constants.VIDEO_PAUSED,
        Constants.VIDEO_MUTED,
        Constants.VIDEO_UNMUTED,
        Constants.VIDEO_REPLAYING,
        Constants.VIDEO_PLAYING,
        Constants.VIDEO_STOPPED,
        Constants.VIDEO_50_PERCENT,
        Constants.VIDEO_STARTED,
        Constants.VIDEO_ENGAGED_COMPLETE,
        Constants.VIDEO_ENGAGED_MIDPOINT,
        Constants.VIDEO_ENGAGED_PLAYING,
        Constants.VIDEO_TIMER_START,
        Constants.VIDEO_TIMER_END,
        Constants.VIDEO_ENGAGED_TIMER_END,
        Constants.VIDEO_ENGAGED_TIMER_START,
        Constants.PLAY_WITH_SOUND_CALLED
    ];

    NotificationManager.regisiterNotificationInterests( videoEvents, 'videoEvent', this );
};


VideoTrackingManager.videoEvent = function( note )
{
    if ( !VIDPLAYER_COUNTER_DATA ) return;

    var tmr;
    var ctr;

    switch (note.interest)
    {
        case Constants.VIDEO_COMPLETE:
        case Constants.VIDEO_PAUSED:
        case Constants.VIDEO_MUTED:
        case Constants.VIDEO_UNMUTED:
        case Constants.VIDEO_REPLAYING:
        case Constants.VIDEO_STOPPED:
        case Constants.VIDEO_50_PERCENT:
        case Constants.VIDEO_STARTED:
        case Constants.VIDEO_PLAYING:
        case Constants.PLAY_WITH_SOUND_CALLED:
            var event = this.videoEventRef[note.interest];
            if (!event || event == "") return;
            ctr = VIDPLAYER_COUNTER_DATA.split(VIDPLAYER_ID).join(note.data.videoID).split(VIDPLAYER_ACTION).join(event);
            TrackingManager.trackCounter(ctr);
            break;

        case Constants.VIDEO_TIMER_START:
            tmr = VIDPLAYER_TMR_DATA.split(VIDPLAYER_ID).join(note.data.videoID);
            TrackingManager.timerStart(tmr);
            break;

        case Constants.VIDEO_TIMER_END:
            tmr = VIDPLAYER_TMR_DATA.split(VIDPLAYER_ID).join(note.data.videoID);
            TrackingManager.timerStop(tmr);
            break;

        case Constants.VIDEO_ENGAGED_MIDPOINT:
            TrackingManager.trackCounter(CTR_ENGAGED_VIDEO_MIDPOINT);
            break;

        case Constants.VIDEO_ENGAGED_COMPLETE:
            TrackingManager.trackCounter(CTR_ENGAGED_VIDEO_COMPLETE);
            break;

        case Constants.VIDEO_ENGAGED_PLAYING:
            TrackingManager.trackCounter(CTR_ENGAGED_VIDEO_VIEW);
            break;

        case Constants.VIDEO_ENGAGED_TIMER_START:
            TrackingManager.timerStart(TMR_ENGAGED_VIDEO_VIEW);
            break;

        case Constants.VIDEO_ENGAGED_TIMER_END:
            TrackingManager.timerStop(TMR_ENGAGED_VIDEO_VIEW);
            break;
    }
};