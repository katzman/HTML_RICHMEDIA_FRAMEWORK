/**
 * Created by nkatz on 8/4/15.
 */
function SiteServedTrackingManager() {}


SiteServedTrackingManager.exitClicked = function( _exit )
{
    this.fireExit( _exit );
};


SiteServedTrackingManager.fireExit = function( _exit )
{
    //Enabler.exit( _exit );
};


SiteServedTrackingManager.dyanamicExit = function( _exit, _values )
{
    //Enabler.exitQueryString( _exit, _values );
};


SiteServedTrackingManager.trackCounter = function( id, _isCumulative )
{
    //Enabler.counter( id, _isCumulative );
};


SiteServedTrackingManager.collapseUnit = function()
{
    //Enabler.requestCollapse();
};


SiteServedTrackingManager.closeUnit = function()
{
    //Enabler.closeCompanion();
};


SiteServedTrackingManager.trackManualClose = function()
{
    //Enabler.reportManualClose();
};


SiteServedTrackingManager.startExpanded = function( _isExpanded )
{
    //Enabler.setStartExpanded( _isExpanded );
};


SiteServedTrackingManager.expandCompanion = function()
{
    //Enabler.displayCompanion();
};


SiteServedTrackingManager.expandUnit = function()
{
    //Enabler.requestExpand();
};


SiteServedTrackingManager.timerStart = function( _id )
{
    //Enabler.startTimer( _id );
};


SiteServedTrackingManager.timerStop = function( _id )
{
    //Enabler.stopTimer( _id );
};