function Banner() {}


Banner.preloadImages = function()
{
//    var images = ['pause_btn_over.png', 'play_btn_over.png', 'closeBtn_over.png', 'audio_btn_disabled_over.png', 'audio_btn_over.png', 'videoSelectorBtns_over.png'];
//    var imageObj = new Image();
//
//    for( var i = 0; i < images.length; i++ )
//    {
//        imageObj.src = images[i];
//    }
};


Banner.addListeners = function()
{
    var mainExits = [ 'mainExit', 'collapsedExit', 'videoExit' ];
    var closeBtns = [ 'closeBtn' ];
    var expandBtns = [ 'expandBtn' ];

    var mouseManager = new MouseEventManager( this.adContainer );
    //    mouseManager.debug = true;

    // main exit buttons
    mouseManager.addButtons( Banner, mainExits, 'exitClicked');

    // close buttons
    mouseManager.addButtons( TrackingManager, closeBtns, 'collapseUnit' );

    // expand buttons
    mouseManager.addButtons( Banner, expandBtns, 'showExpand' );

    // replay button
    mouseManager.addButton( Banner, 'replayBtn', 'startVideo' );

    // main exit tracking
    TrackingManager.addBtnsTracking( mainExits, EXIT_MAIN, true );

    NotificationManager.regisiterNotificationInterest( 'animationComplete', 'dateAnimationComplete', Banner );
    NotificationManager.regisiterNotificationInterest( 'logoComplete', 'logoAnimationComplete', Banner );

    Enabler.addEventListener( studio.events.StudioEvent.EXPAND_START,    this.expandStartHandler );
    Enabler.addEventListener( studio.events.StudioEvent.COLLAPSE_START,  this.collapseStartHandler );
    Enabler.addEventListener( studio.events.StudioEvent.EXPAND_FINISH,   this.expandFinishHandler );
    Enabler.addEventListener( studio.events.StudioEvent.COLLAPSE_FINISH, this.collapseFinishHandler );
};


Banner.exitClicked = function( _btn )
{
    Banner.expandPanelComp.hidePanel();
    TrackingManager.exitClicked( _btn );
};


Banner.panelIsOpen = function()
{
    console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PANEL IS OPEN" );
};

Banner.panelIsClosed = function()
{
    console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PANEL IS CLOSED" );
};


// fired from the ExpandVideoPanel when the video is done, if video was user initiated it will not close.
Banner.videoComplete = function()
{
    // checks if user expanded and will bail if it was.
    console.log( "VIDEO COMPLETE: " + Banner.userExpand );
    if( Banner.userExpand ) return;
    TrackingManager.collapseUnit();
};


