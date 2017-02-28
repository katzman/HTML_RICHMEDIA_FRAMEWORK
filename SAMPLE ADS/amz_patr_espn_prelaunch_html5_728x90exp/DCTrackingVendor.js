/**
 * Created by nkatz on 8/4/15.
 */
function DCTrackingManager() {}


DCTrackingManager.exitClicked = function( _exit )
{
    this.fireExit( _exit );
};


DCTrackingManager.fireExit = function( _exit )
{
    Enabler.exit( _exit );
};


DCTrackingManager.dyanamicExit = function( _exit, _values )
{
    Enabler.exitQueryString( _exit, _values );
};


DCTrackingManager.trackCounter = function( id, _isCumulative )
{
    Enabler.counter( id, _isCumulative );
};


DCTrackingManager.collapseUnit = function()
{
    Enabler.requestCollapse();
};


DCTrackingManager.closeUnit = function()
{
    Enabler.closeCompanion();
};


DCTrackingManager.trackManualClose = function()
{
    Enabler.reportManualClose();
};


DCTrackingManager.startExpanded = function( _isExpanded )
{
    Enabler.setStartExpanded( _isExpanded );
};


DCTrackingManager.expandCompanion = function()
{
    Enabler.displayCompanion();
};


DCTrackingManager.expandUnit = function()
{
    Enabler.requestExpand();
};


DCTrackingManager.timerStart = function( _id )
{
    Enabler.startTimer( _id );
};


DCTrackingManager.timerStop = function( _id )
{
    Enabler.stopTimer( _id );
};