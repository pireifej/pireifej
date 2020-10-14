$( document ).ready(function() {
    window.god = window.god || {};

    var userId = "";

    god.categories = {};

    $.urlParam = function(name){
	console.log(window.location.href);
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
    }

    god.login = function() {
	var encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase');
	var plaintexte = encrypted.toString();
	var decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

	params = {
	    command: 'login',
	    jsonpCallback: 'afterLogin',
	    email: 'pireifej@gmail.com',
	    password: '0c523f47a325e1a8f163f81e93fff45b'
	};
	god.sendQuery(params);
    }

    window.afaterEmail = function(response) {
	console.log("afterEmail success");
	console.log(response);
    }

    	window.afterLogin = function(response) {
	    console.log('afterLogin success');
	    console.log(response);
	    var user = response[0];
	    god.userId = user.user_id;
	    console.log(user);
	    $('*[id*=user-name]').each(function() {
		$(this).html(user.real_name);
	    });
	    $('*[id*=user-title]').each(function() {
		$(this).html(user.user_title);
	    });
	    $('*[id*=user-location]').each(function() {
		$(this).html(user.location);
	    });
	    $('*[id*=user-about]').each(function() {
		$(this).html(user.user_about);
	    });
	    $('*[id*=user-created]').each(function() {
		$(this).html(god.getFormattedTimestamp(user.timestamp));
	    });
	    god.getAllRequests();
	}

        god.getAllRequests = function() {
	params = {
	    command: 'getAllRequests',
	    jsonpCallback: 'afterGetAllRequests',
	    userId: god.userId
	};
	god.sendQuery(params);
    }

    god.getFormattedTimestamp = function(timestamp) {
	var timestamp = timestamp.split("T");
	var date = timestamp[0];
	var time = timestamp[1];
	var times = time.split(":");
	var hour = parseInt(times[0]);
	var amOrPM = "AM";
	if (hour > 12) {
	    hour -= 12;
	    amOrPM = "PM"
	}
	time = hour + ":" + times[1] + " " + amOrPM;
	date = date + " " + time;
	return date;
    }

    god.sendQuery = function(params) {
	var url = "https://198.12.248.83:8001/";
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	params["tz"] = tz;
	$.ajax({
	    type: 'POST',
	    url: url,
	    data: params,
	    cache: false,
	    dataType: 'jsonp',
	    jsonpCallback: params.jsonpCallback,
	    jsonp: false,
	    contentType: 'application/json; charset=utf-8;',
	    success: function(data) {
		console.log('success');
		console.log(data);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus + ': ' + params.command);
	    }
	});
    }

    god.getCategories = function(callback) {
	params = {
	    command: 'getCategories',
	    jsonpCallback: callback
	};
	god.sendQuery(params);
    }
});
