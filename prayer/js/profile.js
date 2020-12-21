$( document ).ready(function() {
    window.god = window.god || {};
    var login = $.urlParam('login');
    var create = $.urlParam('create');
    var deleted = $.urlParam('deleted');
    var name = $.urlParam("name");
    var updated = $.urlParam("updated");
    var help = $.urlParam("help");
    var requestIds = [];
        
    getPrayerCount();
    getMyRequests();

    if (help) {
	god.notify("Help is on it's way!.", "success");
    }
    if (updated) {
	god.notify("Profile updated.", "success");
    }
    if (login) {
	god.notify("Welcome back!", "success");
    }
    if (create) {
	god.notify("Request created.", "success");
    }
    if (deleted) {
	god.notify("Request deleted.", "success");
    }

    window.afterGetPrayerCount = function(response) {
	console.log("afterGetPrayerCount success");
	var count = response.result[0]["COUNT(*)"];
	$("#nbrPrayers").html(count + " Prayers");
    }

    window.afterGetMyRequests = function(response) {
	console.log("profile.js: afterGetMyRequests success");
	console.log(response);
	insertRequests(response.result);
	god.init();

	var params = {
	    command: 'getPeopleWhoPrayed',
	    jsonpCallback: 'afterGetPeopleWhoPrayed',
	    requestId: requestIds.join(",")
	};
        god.sendQuery(params);
    }

    window.deleteRequest = function(requestId) {
	$.confirm({
	    text: "Are you sure you want to delete your request?",
	    confirmButton: "Yes",
	    cancelButton: "No",
	    post: true,
	    confirmButtonClass: "btn-danger",
	    cancelButtonClass: "btn-default",
	    dialogClass: "modal-dialog modal-lg",
	    confirm: function() {
		params = {
		    command: 'deleteRequest',
		    jsonpCallback: 'afterDeleteRequest',
		    requestId: requestId
		};
		god.sendQuery(params);
	    },
	    cancel: function() {
		// nothing to do
	    }
	});
    }

    window.afterGetPeopleWhoPrayed = function(response) {
	console.log("profile.js: afterGetPeopleWhoPrayed success");
	if (!response.result.length) return;
	var requestId = response.result[0].request_id;
	console.log("requestId = " + requestId);
	var requests = {};
	for (var i = 0; i < response.result.length; i++) {
	    if (!requests[response.result[i].request_id]) requests[response.result[i].request_id] = [];
	    requests[response.result[i].request_id].push(response.result[i].real_name);
	}
	console.log(requests);

	for (var key in requests) {
	    var people = requests[key];
	    var peopleText = "";
	    if (people.length > 1) {
		people[people.length - 1] = "and " + people[people.length - 1];
		peopleText = people.join(", ");
	    } else peopleText = people[0];
	    $("#people-who-prayed-" + key).html(people.length + "&nbsp;<i class='fa fa-handshake-o'>&nbsp;" + peopleText + " prayed for you.</i>");
	}
//	
	//var html = "<div id='people-who-prayed-" + requestId + "'>";
//	html += "<i class='fa fa-handshake-o'>&nbsp;" + response.result.length  + "</i>";
//	$("#people-who-prayed-" + response.result).html("Paul Ireifej");
    }

    window.afterDeleteRequest = function(response) {
	console.log("profile.js: afterDeleteRequest success");
	console.log(response);
	window.location.href = "profile.html?deleted=true";

//	console.log(globalRequests);
//	$("#nbrRequests").html(globalRequests.length-1 + " Requests");
	//insertRequests(globalRequests);
//	god.notify("Request deleted.", "success");
    };

    $("#delete").confirm({
	text: "Are you sure you want to delete that comment?",
	title: "Confirmation required",
	confirm: function(button) {
	    //delete();
	},
	cancel: function(button) {
	    // nothing to do
	},
	confirmButton: "Yes I am",
	cancelButton: "No",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-default",
	dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
    });

    function getPrayerCount() {
	params = {
	    command: 'getPrayerCount',
	    jsonpCallback: 'afterGetPrayerCount'
	};
	god.sendQuery(params);
    }

    function getMyRequests() {
	var params = {
	    command: 'getMyRequests',
	    jsonpCallback: 'afterGetMyRequests'
	};
	god.sendQuery(params);
    }

    function insertRequests(requests) {
	requestIds = [];
	var htmlPost = "";
	$("#nbrRequests").html(requests.length + " Requests");
	for (var i = 0; i < requests.length; i++) {
	    var request = requests[i];
	    var date = god.getFormattedTimestamp(request.timestamp);

	    htmlPost += " <div id='" + request.request_id + "'>";
	    htmlPost += "    <div class='tr-section feed'>";
	    htmlPost += "    	<div class='tr-post'>";
	    htmlPost += "    	<div class='entry-header'>";
	    htmlPost += "    	<div class='entry-thumbnail'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid' src='img/requests/" + request.category_name + ".jpg' alt='Image'></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='post-content'>";
	    htmlPost += "    	<div class='author-post'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid rounded-circle' name='userpic' id='user-picture' alt='Image'></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='entry-meta'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "    	<li><a href='#'>" + request.request_id + "</a></li>";
	    htmlPost += "    	<li>" + date + "</li>";
	    htmlPost += "    	<li><i class='fa fa-align-left'></i>&nbsp;" + request.category_name + " </li>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='read-more'>";
	    htmlPost += "    	<div class='feed pull-left'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<h2><a href='#' class='entry-title'>" + request.request_title + "</a></h2>";
	    htmlPost += "    	<p>" + request.request_text + "</p>";
	    htmlPost += "    	<div class='read-more'>";
	    htmlPost += "    	<div class='feed pull-left'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "<div id='" + request.request_id + "'></div>";
	    htmlPost += "    	</ul>";
	    htmlPost += "                        <div id='people-who-prayed-" + request.request_id + "'>";
            htmlPost += "                  <i class='fa fa-handshake-o'>&nbsp;" + request.prayer_count + "</i>";
	    htmlPost += "</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='continue-reading pull-right'>";
	    htmlPost += "    	<a href='javascript:void(0)' onclick='window.deleteRequest(" + request.request_id + ")'>Delete <i class='fa fa-angle-right'></i></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += " </div>";

	    if (god.getEnv() == "prod") {
		    htmlPost += "<script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'></script>";
		    htmlPost += "<ins class='adsbygoogle'";
		    htmlPost += "style='display:block'";
		    htmlPost += "data-ad-format='fluid'";
		    htmlPost += "data-ad-layout-key='-6t+ed+2i-1n-4w'";
		    htmlPost += "data-ad-client='ca-pub-3440306279423513'";
		    htmlPost += "data-ad-slot='3204220014'></ins>";
		    htmlPost += "<script>";
		    htmlPost += "(adsbygoogle = window.adsbygoogle || []).push({});";
		    htmlPost += "</script>";
	    }
	    requestIds.push(request.request_id);
	}
	$("#requests").html(htmlPost);
    }

    $("#edit-profile").click(function() {
	console.log("edit profile!");
	window.location.href = "profile-edit.html";
    });
})
