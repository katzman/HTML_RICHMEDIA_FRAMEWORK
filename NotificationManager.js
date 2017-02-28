﻿NotificationManager = {};NotificationManager.interestObj = {};NotificationManager.regisiterNotificationInterest = function( interest, callBack, scope ){	if( !this.interestObj[interest] ) this.interestObj[interest] = [];	this.interestObj[interest].push({ callback:callBack, scope:scope });};NotificationManager.regisiterNotificationInterests = function( interests, callBack, scope ){	var length = interests.length;	var interest;	for( var i = 0; i < length; i++ )	{		interest = interests[i];		this.regisiterNotificationInterest( interest, callBack, scope );	}};NotificationManager.sendNotification = function( interest, data ){	if( !this.interestObj[interest] || this.interestObj[interest].length == 0 )	{		//console.log( "!!!ERROR :: SEND NOTIFICATION FIRED WITH UNREGISTERED NOTIFICATION VALUE" );		return;	}	var length = this.interestObj[interest].length;	var scope;	var callBack;	var eventObj;	var returnObj = {};	for( var i = 0; i < length; i++ )	{		if( !this.interestObj || !this.interestObj[interest] ) break;		if( !this.interestObj[interest][i] ) continue;		eventObj = this.interestObj[interest][i];		callBack = eventObj.callback;		scope = eventObj.scope;		if( !scope[callBack] ) continue;		returnObj.interest = interest;		returnObj.data = data;		if( callBack != null ) scope[callBack]( returnObj );	}};NotificationManager.removeNotificationInterest = function( interest, callBack, scope ){	if( !this.interestObj[interest] || this.interestObj[interest].length == 0 )	{		console.log( "!!!ERROR :: REMOVE NOTIFICATION FIRED WITH UNSET NOTIFICATION VALUE" );		return;	}	var length = this.interestObj[interest].length;	var obj;	for( var i = 0; i < length; i++ )	{		obj = this.interestObj[interest][i];		if( obj.scope === scope && obj.callback === callBack )		{			this.interestObj[interest].splice( i, 1 );			break;		}	}};NotificationManager.removeNotificationInterests = function( interests, callBack, scope ){	var length = interests.length;	var interest;	for( var i = 0; i < length; i++ )	{		interest = interests[i];		this.removeNotificationInterest( interest, callBack, scope );	}};// destroyNotificationManager.destroy = function(){	this.interestObj = null;};