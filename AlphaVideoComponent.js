/**
 * Created by nkatz on 7/23/15.
 */


function AlphaVideoComponent( _video, _buffer, _output )
{
    var video = _video;
    var bufferCanvas = _buffer;
    var outputCanvas = _output;

    var animationFrame = null;
    var output = null;
    var buffer = null;
    var width = null;
    var height = null;
    var scope = this;

    this.vidPlayer = null;

    this.init();


    this.destroy = function()
    {
        stopProcess();

        video = null;
        bufferCanvas = null;
        outputCanvas = null;
        animationFrame = null;

        this.vidPlayer = null;
    };


    this.init = function()
    {
        output = outputCanvas.getContext( '2d' );
        buffer = bufferCanvas.getContext( '2d' );
        width = outputCanvas.width;
        height = outputCanvas.height;

        this.vidPlayer = new VideoComponent( this.video );
        this.vidPlayer.addVideoEvent( this, Constants.VIDEO_PLAYING, 'startProcess' );
        this.vidPlayer.playerID = "alphaVideo";
    };


    this.addVideo = function( _mp4, _webm, _ogg, _id )
    {
        this.vidPlayer.addVideo( _mp4, _webm, _ogg, _id );
    };


    this.addVideoEvent = function( _scope, _event, _callback )
    {
        this.vidPlayer.addVideoEvent( _scope, _event, _callback );
    };


    this.addProgressEvent = function( _scope, _time, _videoID, _method, _fromEnd )
    {
        this.vidPlayer.addProgressEvent( _scope, _time, _videoID, _method, _fromEnd );
    };


    this.resetProgressEvents = function()
    {
        this.vidPlayer.resetProgressEvents();
    };


    this.clearProgressEvents = function()
    {
        this.vidPlayer.clearProgressEvents();
    };


    this.playVideoByID = function( _id )
    {
        this.vidPlayer.playVideoByID( _id );
    };


    /* VIDEO CONTROLLER METHODS */
    this.playVideo = function()
    {
        // startProcess();
        this.vidPlayer.playVideo();
    };


    this.pauseVideo = function()
    {
        stopProcess();
        this.vidPlayer.pauseVideo();
    };


    function startProcess()
    {
        animationFrame = new AnimationFrameUtil();
        animationFrame.setAnimation( scope, 100, 'processFrame' );
        animationFrame.startAnimation();
    }


    function stopProcess()
    {
        animationFrame.stopAnimation();
    }


    this.processFrame = function( data )
    {
        buffer.drawImage( this.video, 0, 0 );

        var image = buffer.getImageData( 0, 0, width, height );
        var imageData = image.data;
        var alphaData = buffer.getImageData( 0, height, width, height ).data;
        var length = imageData.length;

        for( var i = 3; i < length; i += 4 )
        {
            imageData[ i ] = alphaData[ i - 1 ];
        }

        output.putImageData( image, 0, 0, 0, 0, width, height );
    }
}