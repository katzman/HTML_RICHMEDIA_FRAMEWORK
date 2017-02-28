/**
 * Created by nkatz on 8/10/15.
 */

function RM_Tracker() {}


RM_Tracker.fireImpression = false;
RM_Tracker.mainPanel = null;
RM_Tracker.isFireOnce = true;
RM_Tracker.timer = null;
RM_Tracker.RM_ROLLOVER_TIME = 3000;


RM_Tracker.setRmImpression = function()
{
    if( !CTR_RM_IMPRESSION || !RM_Tracker.mainPanel ) return;

    RM_Tracker.fireImpression = true;

    this.mainPanel.addEventListener( Constants.mouseEvents.click, RM_Tracker.mouseClickTrack, false );
    this.mainPanel.addEventListener( Constants.mouseEvents.enter, RM_Tracker.mousedOverStage, false );
    this.mainPanel.addEventListener( Constants.mouseEvents.leave, RM_Tracker.mousedOffStage, false );
};


RM_Tracker.clearRmImpression = function()
{
    RM_Tracker.clearTimer();

    if( !RM_Tracker.isFireOnce ) return;

    RM_Tracker.fireImpression = false;
    this.mainPanel.removeEventListener( Constants.mouseEvents.click, RM_Tracker.mouseClickTrack, false );
    this.mainPanel.removeEventListener( Constants.mouseEvents.enter, RM_Tracker.mousedOverStage, false );
    this.mainPanel.removeEventListener( Constants.mouseEvents.leave, RM_Tracker.mousedOffStage, false );
};


RM_Tracker.trackImpression = function( e )
{
    TrackingManager.trackCounter( CTR_RM_IMPRESSION );
    RM_Tracker.clearRmImpression();
};


RM_Tracker.mousedOffStage = function( e )
{
    RM_Tracker.clearTimer();
};


RM_Tracker.mousedOverStage = function( e )
{
    RM_Tracker.startTimer();
};


RM_Tracker.clearTimer = function()
{
    if( RM_Tracker.timer ) clearTimeout( RM_Tracker.timer );
    RM_Tracker.timer = null;
};


RM_Tracker.startTimer = function()
{
    RM_Tracker.clearTimer();
    RM_Tracker.timer = setTimeout( RM_Tracker.trackImpression, RM_Tracker.RM_ROLLOVER_TIME );
};


RM_Tracker.mouseClickTrack = function( e )
{
    if( !RM_Tracker.fireImpression ) return;
    RM_Tracker.trackImpression();
};