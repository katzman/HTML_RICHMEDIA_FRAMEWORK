function TuneIn() {}


///////////////////////////// PUBLIC VARS /////////////////////////////
TuneIn.TIMEZONE_UTC = "utc";
TuneIn.TIMEZONE_ATLANTIC = "atlantic";
TuneIn.TIMEZONE_EASTERN = "eastern";
TuneIn.TIMEZONE_CENTRAL = "central";
TuneIn.TIMEZONE_MOUNTAIN = "mountain";
TuneIn.TIMEZONE_PACIFIC = "pacific";
TuneIn.TIMEZONE_ALASKA = "alaska";
TuneIn.TIMEZONE_HAWAII = "hawaii";

TuneIn.SUNDAY = 0;
TuneIn.MONDAY = 1;
TuneIn.TUESDAY = 2;
TuneIn.WEDNESDAY = 3;
TuneIn.WEDNESDAY = 3;
TuneIn.THURSDAY = 4;
TuneIn.FRIDAY = 5;
TuneIn.SATURDAY = 6;

TuneIn.isReady = false;
TuneIn.utcOffset = 0;
TuneIn.currentZone = null;


///////////////////////////// PRIVATE VARS /////////////////////////////
TuneIn.OFFSET_UTC = { dst: 0, standard: 0 };  // GMT time, always 0
TuneIn.OFFSET_ATLANTIC = { dst: 4, standard: 4 };
TuneIn.OFFSET_EASTERN = { dst: 4, standard: 5 };
TuneIn.OFFSET_CENTRAL = { dst: 5, standard: 6 };
TuneIn.OFFSET_MOUNTAIN = { dst: 6, standard: 7 };
TuneIn.OFFSET_PACIFIC = { dst: 7, standard: 8 };
TuneIn.OFFSET_ALASKA = { dst: 8, standard: 9 };
TuneIn.OFFSET_HAWAII = { dst: 10, standard: 10 };  // doesn't observe DST

TuneIn.zoneList = {};
TuneIn.zoneList[ TuneIn.TIMEZONE_UTC ] = TuneIn.OFFSET_UTC;
TuneIn.zoneList[ TuneIn.TIMEZONE_ATLANTIC ] = TuneIn.OFFSET_ATLANTIC;
TuneIn.zoneList[ TuneIn.TIMEZONE_EASTERN ] = TuneIn.OFFSET_EASTERN;
TuneIn.zoneList[ TuneIn.TIMEZONE_CENTRAL ] = TuneIn.OFFSET_CENTRAL;
TuneIn.zoneList[ TuneIn.TIMEZONE_MOUNTAIN ] = TuneIn.OFFSET_MOUNTAIN;
TuneIn.zoneList[ TuneIn.TIMEZONE_PACIFIC ] = TuneIn.OFFSET_PACIFIC;
TuneIn.zoneList[ TuneIn.TIMEZONE_ALASKA ] = TuneIn.OFFSET_ALASKA;
TuneIn.zoneList[ TuneIn.TIMEZONE_HAWAII ] = TuneIn.OFFSET_HAWAII;

TuneIn.dtsDates = {};
TuneIn.dtsDates[ "2014" ] = { start: { year: 2014, month: 3, day: 9 }, stop: { year: 2014, month: 11, day: 2 } };
TuneIn.dtsDates[ "2015" ] = { start: { year: 2015, month: 3, day: 8 }, stop: { year: 2015, month: 11, day: 1 } };
TuneIn.dtsDates[ "2016" ] = { start: { year: 2016, month: 3, day: 13 }, stop: { year: 2016, month: 11, day: 6 } };
TuneIn.dtsDates[ "2017" ] = { start: { year: 2017, month: 3, day: 12 }, stop: { year: 2017, month: 11, day: 5 } };
TuneIn.dtsDates[ "2018" ] = { start: { year: 2018, month: 3, day: 11 }, stop: { year: 2018, month: 11, day: 4 } };

TuneIn.dateRange = {};
TuneIn.dateObj = [];
TuneIn.dateResults = {};
TuneIn.countDownItem = {};

TuneIn.animationFrame = null;
TuneIn.testToday = null;


///////////////////////////// PUBLIC METHODS /////////////////////////////
TuneIn.addDefault = function( _id )
{
    if( !TuneIn.dateResults )
    {
        TuneIn.dateResults = {};
    }

    TuneIn.dateResults.defaultId = _id;
};


