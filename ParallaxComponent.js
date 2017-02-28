/**
 * Created by nkatz on 1/14/16.
 */

function ParallaxComponent()
{
	var elementList = [];
	var isEnabled = false;

    this.destroy = function()
    {

    };

    this.addElement = function( _id, _xChange, _yChange, _speed )
    {
        if( !elementList ) elementList = [];

        var element = document.getElementById(_id);
        if( !element )
        {
            console.log( "!!!ERROR :: PARALLAX COMPONENT ADD ELEMENT CALLED WITH NO VALID ID/ELEMENT" );
            return;
        }

        elementList.push( { element:element, xChange:_xChange, yChange:_yChange, speed:_speed });
    };


    this.enable = function( _enable )
    {
		isEnabled = _enable;
    };
}





