$( document ).ready(function() {
    window.god = window.god || {};
    
    var params = {};
    var userId = "";
    var requestId = $.urlParam('requestId');
    
    god.login();
    getRequest();
    getPrayer();

    window.afterGetRequest = function(response) {
	console.log("afterGetRequest success");
	console.log(response);
	var request = response[0];
	$("#request-title").html(request.request_title);
	$("#request-timestamp").html(god.getFormattedTimestamp(request.timestamp));
    }
    
    function getRequest() {
	params = {
	    command: 'getRequest',
	    jsonpCallback: 'afterGetRequest',
	    requestId: requestId
	};
	god.sendQuery(params);
    }

    function getPrayer() {
	params = {
	    command: 'getPrayer',
	    jsonpCallback: 'afterGetPrayer',
	    category: 'healing'
	};
	god.sendQuery(params);
    }

    function prayFor() {
	params = {
	    command: 'prayFor',
	    jsonpCallback: 'afterPrayFor',
	    userId: userId,
	    requestId: '456'
	};
	sendQuery(params);
    }

	window.afterGetPrayer = function(response) {
	    console.log('afterGetPrayer success');
	    console.log(response);
	    var prayer = response[0];
	    $("#prayer-title").html(prayer.prayer_title);
	    var prayerLines = prayer.prayer_text.split("\n");
	    var prayerHtml = "";
	    for (var i = 0; i < prayerLines.length; i++) {
		prayerHtml += "<p>" + prayerLines[i] + "</p>";
	    }
	    $("#prayer").html(prayerHtml);
	    $("#prayer-category").html(prayer.category);
	}

	window.afterPrayFor = function(response) {
	    console.log('afterPrayFor success');
	    console.log(response);
	}
});
