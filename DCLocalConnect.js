/**
 * Created by nkatz on 7/19/16.
 */

function DCLocalConnect( _isParent )
{
	var isParent = _isParent;
	var events = {};
	var connection;
	var channels;


	this.addEvent = function( _scope, _event, _callback )
	{
		if( !events ) events = {};

		var eventVo      = new EventVO();
		eventVo.event    = _event;
		eventVo.callback = _callback;
		eventVo.scope    = _scope;

		if( !events[ _event ] ) events[ _event ] = [];
		events[ _event ].push( eventVo );
	};


	this.sendMessage = function( _msg )
	{
		connection.send( _msg );
	};


	this.connect = function( _channel )
	{
		connection.connectToChannel( _channel );
	};


	this.createChannel = function( _channel )
	{
		connection.openChannels( _channel );
	};


	this.disconnect = function( _channel )
	{
		// not sure if i even need this.
	};


	function init()
	{
		connection = isParent ? new localconnect.LocalConnectParent() : new localconnect.LocalConnectChild();
		connection.addEventListener( localconnect.EventType.CONNECTED, 			connectedHandler );
		connection.addEventListener( localconnect.EventType.MESSAGE_RECEIVED, 	messageReceivedHandler );
		connection.addEventListener( localconnect.EventType.TIMEOUT, 			timeoutHandler );
	}


	function timeoutHandler()
	{
		fireEvent( DCLocalConnect.CONNECT_TIMEOUT );
	}


	function connectedHandler()
	{
		fireEvent( DCLocalConnect.CONNECT_CONNECTED );
	}


	function messageReceivedHandler( event )
	{
		console.log( "\n\n\n---------------------------------");
		console.log( "COMPONENT MESSAGE RECIEVED" );
		console.log( event.message );
		console.log( event.data );
		console.log( event );
		console.log( "---------------------------------\n\n\n");

		fireEvent( DCLocalConnect.CONNECT_MSG_RECIEVED, event.message );
	}


	function fireEvent( _event, _data )
	{
		var eventList = events[ _event ];
		var eventVo;

		for( var index in eventList )
		{
			eventVo = eventList[ index ];
			if( !eventVo.hasOwnProperty( 'callback' )) continue;
			eventVo.scope[ eventVo.callback ]( { type: eventVo.event, data: _data } );
		}
	}


	function EventVO()
	{
		this.event    = '';
		this.scope    = '';
		this.callback = '';
	}

	init();
}


DCLocalConnect.CONNECT_TIMEOUT = "timeOut";
DCLocalConnect.CONNECT_CONNECTED = "connected";
DCLocalConnect.CONNECT_MSG_RECIEVED = "msgRecieved";