TuneIn.addDate = function( _date, _id, _notForVideo )
{
    if( !TuneIn.dateObj )
    {
        TuneIn.dateObj = [];
    }

    var date = TuneIn.getDate( _date );
    var date_obj = { date:date, time:date.getTime(), id:_id, notForVideo:_notForVideo };

    TuneIn.dateObj.push( date_obj );
};


TuneIn.addDateRange = function( _startDate, _endDate, _day, _id, _notForVideo )
{
    if( !TuneIn.dateRange )
    {
        TuneIn.dateRange = [];
    }

    var startDate = TuneIn.getDate( _startDate );
    var endDate = TuneIn.getDate( _endDate );
    var date_obj = { startDate:startDate, endDate:endDate, day:_day, id:_id, notForVideo:_notForVideo };

    TuneIn.dateRange.push( date_obj );
};


TuneIn.isPastDate = function( _dateData )
{
    var _date = new DateVO();
    _date.year = _dateData.year;
    _date.month = _dateData.month;
    _date.day = _dateData.day;
    _date.hours = _dateData.hours || 0;
    _date.minutes = _dateData.minutes || 0;

    var todayTime = TuneIn.todayCheckTime();
    var checkTime = TuneIn.getUTCTime( TuneIn.getDate( _date ), TuneIn.utcOffset );

    return checkTime <= todayTime;
}


TuneIn.addCountdownTimer = function( _scope, _endDate, _callBack, _updateTime )
{
    var endDate = TuneIn.getDate( _endDate );
    TuneIn.countDownItem = { scope:_scope, endDate:endDate, callback:_callBack };

    this.animationFrame = new AnimationFrameUtil();
    this.animationFrame.setAnimation( TuneIn, _updateTime, 'updateCountdown' );
    this.animationFrame.startAnimation();
}


TuneIn.updateCountdown = function( e )
{
    var countDownObj;
    var todayTime = TuneIn.todayCheckTime();

    var seconds;
    var minutes;
    var hours;
    var days;

    var isComplete;

    if( !TuneIn.countDownItem || !TuneIn.countDownItem.endDate ) return;

    var checkTime = TuneIn.getUTCTime( TuneIn.countDownItem.endDate, TuneIn.utcOffset );
    var timeDifference = checkTime - todayTime;

    if( timeDifference <= 0 )
    {
        isComplete = true;
        this.animationFrame.stopAnimation();
    }
    else
    {
        seconds = Math.floor( timeDifference / 1000 );
        minutes = Math.floor( seconds / 60 );
        seconds = seconds % 60;

        hours = Math.floor( minutes / 60 );
        minutes = minutes % 60;

        days = Math.floor( hours / 24 );
        hours = hours % 24;
    }

    var returnObj = { days:days, hours:hours, minutes:minutes, seconds:seconds, isComplete:isComplete };
    TuneIn.countDownItem.scope[TuneIn.countDownItem.callback]( returnObj );
}



TuneIn.setTimezone = function( zone )
{
    if( !TuneIn.zoneList[ zone ] )
    {
        console.log( "ALARM!!! valid zone not passed, make sure to use zone values referanced from this class" );
        return;
    }

    TuneIn.currentZone = TuneIn.zoneList[ zone ];

    var offSet = TuneIn.isObservingDTS() ? TuneIn.currentZone.dst : TuneIn.currentZone.standard;
    TuneIn.utcOffset = offSet * ( 1000 * 60 * 60 );
};


TuneIn.currentTimeZoneOffset = function()
{
    return TuneIn.today().timezoneOffset / 60;
};


TuneIn.currentId = function()
{
    var dateItem = TuneIn.dateResults;
    if( !dateItem )
    {
        console.log( "ALARM!!! :: TUNE IN GET CURRENT ID CALLED :: NO DEFAULT DATES ARRAY, GET CURRENT TUNE IN ID BY PASSING SWF ID TO getCurrentIdBySwfID" );
        return null;
    }

    return dateItem.id || dateItem.defaultId;
};