// shows collapsed animation, this only runs once.
Banner.initAnimation = function()
{
    var tl = new TimelineLite({ ease:'Quart.easeOut', onComplete:showDate });
    // who
    tl.fromTo( '#w', 0,   { opacity:0 }, { opacity:1 });
    tl.fromTo( '#h', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#o', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");

    // is
    tl.fromTo( '#i', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#s', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");

    // john
    tl.fromTo( '#j', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#o2', 0,  { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#h2', 0,  { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#n', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");

    // lakemen
    tl.fromTo( '#l', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#a', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#k', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#e', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#m', 0,   { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#a2', 0,  { opacity:0 }, { opacity:1 }, "+=0.1");
    tl.fromTo( '#n2', 0,  { opacity:0 }, { opacity:1 }, "+=0.1");

    function showDate()
    {
        TweenLite.delayedCall( 0.4, function()
        {
            Banner.collapsedDate.resetAndPlay();
        });
    }
};


Banner.logoAnimationComplete = function( _data )
{
    TweenLite.fromTo( '#amazonLogo',    0, { opacity:0 }, { opacity:1, delay:.5 });
    TweenLite.fromTo( '#logoTxt',       0, { opacity:0 }, { opacity:1, delay:1 });
};

// fired with any of the date animations are done running.
Banner.dateAnimationComplete = function( _data )
{
    if( _data.data.indexOf( 'Expanded' ) > -1 ) return;
    //TweenLite.delayedCall( 0.4, Banner.showExpand );
};


// expand panel timeline animation, runs only when the expand panel is shown.
Banner.showExpandAnimation = function()
{
    Banner.expandPanelComp.showPanel();
    var tl = new TimelineLite();
    tl.set (['#adContainer', '#expanded'], {perspective:1000});
    tl.add( Banner.startVideo, "-=0" );
    tl.fromTo( '#videoPanel', 1,    { x:0 }, { x:410, ease:'Quart.easeInOut' }, "-=0" );
    tl.add( Banner.logoAnimation.resetAndPlay, "-=0" );
    tl.fromTo( '#characters', 4,    { x:-200, y:200, opacity:1, scale:3.5, force3D:false }, { x:0, y:0, opacity:1, scale:1, force3D:false, ease:'Quart.easeInOut' });
    tl.add( showDate, "-=1" );
    tl.play();

    function showDate()
    {
        if( !Banner.isExpanded ) return;
        Banner.expandedDate.resetAndPlay();
    }
};


// starts the expand panel video and tells it if it was user initiated so it knows to play with sound or not.
Banner.startVideo = function()
{
    // Banner.userExpand tells the expand component if the user selected to expand or not. If true it will play the video with sound.
    console.log( "STARTING VIDEO" );
    Banner.expandPanelComp.playInitVideo( Banner.userExpand );
};


Banner.resetElements = function()
{
    TweenLite.set( '#expanded',         { opacity:0 });
    TweenLite.set( '#characters',       { x:-200, y:200, opacity:1, scale:3.5, force3D:false });
    TweenLite.set( '#videoPanel',       { x:0 });
    TweenLite.set( '#logoTxt',          { opacity:0 });
    TweenLite.set( '#amazonLogo',       { opacity:0 });
    TweenLite.set( "#replayBtnHolder",  { autoAlpha:0 });

    Banner.logoAnimation.reset();
    Banner.expandPanelComp.hidePanel();
    Banner.expandedDate.reset();    
};


Banner.showExpand = function( e )
{
    if( e ) Banner.userExpand = true;
    TrackingManager.expandUnit( null, Banner.expandPanelID );
};


Banner.expandPanel = function()
{
    TweenLite.to( ['#expanded', '#closeBtnHolder'], 0.5, { opacity:1, display:'block' });
    TweenLite.to( [this.boarder,this.adContainer], 0.5, { opacity:1, height:250, ease:'Quart.easeOut' });
    Enabler.finishExpand();
};


Banner.collapsePanel = function()
{
    Banner.logoAnimation.pause();
    TweenLite.to( this.adContainer, 0.5, { height:90, ease:'Quart.easeIn', onComplete:Banner.resetElements });
    TweenLite.to( this.boarder, 0.5, { opacity:0, height:90, ease:'Quart.easeIn' });
    TweenLite.to( ['#expanded', '#closeBtnHolder'], 0.5, { opacity:0, ease:'Quart.easeIn', display:'none' });
    Enabler.finishCollapse();
};


/* ENABLER EVENT HANDLERS */
Banner.expandStartHandler = function( e )
{
    Banner.isExpanded = true;
    Banner.resetElements();
    Banner.showExpandAnimation();
    Banner.expandPanel();
};


Banner.expandFinishHandler = function( e )
{
    Banner.isExpanded = true;
    TweenLite.set( '#expandBtn', { delay:2, display:'block' });
};


Banner.collapseStartHandler = function( e )
{
    Banner.isExpanded = false;
    Banner.collapsePanel();
};


Banner.collapseFinishHandler = function( e )
{
    Banner.isExpanded = false;
};


Banner.init = function()
{
    Enabler.setExpandingPixelOffsets(
        0, // left
        0, // top
        728, // expandedWidth
        250  // expandedHeight
    );
    Enabler.setIsMultiDirectional( false );

    TrackingManager.setTrackingVendor( DCTrackingManager );

    var NOW_STREAMING_SVG   = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 775 206" xml:space="preserve"><defs><mask id="{maskId}"><path class="strokes"  d="M98.5-18"/> <path class="strokes"  d="M22.4,146.1c0.2-1,28.5-111.8,35.8-111.8s-2,91.3,7.2,78.6s30.9-68.2,39.1-80.5s-6,34.4-6,34.4l8.5,7.6c0,0-21.9,42.4-12.5,47.3s44.4-41.1,29.1-55.9c-5.9-5.7-19.7-0.6-19.7-0.6L132,35.3c0,0,8.6,18.4,8.8,19c0.2,0.6,7.4,67.6,10.8,66.1c3.3-1.6,12.9-50.6,15.1-50.8c2.2-0.2,12.7,42.6,15.1,41.8c2.3-0.8,20.7-58.1,25.4-58.1s14.5,60.2,14.5,60.2s12.5,7.8,16.4,7.8s57.1-6.8,54.3-26.4c-2.6-18.3-36.6-31.1-36.7-36.4c-0.2-7.2,39.9-20.9,52.8-12.5c12.9,8.4-21.9,11.5-21.9,11.5l3.7,12.8l97.4-23.9"/><path class="strokes"  d="M387.5,47.2c0,0-39.3-35.4-39.7-34.6c-0.4,0.8-35,108.5-18.4,105.6s30.1-24.6,30.1-24.6s11.5-53.6,12.3-53.4c0.8,0.2,6.3,2.5,7,2.5c0.8,0-10,71-5.3,72.1c5.3,1.2,15.4-52,39.3-57.5c19-4.4-7.8,19.4-7.8,19.4s-15.3,28-14.7,28c37.9-0.2,67.8-29.9,60.2-39.3c-13.9-17.1-40.9,26.6-38.7,39.1c2.2,12.5,13.7,16,27,10.4s25-15.4,25-15.4"/><path class="strokes"  d="M497,88.2c0.8-0.9,9,4.9,9,4.9s-31.5,32.9-38.3,24.2c-5.5-7,36.7-63.7,47.7-59.4c11.1,4.4-12.7,58.2-3.9,63.2c9.8,5.6,14.3-18.2,14.3-18.2s-9.8,26.8-1.4,27.7c11.1,1.2,27-67.5,29.2-67.3c3.4,0.3-1.7,49.4,10.4,50.3c11.1,0.8,29.9-55,32.3-54.9c0,0,4.1,70,9,71c4.9,1,10-85.8,10-85.8"/><path class="strokes"  d="M615.2,44.9c0.1-1,13.9,1.4,14.5,1.2s-16.8,71-5.3,81.3s10.4-111.4,10.4-111.4l15.4,23.8c0,0-9,77.8-8.8,77s18.8-59.4,37.5-62.7c6.1-1.1-6,78-6,78s37.5-103,38.3-103c0.8,0,24.2,15.6,24.2,15.6s-3.4,14.5-4.9,14.1c-14.5-3.8-41,36.9-33.2,47.7c9.7,13.5,37.1-46.1,39.1-45.3c2,0.8-0.8,83.9-31,104.4c-24.6,15.1-37.6,13.5-48-9.6"/></mask></defs><g id="streamImage" mask="url(#{maskId})"><image class="image" overflow="visible" width="775" height="206" xlink:href="{image}"></image></g></svg>';
    var PRE_SVG             = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 440 330" xml:space="preserve"><defs><mask id="{maskId}"><path class="strokes" d="M4,170c0,0,5.8-9.6,14.9-19.4c9.2-10,21.8-20.4,29.7-25.1c15.6-9.5,36.3-17.5,44.6-9.7c7.6,7.1-28,53.4-32.7,59.3s-36.6,41.3-39.1,48.4c-1.6,4.8,0.1,7.3,5.4,8C55.2,235.1,133,209,133,209"/><polyline class="strokes" points="219.7,-4.7 184.3,125 159.3,224 146.3,281.7 142,335"/><path class="strokes" d="M224.3,128.7c0,0,19.7-17.3,26-20.3s20-3.4,27.3,4.3c7.3,7.7,1.7,18.3,0,25c-1.7,6.7-12.9,22.6-16.7,27.8s-30.7,41.4-31.7,44.2s6.8,2.7,10.7,2c5.2-1,41.3-21.3,41.3-21.3L336,163"/><path class="strokes" d="M424.5,41.8c0,0-9-1.3-14.8,3c-6.8,5-14,34-15.3,39.6s-30.9,136.8-31.7,142.1s-9.2,61.2-9.2,61.2"/><path class="strokes" d="M345.5,100c0,0-14,17.3-14.8,23c-0.8,5.7,2.3,21,27.1,17.7s41-20.1,41-20.1"/></mask></defs><g mask="url(#{maskId})"><image class="image" overflow="visible" width="418" height="330" xlink:href="{image}" transform="matrix(1 0 0 1 4 0)"></image></g></svg>';

    // TuneInLite.setTestDateByDate({ year:2017, month:2, day:30 });
    Banner.isPastDate               = TuneInLite.isPastDate({ year:2017, month:2, day:24 });

    // div reference variables
    Banner.adContainer              = document.getElementById( 'adContainer' );
    Banner.collapsedDate            = null;
    Banner.expandedDate             = null;

    if( Banner.isPastDate )
    {
        Banner.collapsedDate        = new DrawTxtAnimation( "postDate", [{ element:document.querySelector('#postDateCollapsed'), svg:NOW_STREAMING_SVG, image:"nowStreamingBlk.png", time:.5, maskId:'collapsedStream' }] );
        Banner.expandedDate         = new DrawTxtAnimation( "postExpandedDate", [{ element:document.querySelector('#postDateExpanded'), svg:NOW_STREAMING_SVG, image:"nowStreamingRed.png", time:.5, maskId:'expandedStream' }] );
    }
    else
    {
        Banner.collapsedDate        = new DrawTxtAnimation( "preDate",  [{ element:document.querySelector('#preDateCollapsed'), svg:PRE_SVG, image:"dateImageBlack.png", time:.25, maskId:'collapsedMask' }] );
        Banner.expandedDate         = new DrawTxtAnimation( "preExpandedDate",  [{ element:document.querySelector('#preDateExpanded'), svg:PRE_SVG, image:"dateImage.png", time:.25, maskId:'expandedMask' }] );
    }

    Banner.logoAnimation            = new LogoAnimation( "logo", document.getElementById( 'logoSVG' ));
    Banner.expandPanelID            = 'expandPanel';

    // div reference variables
    Banner.adContainer              = document.getElementById( 'adContainer' );
    Banner.boarder                  = document.getElementById( 'adBorder' );
    Banner.closeBtn                 = document.getElementById( 'closeBtn' );

    Banner.expandPanelComp          = new ExpandVideoPanel( this, VIDEO_PANEL_TMR );

    Banner.isExpanded               = false;
    Banner.userExpand               = false;

    SVGLib.addSVGByID( 'closeBtnSVG', SVGLib.CLOSE_BTN );
    SVGLib.addSVGByID( 'playBtnSVG', SVGLib.PLAY_BTN );
    SVGLib.addSVGByID( 'pauseBtnSVG', SVGLib.PAUSE_BTN );
    SVGLib.addSVGByID( 'audioBtnSVG', SVGLib.AUDIO_BTN );
    SVGLib.addSVGByID( 'replayBtnSVG', SVGLib.REPLAY_BTN );

    Banner.expandPanelComp.showPanel();
    this.addListeners();
    this.initAnimation();
};


document.addEventListener('DOMContentLoaded', function()
{
    if (Enabler.isInitialized())
    {
        enablerInitHandler();
    }
    else
    {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
    }
});



enablerInitHandler = function(e)
{
    if(Enabler.isVisible())
    {
        Banner.init();
    }
    else
    {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, createDelegate( Banner, Banner.init ) );
    }
};
