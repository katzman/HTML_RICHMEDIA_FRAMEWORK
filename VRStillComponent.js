/**
 * Created by nkatz on 7/23/15.
 */


function VRStillComponent()
{
    console.log( "VR STILL COMP CONST CALLED" );

    var manualControl;
    var longitude;
    var latitude;
    var savedX;
    var savedY;
    var savedLongitude;
    var savedLatitude;
    var imagePath;

    // THREE ELEMENTS
    var renderer;
    var vrTarget;
    var camera;
    var scene;
    var controls;
    var image;
    
    var viewWidth;
    var viewHeight;
    var scope = this;
    var animationFrame;
    var isMobile = false;


    this.setValues = function( _vrTarget, _imagePath, _viewWidth, _viewHeight )
    {
        THREE.ImageUtils.crossOrigin = '*';

        manualControl  = false;
        longitude      = 100;
        latitude       = 0;
        savedX         = 0;
        savedY         = 0;
        savedLongitude = 0;
        savedLatitude  = 0;

        viewWidth  = _viewWidth;
        viewHeight = _viewHeight;

        imagePath = _imagePath;
        vrTarget = _vrTarget;

        image = new THREE.TextureLoader().load( imagePath, imageLoaded );
    };


    this.updateViewSize = function( _viewWidth, _viewHeight )
    {
        viewWidth  = _viewWidth;
        viewHeight = _viewHeight;
    };


    this.destroy = function()
    {

    };


    this.startProcess = function()
    {
        animationFrame = new AnimationFrameUtil();
        animationFrame.setAnimation( this, 60, 'processFrame' );
        animationFrame.startAnimation();
    };


    this.stopProcess = function()
    {
        animationFrame.stopAnimation();
    };


    this.processFrame = function()
    {
        controls.update();
        renderer.render( scene, camera );
    };


    this.controlsUpdated = function( _data )
    {
        console.log( "CONTROLS UPDATED", _data );
    };


    function setView()
    {
        camera        = new THREE.PerspectiveCamera( 60, viewWidth / viewHeight, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 500, 16, 8 );
        geometry.scale( -1, 1, 1 );

        var material = new THREE.MeshBasicMaterial({ map:image });
        var mesh     = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( viewWidth, viewHeight );
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top      = 0;
        vrTarget.appendChild( renderer.domElement );

        setControls();
    }


    function setControls()
    {
        controls = new DeviceOrientationController( camera, renderer.domElement, viewWidth, viewHeight );
        controls.addEvent( scope, DeviceOrientationController.MANUAL_CONTROL_START, "controlsUpdated" );
        controls.addEvent( scope, DeviceOrientationController.MANUAL_CONTROL_END, "controlsUpdated" );
        controls.connect();
    }


    function imageLoaded( _data )
    {
        console.log( "IMAGE LOADED", _data );
        setView();
        scope.startProcess();
    }


    function onResize()
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}