TuneIn.getCurrentVideoId = function()
{
    var dateItem = TuneIn.dateResults;
    if( !dateItem )
    {
        console.log( "ALARM!!! :: TUNE IN GET CURRENT ID CALLED :: NO DEFAULT DATES ARRAY, GET CURRENT TUNE IN ID BY PASSING SWF ID TO getCurrentIdBySwfID" );
        return null;
    }

    return dateItem.videoId || dateItem.defaultId;
}


TuneIn.setTestDateByDate = function( _date )
{
    TuneIn.testToday = TuneIn.getDate( _date );
};


TuneIn.getDateList = function()
{
    return [];
};


TuneIn.parseDate = function()
{
    if( !TuneIn.dateObj )
    {
        console.log( "ALARM!!! :: TUNE IN PARSE DATE CALLED :: NO DATES ARRAY" );
        return;
    }

    if( !TuneIn.dateResults )
    {
        TuneIn.dateResults = {};
    }

    var sortedList = TuneIn.dateObj.slice(0);
    sortedList.sortByObjectProp( 'time' );

    var length = sortedList.length;
    var todayTime = TuneIn.todayCheckTime();
    var checkTime;
    var date_obj;
    var range_obj = TuneIn.checkDateRange();

    for( var i = 0; i < length; i++ )
    {
        date_obj = sortedList[ i ];
        if( !date_obj )
        {
            continue;
        }

        checkTime = TuneIn.getUTCTime( date_obj.date, TuneIn.utcOffset );

        if( checkTime <= todayTime )
        {
            if( !date_obj.notForVideo ) TuneIn.dateResults.videoId = date_obj.id;
            TuneIn.dateResults.id = date_obj.id;
        }
        else
        {
            break;
        }
    }

    if( range_obj )
    {
        if( !range_obj.notForVideo ) TuneIn.dateResults.videoId = range_obj.id;
        TuneIn.dateResults.id = range_obj.id;
    }

    TuneIn.isReady = true;
};


TuneIn.checkDateRange = function()
{
    if( !TuneIn.dateRange )
    {
        return false;
    }

    var startDate;
    var endDate;
    var checkDay = TuneIn.dateRange.day;
    var todayTime = TuneIn.todayCheckTime();
    var day = TuneIn.today().day;

    var length = TuneIn.dateRange.length;
    var rangeObj;

    for( var i = 0; i < length; i++ )
    {
        rangeObj = TuneIn.dateRange[ i ];
        if( !rangeObj )
        {
            continue;
        }

        startDate = TuneIn.getUTCTime( rangeObj.startDate, TuneIn.utcOffset );
        endDate = TuneIn.getUTCTime( rangeObj.endDate, TuneIn.utcOffset );
        checkDay = TuneIn.dateRange.day;

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
TuneIn.getDate = function( _obj )
{
    if( !_obj )
    {
        return null;
    }

    var dateVO = new DateVO();
    dateVO.year = _obj.year;
    dateVO.month = _obj.month - 1;
    dateVO.day = _obj.day;
    dateVO.hour = _obj.hours || 0;
    dateVO.minute = _obj.minutes || 0;

    return new Date( dateVO.year, dateVO.month, dateVO.day, dateVO.hour, dateVO.minute );
};


TuneIn.todayCheckTime = function()
{
    var time;
    var zoneOffset = TuneIn.today().getTimezoneOffset() * ( 60 * 1000 );

    if( TuneIn.utcOffset != 0 )
    {
        time = TuneIn.getUTCTime( TuneIn.today(), zoneOffset );
    }
    else
    {
        time = TuneIn.today().getTime();
    }

    return time;
};


TuneIn.getUTCTime = function( date, offset )
{
    var result = new Date( date.getTime() );
    result.setTime( date.getTime() + offset );

    return result.getTime();
};


TuneIn.isObservingDTS = function()
{
    var now = new Date();
    var dts = TuneIn.dtsDates[ String( now.getFullYear() ) ];
    var start = TuneIn.getDate( dts.start );
    var stop = TuneIn.getDate( dts.stop );

    return ( start.getTime() <= now.getTime() && stop.getTime() >= now.getTime() );
};


TuneIn.today = function()
{
    console.log( "GET TODAY" );
    console.log( TuneIn.testToday );

    if( TuneIn.testToday )
    {
        console.log( "\n\n\nALARM!!! TEST DATE SET IN TUNE IN :: DISABLE BEFORE GOING LIVE\n\n\n" );
        return TuneIn.testToday;
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