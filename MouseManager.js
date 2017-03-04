/**
 * Created by nkatz on 7/17/15.
 */

function MouseEventManager( _target )
{
    "use strict";

    this.debug = false;

    var scope = this;
    var btnList = {};
    var target = _target;
    var eventTypes = {
        tap:"touchstart",
        click:"click",
        over:"mouseover",
        out:"mouseout",
        enter:"mouseenter",
        leave:"mouseleave",
        move:"mousemove",
        down:"mousedown",
        up:"mouseup"
    };
    var isDisabled = false;
    
    
    this.addButton = function( _scope, _btnName, _click, _over, _out, _enter, _leave, _down, _up )
    {
        if( !btnList ) btnList = {};
        btnList[_btnName] = { scope:_scope, click:_click, mouseover:_over, mouseout:_out, mouseenter:_enter, mouseleave:_leave, mousedown:_down, mouseup:_up };
    };
    
    
    this.addButtonByClass = function( _scope, _class, _click, _over, _out, _enter, _leave, _down, _up )
    {
        var element;
        var elements = document.getElementsByClassName( _class );
        for( var index in elements )
        {
            element = elements[index];
            if( !element || !element.id ) continue;

            this.addButton( _scope, element.id, _click, _over, _out, _enter, _leave, _down, _up );
        }
    };
    
    
    this.addButtons = function( _scope, _btns, _click, _over, _out, _enter, _leave, _down, _up  )
    {
        if( !_btns || _btns.length == 0 ) return;
    
        var btn;
        var length = _btns.length;
    
        for( var i = 0; i < length; i++ )
        {
            btn = _btns[i];
            if( !btn ) continue;
    
            this.addButton( _scope, btn, _click, _over, _out, _enter, _leave, _down, _up );
        }
    };
    
    
    this.removeButton = function( _id )
    {
        delete btnList[_id];
    };
    
    
    this.removeButtons = function( _ids )
    {
        if( !_ids || _ids.length == 0 ) return;
    
        var length = _ids.length;
        for( var i = 0; i < length; i++ )
        {
            this.removeButton( _ids[i] );
        }
    };


    this.disableBtns = function()
    {
        isDisabled = true;
        removeListeners();
    };


    this.enableBtns = function()
    {
        isDisabled = false;
        setListeners();
    };
    
    
    function setListeners()
    {
        target.addEventListener( eventTypes.click,   handleMouseEvent, false );
        target.addEventListener( eventTypes.over,    handleMouseEvent, false );
        target.addEventListener( eventTypes.out,     handleMouseEvent, false );
        target.addEventListener( eventTypes.enter,   handleMouseEvent, false );
        target.addEventListener( eventTypes.leave,   handleMouseEvent, false );
        target.addEventListener( eventTypes.down,    handleMouseEvent, false );
        target.addEventListener( eventTypes.up,      handleMouseEvent, false );
    }


    function removeListeners()
    {
        target.removeEventListener( eventTypes.click,    handleMouseEvent, false );
        target.removeEventListener( eventTypes.over,     handleMouseEvent, false );
        target.removeEventListener( eventTypes.out,      handleMouseEvent, false );
        target.removeEventListener( eventTypes.enter,    handleMouseEvent, false );
        target.removeEventListener( eventTypes.leave,    handleMouseEvent, false );
        target.removeEventListener( eventTypes.down,     handleMouseEvent, false );
        target.removeEventListener( eventTypes.up,       handleMouseEvent, false );
    }


    function handleMouseEvent( e )
    {
        if( isDisabled ) return;

        var btn = e.target;
        var btnId = btn.id;
        var event = e.type;

        if( !btnList || !btnId || btnId == "" || !event ) return;

        if( btnList[btnId] && btnList[btnId][event] )
        {
            btnList[btnId].scope[btnList[btnId][event]]( btn, e );
        }

        if( scope.debug ) console.log( "\n\nMOUSE EVENT MANAGER ::: BTN "+event.toUpperCase()+" ::: ID: ", btnId, "    BTN: ", btn, "\n\n" );
    }

    this.enableBtns();
}
