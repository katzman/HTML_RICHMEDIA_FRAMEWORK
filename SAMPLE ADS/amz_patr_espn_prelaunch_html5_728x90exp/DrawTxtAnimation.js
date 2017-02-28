/*
 items:[{ element:div , svg:svg data string, time:.25}, { element:div , svg:svg data string, time:.25}]
 */

function DrawTxtAnimation( _id, _items )
{
    var id = _id;
    var items = _items;
    var itemsLength = items.length;
    var tl;
    var scope = this;

    // PUBLIC
    // =============================================================================
    // pauses animation
    this.pause = function()
    {
        tl.pause();
    };

    // resumes animation
    this.resume = function()
    {
        tl.resume();
    };

    // resets all the paths to 0 and plays the reveal animation.
    this.resetAndPlay = function()
    {
        this.showElement();
        drawPaths();
    };

    this.reset = function()
    {
        if( tl ) tl.kill();
        setPaths();
    };

    // hides the current image and sets the paths to 0.
    this.hideElement = function()
    {
        var item;
        for( var i = 0; i < itemsLength; i++ )
        {
            item = items[i];
            if( !item || !item.element ) continue;

            item.element.querySelector('.image').style.display = "none";
        }
    };


    // shows the current image and sets the paths to 0.
    this.showElement = function()
    {
        console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DRAW TEXT: SHOW ELEMENT: " + id );

        var item;
        for( var i = 0; i < itemsLength; i++ )
        {
            item = items[i];
            if( !item || !item.element ) continue;

            item.element.querySelector('.image').style.display = "block";
        }
    };


    // PRIVATE
    // =============================================================================
    // sets the svg to the passed div element and sets references for the strokes.
    function setSVG()
    {
        console.log( "DRAW SVG :: SET SWG :: " + id );

        var item;
        var maskId;

        for( var i = 0; i < itemsLength; i++ )
        {
            item = items[i];
            maskId = item.maskId || 'imageMask';

            if( !item || !item.element || !item.svg ) continue;

            // set image
            if( item.image ) item.svg = item.svg.split( "{image}" ).join( item.image );
            item.svg = item.svg.split( "{maskId}" ).join( maskId );

            // set paths
            item.paths = item.element.getElementsByClassName('strokes');

            item.element.style.pointerEvents = 'none';
            item.element.innerHTML = item.svg;
        }

        scope.hideElement();
    }

    // sets the strokes to 0 length, will hide the image.
    function setPaths()
    {
        console.log( "DRAW SVG :: SET PATHS :: " + id );

        var path;
        var item;

        for( var i = 0; i < itemsLength; i++ )
        {
            item = items[i];
            if( !item || !item.element ) continue;
            if( !item.paths ) continue;

            for( var c = 0; c < item.paths.length; c++ )
            {
                path = item.paths[c];
                if( !path ) continue;

                TweenLite.set( path, { drawSVG:0 });
            }
        }
    }

    // shows the drawing animation
    function drawPaths()
    {
        setPaths();
        scope.showElement();

        var path;
        var item;
        var time;
        var ease = Power1.easeOut;

        if( tl ) tl.clear();
        tl = null;
        tl = new TimelineLite({ onComplete:animationComplete });

        for( var i = 0; i < itemsLength; i++ )
        {
            item = items[i];
            if( !item || !item.element || !item.paths ) continue;

            for( var c = 0; c < item.paths.length; c++ )
            {
                path = item.paths[c];
                if( !path ) continue;

                time = item.time || .25;
                tl.fromTo( path, time, { drawSVG:0 }, { drawSVG:true, ease:ease });
            }
        }

        tl.play();
    }

    // fires when the animation is done, fires an event and passes the current animation id.
    function animationComplete()
    {
        NotificationManager.sendNotification( 'animationComplete', id );
    }

    setSVG();
    setPaths();
}