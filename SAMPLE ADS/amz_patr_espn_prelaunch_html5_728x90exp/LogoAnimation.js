/**
 * Created by wildlife009 on 1/24/17.
 */


function LogoAnimation( _id, _element )
{
    var P;
    var A;
    var Ta;
    var I;
    var R;
    var O;
    var Tb;

    var id = _id;
    var letters = [];
    var tl;

    var LOGO = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2536.5 427.5" 27.5">' +
        '<path id="P" d="M307.2,139.4c0,21.9-4.9,41.5-14.7,58.8c-9.8,17.3-23.3,31.9-40.5,43.6c-17.2,11.7-37.5,20.7-60.8,26.9c-23.4,6.2-48.6,9.2-75.8,9.2l-10.8,0l-0.2,139.4L0,417.1L0.7,4.5l122.2,0.2c26.7,0,51.4,2.8,74.1,8.2c22.7,5.4,42.2,13.6,58.5,24.6c16.3,11,29,24.9,38.1,41.9C302.8,96.2,307.3,116.3,307.2,139.4z M206.7,139.9c0.1-38-27.7-57-83.3-57.1l-18.5,0l-0.2,117.1l17.2,0c27.6,0,48.6-5.3,63-16C199.4,173.1,206.6,158.4,206.7,139.9z"/>' +
        '<path id="A" d="M601,338.1l-162.3-0.2l-26.2,79.9l-107.6-0.2L463.4,5.2L578,5.3l157.2,412.9l-107.6-0.2L601,338.1zM465.5,257.4l108.8,0.2L520.6,83.3L465.5,257.4z"/>' +
        '<path id="Ta" d="M1068.7,6.1l-0.1,80.5l-113.9-0.2l-0.5,332.1l-104.4-0.2l0.5-332.1l-113.9-0.2l0.1-80.5L1068.7,6.1z"/>' +
        '<path id="R" d="M1360.5,256.9c28.4-10.7,50.6-26.4,66.6-47c15.9-20.6,23.9-44.8,24-72.5c0-22.3-4.6-41.6-13.9-58c-9.3-16.3-22.2-29.9-38.8-40.6c-16.5-10.8-36-18.8-58.5-24.3c-22.5-5.4-46.9-8.1-73.2-8.2l-134.9-0.2l-0.7,412.6l104.4,0.2l0.2-143.1l19.1,0l116.3,143.3l128.6,0.2L1360.5,256.9z M1326.5,213.9l-51.3-38.2l-50.6,38.2l18.5-60l-49.5-36.6l62.4-1.1l19.2-60.8l19.9,61.1l63.2,0.4l-51,36.6L1326.5,213.9z"/>' +
        '<path id="I" d="M1658.1,419.6l-104.4-0.2l0.7-412.6L1658.8,7L1658.1,419.6z"/>' +
        '<path id="O" d="M2170.2,214.1c0,29.3-5,56.9-14.8,82.7c-9.8,25.8-23.9,48.4-42.4,67.8c-18.5,19.4-41.1,34.7-67.9,46.1c-26.8,11.3-57.3,17-91.7,16.9c-34.4-0.1-65-5.8-92-17.2c-26.9-11.4-49.6-26.8-68-46.3c-18.4-19.4-32.4-42.1-41.9-67.9c-9.5-25.8-14.2-53.4-14.2-82.7c0-29.3,4.9-56.9,14.5-82.7c9.6-25.8,23.6-48.4,42.1-67.8c18.5-19.4,41.2-34.7,68.2-46.1c27-11.3,57.6-17,92-16.9c34.4,0.1,64.9,5.8,91.6,17.2c26.7,11.4,49.3,26.8,67.7,46.3c18.4,19.4,32.5,42.1,42.2,67.9C2165.4,157.2,2170.2,184.8,2170.2,214.1z M1953.6,347c18.2,0,34.4-3.2,48.4-9.8c14-6.6,25.8-15.8,35.4-27.5c9.6-11.8,16.7-25.8,21.4-42.1c4.7-16.3,7.1-34.2,7.1-53.6c0-19.4-2.3-37.3-6.9-53.6c-4.6-16.3-11.7-30.4-21.3-42.2c-9.5-11.8-21.3-21-35.3-27.6c-14-6.6-30.1-10-48.4-10c-18.7,0-34.9,3.3-48.7,9.8c-13.8,6.6-25.5,15.8-35.1,27.5c-9.6,11.8-16.7,25.8-21.4,42.1c-4.7,16.3-7.1,34.2-7.1,53.6c0,19.4,2.3,37.3,6.9,53.6c4.6,16.3,11.7,30.4,21.3,42.2c9.5,11.8,21.2,21,35,27.6C1918.7,343.6,1934.9,346.9,1953.6,347z"/>' +
        '<path id="Tb" d="M2536.5,8.3l-0.1,80.5l-113.9-0.2l-0.5,332.1l-104.4-0.2l0.5-332.1l-113.9-0.2l0.1-80.5L2536.5,8.3z"/>' +
        '</svg>';


    // PUBLIC
    // =============================================================================
    // pauses animation
    this.pause = function()
    {
        if( tl ) tl.pause();
    };

    // resumes animation
    this.resume = function()
    {
        if( tl ) tl.resume();
    };

    // resests all the paths to 0 and plays the reveal animation.
    this.resetAndPlay = function()
    {
        setPaths();
        drawPaths();
    };

    // hides the current image and sets the paths to 0.
    this.reset = function()
    {
        if( tl ) tl.kill();
        setPaths();
    };


    // PRIVATE
    // =============================================================================
    // sets the svg to the passed div element and sets references for each letter.
    function setSVG()
    {
        _element.style.pointerEvents = 'none';
        _element.innerHTML = LOGO;

        P = _element.querySelector( "#P" );
        A = _element.querySelector( "#A" );
        Ta = _element.querySelector( "#Ta" );
        R = _element.querySelector( "#R" );
        I = _element.querySelector( "#I" );
        O = _element.querySelector( "#O" );
        Tb = _element.querySelector( "#Tb" );

        letters = [P, A, Ta, R, I, O, Tb];
    }

    // sets the strokes to 0 length, will hide the image.
    function setPaths()
    {
        TweenLite.set( _element, { autoAlpha:0 });

        for( var i = 0; i < letters.length; i++ )
        {
            TweenLite.set( letters[i], { autoAlpha:0 });
        }
    }

    // shows the drawing animation
    function drawPaths()
    {
        TweenLite.set( _element, { autoAlpha:1 });
        tl = new TimelineLite({ onComplete:animationComplete });

        tl.to( Ta, 0, { autoAlpha:1 });
//        tl.to( O, 0, { autoAlpha:1 }, '+=.4');
        tl.to( A, 0, { autoAlpha:1 }, '+=.4');
        tl.to( R, 0, { autoAlpha:1 }, '+=.4');
        tl.to( I, 0, { autoAlpha:1 }, '+=.4');
        tl.to( Tb, 0, { autoAlpha:1 }, '+=.4');
        tl.to( P, 0, { autoAlpha:1 }, '+=.4');
        tl.play();
    }

    // fires when the animation is done, fires an event and passes the current animation id.
    function animationComplete()
    {
        NotificationManager.sendNotification( 'logoComplete', id );
    }

    setSVG();
    setPaths();
}




