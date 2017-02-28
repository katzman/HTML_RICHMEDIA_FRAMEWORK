/**
 * Created by nkatz on 5/3/16.
 */
function MobileDetectMovement()
{
	var x = 0;
	var y = 0;
	var z = 0;

	var alpha = 0;
	var beta = 0;
	var gamma = 0;

	var compass = 0;

	var propList = {};
	var listenersSet = false;

	this.addPropListener = function( _scope, _callback )
	{
		if( !propList ) propList = {};

		propList.scope = _scope;
		propList.callback = _callback;

		setListeners();
	};

	function setListeners()
	{
		if( listenersSet ) return;
		listenersSet = true;

		if( window.DeviceMotionEvent == undefined )
		{
			console.log( "DEVICE MOTION EVENTS NOT SUPPORTED ON THIS DEVICE" );
			return;
		}

		window.ondevicemotion = motionEventHandler;
	}

	function motionEventHandler( e )
	{
		console.log( e );

		x = e.accelerationIncludingGravity.x;
		y = e.accelerationIncludingGravity.y;
		z = e.accelerationIncludingGravity.z;

		if( e.rotationRate )
		{
			alpha = e.rotationRate.alpha;
			beta = e.rotationRate.beta;
			gamma = e.rotationRate.gamma;
		}

		//if( e.webkitCompassHeading )
		//{
			// Apple works only with this, alpha doesn't work
			compass = e.webkitCompassHeading;
		//}

		//console.log( "" );
		//console.log( "" );
		//console.log( "MOTIION EVENT FIRED X: " + x );
		//console.log( "MOTIION EVENT FIRED Y: " + y );
		//console.log( "MOTIION EVENT FIRED Z: " + z );
		//
		//console.log( "MOTIION EVENT FIRED ALPHA: " + alpha );
		//console.log( "MOTIION EVENT FIRED BETA: " + beta );
		//console.log( "MOTIION EVENT FIRED GAMMA: " + gamma );
		//console.log( "" );
		//console.log( "" );

		fireCallback();
	}

	function fireCallback()
	{
		var scope  = propList.scope;
		var callback = propList.callback;
		var returnObj = {};

		if( !scope || !callback )
		{
			console.log( "ERROR :: NO SCOPE OR CALLBACK VALUE PASSED" );
		}

		returnObj.x = x;
		returnObj.y = y;
		returnObj.z = z;

		returnObj.alpha = alpha;
		returnObj.beta = beta;
		returnObj.gamma = gamma;

		returnObj.compass = compass;

		scope[callback]( returnObj );
	}
}


/**
 * Limits the value to minimum of A, maximum of B
 * @param value - Your bounded variable
 * @param a - Minimum amount
 * @param b - Maximum amount
 * @example myNumber = clamp( 150, 0, 100 ) // returns 100
 */
function clamp( value, a, b )
{
	return ( value < a ) ? a : (( value > b ) ? b : value );
}

/**
 * Linear interpolation between 2 values
 * @param value - Number between 0 - 1
 * @param min - Minimum amount
 * @param max - Maximum amount
 * @example rotation = lerp(0.5, 0, 360) // returns 180
 */
function lerp( value, min, max )
{
	return (max - min) * value + min;
}

/**
 * Returns a normalized value between 0 - 1
 * @param value - Any number
 * @param min - Minimum amount
 * @param max - Maximum amount
 * @example percent = normalize(50, 0, 100) // returns 0.5
 */
function normalize( value, min, max )
{
	return (value - min) / (max - min);
}

/**
* Remaps your variable to a different range
* @param value - Your value that ranges between min1 and max1
* @param min1 - Original range's minimum
* @param max1 - Original range's maximum
* @param min2 - New range's minimum
* @param max2 - New range's maximum
* @example loaded = map(0.5, 0, 1, 0, 100) // returns 50
*/
function map( value, min1, max1, min2, max2 )
{
	return lerp( normalize(value, min1, max1), min2, max2);
}
