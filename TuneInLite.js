function TuneInLite() {}

TuneInLite.dateRange = {};
TuneInLite.dateList = [];
TuneInLite.dateResults = {};

TuneInLite.isReady = false;
TuneInLite.testToday = null;


TuneInLite.addDefault = function( _id )
{
    if( !TuneInLite.dateResults ) TuneInLite.dateResults = {};    
    TuneInLite.dateResults.defaultId = _id;
};


TuneInLite.addDate = function( _date, _id )
{
    if( !TuneInLite.dateList ) TuneInLite.dateList = [];    

    var date = TuneInLite.getDate( _date );
    var date_obj = { date:date, time:date.getTime(), id:_id };

    TuneInLite.dateList.push( date_obj );
};


TuneInLite.addDateRange = function( _startDate, _endDate, _day, _id )
{
    if( !TuneInLite.dateRange ) TuneInLite.dateRange = [];

    var startDate = TuneInLite.getDate( _startDate );
    var endDate = TuneInLite.getDate( _endDate );
    var date_obj = { startDate:startDate, endDate:endDate, day:_day, id:_id };

    TuneInLite.dateRange.push( date_obj );
};


TuneInLite.isPastDate = function( _dateData )
{
    var _date = new DateVO();
    _date.year = _dateData.year;
    _date.month = _dateData.month;
    _date.day = _dateData.day;
    _date.hours = _dateData.hours || 0;
    _date.minutes = _dateData.minutes || 0;

    var todayTime = TuneInLite.todayCheckTime();
    var checkTime = TuneInLite.getDate( _date );

    console.log( "IS PAST DATE: " + checkTime + ' <= ' + todayTime );

    return checkTime <= todayTime;
};


TuneInLite.currentId = function()
{
    var dateItem = TuneInLite.dateResults;
    if( !dateItem ) return null;

    return dateItem.id || dateItem.defaultId;
};


TuneInLite.setTestDateByDate = function( _date )
{
    TuneInLite.testToday = TuneInLite.getDate( _date );
};


TuneInLite.parseDate = function()
{
    if( !TuneInLite.dateList ) return;
    if( !TuneInLite.dateResults ) TuneInLite.dateResults = {};

    var sortedList = TuneInLite.dateList.slice(0);
    sortedList.sortByObjectProp( 'time' );

    var length = sortedList.length;
    var todayTime = TuneInLite.todayCheckTime();
    var checkTime;
    var date_obj;
    var range_obj = TuneInLite.checkDateRange();

    for( var i = 0; i < length; i++ )
    {
        date_obj = sortedList[ i ];
        if( !date_obj ) continue;

        checkTime = TuneInLite.getDate( date_obj.date );

        if( checkTime <= todayTime ) TuneInLite.dateResults.id = date_obj.id;
        else break;
    }

    if( range_obj ) TuneInLite.dateResults.id = range_obj.id;

    TuneInLite.isReady = true;

};


TuneInLite.checkDateRange = function()
{
    if( !TuneInLite.dateRange ) return false;

    var startDate;
    var endDate;
    var checkDay = TuneInLite.dateRange.day;
    var todayTime = TuneInLite.todayCheckTime();
    var day = TuneInLite.today().day;

    var length = TuneInLite.dateRange.length;
    var rangeObj;

    for( var i = 0; i < length; i++ )
    {
        rangeObj = TuneInLite.dateRange[ i ];
        if( !rangeObj )
        {
            continue;
        }

        startDate = TuneInLite.getDate( rangeObj.startDate );
        endDate = TuneInLite.getDate( rangeObj.endDate );
        checkDay = TuneInLite.dateRange.day;

        if( todayTime >= startDate && todayTime <= endDate )
        {
            if( checkDay == day )
            {
                return rangeObj;
            }
        }
    }

    return null;
};


///////////////////////////// PRIVATE METHODS /////////////////////////////
TuneInLite.getDate = function( _obj )
{
    if( !_obj ) return;

    var dateVO = new DateVO();
    dateVO.year = _obj.year;
    dateVO.month = _obj.month - 1;
    dateVO.day = _obj.day;
    dateVO.hour = _obj.hours || 0;
    dateVO.minute = _obj.minutes || 0;

    return new Date( dateVO.year, dateVO.month, dateVO.day, dateVO.hour, dateVO.minute );
};


TuneInLite.todayCheckTime = function()
{
    return TuneInLite.today().getTime();
};


TuneInLite.today = function()
{
    console.log( "GET TODAY" );
    console.log( TuneInLite.testToday );

    if( TuneInLite.testToday )
    {
        console.log( "\n\n\nALARM!!! TEST DATE SET IN TUNE IN :: DISABLE BEFORE GOING LIVE\n\n\n" );
        return TuneInLite.testToday;
    }

    return new Date();
};


function DateVO()
{
    var year;
    var month;
    var day;

    var hours;
    var minutes;
}
