var Hawkmoon = (function() {

    'use strict';

	var version = 1,
		author = 'PadRpg',
		pending = null;
	/**
     * Variables Init
     */

    var init = function() {

    };

	/**
	 * Show help message
	 */
	var showHelp = function() {
		var content =
			'<div style="background-color: #FFF; border: 2px solid #000; box-shadow: rgba(0,0,0,0.4) 3px 3px; border-radius: 0.5em; margin-left: 2px; margin-right: 2px; padding-top: 5px; padding-bottom: 5px;">'
				+ '<div style="font-weight: bold; text-align: center; border-bottom: 2px solid black;">'
					+ '<span style="font-weight: bold; font-size: 125%">TrackerJacker v'+version+'</span>'
				+ '</div>'
				+ '<div style="padding-left: 5px; padding-right: 5px; overflow: hidden;">'
					+ '<div style="font-weight: bold;">'
						+ '!tj -help'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Display this message'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -start'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Start/Pause the tracker. If not started starts; if active pauses; if paused, resumes. Behaves as a toggle.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -stop'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Stops the tracker and clears all status effects.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -clear'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Stops the tracker as the -stop command, but in addition clears the turnorder'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -pause'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Pauses the tracker.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -reset [round#]'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Reset the tracker\'s round counter to the given round, if none is supplied, it is set to round 1.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -addstatus [name]:[duration]:[direction]:[message]'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Add a status to the group of selected tokens, if it does not have the named status.'
					+ '</li>'
					+ '<li style="padding-left: 20px;">'
						+ '<b>name</b> name of the status.'
					+ '</li>'
					+ '<li style="padding-left: 20px;">'
						+ '<b>duration</b> duration of the status (numeric).'
					+ '</li>'
					+ '<li style="padding-left: 20px;">'
						+ '<b>direction</b> + or - direction (+# or -#) indicating the increase or decrease of the the status\' duration when the token\'s turn comes up.'
					+ '</li>'
					+ '<li style="padding-left: 20px;">'
						+ '<b>message</b> optional description of the status. If dice text, ie: 1d4 exist, it\'ll roll this result when the token\'s turn comes up.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -removestatus [name]'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Remove a status from a group of selected tokens given the name.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -edit'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Edit statuses on the selected tokens'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -addfav [name]:[duration]:[direction]:[message]'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Add a favorite status for quick application to selected tokens later.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!tj -listfavs'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Displays favorite statuses with options to apply or edit.'
					+ '</li>'
					+ '<br>'
					+ '<div style="font-weight: bold;">'
						+ '!eot'
					+ '</div>'
					+ '<li style="padding-left: 10px;">'
						+ 'Ends a player\'s turn and advances the tracker if the player has control of the current turn\'s token. Player usable command.'
					+ '</li>'
				+ '</div>'
   			+ '</div>';

		sendFeedback(content);
	};

	/**
	 * Handle chat message event
	 */
	var handleChatMessage = function(msg) {
		var args = msg.content,
			senderId = msg.playerid,
			selected = msg.selected;

		if (msg.type === 'api'
		&& playerIsGM(senderId)
		&& args.indexOf('!hm') === 0) {
            args = args.replace('!hm','').trim();
            if (args.indexOf('-ca') === 0) {

            } else if (args.indexOf('-help') === 0) {
				showHelp();
			} else {
				sendFeedback('<span style="color: red;">Invalid command " <b>'+msg.content+'</b> "</span>');
				showHelp();
			}
        }
    };

	/**
	 * Handle turn order change event
	 */
	var handleChangeCampaignTurnorder = function(obj,prev) {
		handleAdvanceTurn(obj.get('turnorder'),prev.turnorder);
	};

	/**
	 * Send public message
	 */
	var sendPublic = function(msg) {
		if (!msg)
			{return undefined;}
		var content = '/desc ' + msg;
		sendChat('',content);
	};

	/**
	* Fake message is fake!
	*/
	var sendFeedback = function(msg) {
		var content = '/w GM '
				+ msg;

		sendChat('',content);
	};

	/**
	 * Register and bind event handlers
	 */
	var registerAPI = function() {
		on('chat:message',handleChatMessage);
		on('change:campaign:turnorder',handleChangeCampaignTurnorder);
		on('change:campaign:initiativepage',handleChangeCampaignInitativepage);
	};

	return {
		init: init,
		registerAPI: registerAPI
	};

}());

on("ready", function() {
	'use strict';
	Hawkmoon.init();
	Hawkmoon.registerAPI();
});
