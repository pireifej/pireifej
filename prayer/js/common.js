$( document ).ready(function() {
    window.god = window.god || {};

    // text - display text
    // type - success, info, warning, error
    god.notify = function(text, type) {
	$.notify(text, { position: "top center", className: type });
    }

    // god functions
    god.init = function () {	
	// load all request for this user
	god.setUserDetails();
	
	// site wide configuration
	$("#copyright").html("&#169; prayerforus.com");
	$("#title").html("Pray For Us - Prayer Social Network");
    }

    god.categories = {};
    $.urlParam = function(name){
	console.log(window.location.href);
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) return null;
	return results[1] || 0;
    }

    god.setUserDetails = function() {
	var userId = localStorage.getItem("userId");
	var userRealName = localStorage.getItem("userRealName");
	var userTitle = localStorage.getItem("userTitle");
	var userLocation = localStorage.getItem("userLocation");
	var userAbout = localStorage.getItem("userAbout");
	var userCreated = localStorage.getItem("userCreated");
	console.log("setUserdetails");
	console.log(userRealName);
	$('*[id*=user-name]').each(function() {
	    console.log("setting ... " + userRealName);
	    $(this).html(userRealName);
	});
	$('*[id*=user-title]').each(function() {
	    $(this).html(userTitle);
	});
	$('*[id*=user-location]').each(function() {
	    $(this).html(userLocation);
	});
	$('*[id*=user-about]').each(function() {
	    $(this).html(userAbout);
	});
	$('*[id*=user-created]').each(function() {
	    $(this).html(userCreated);
	});
    }

    window.afterGetAllRequests = function(response) {
	console.log("common.js: afterGetAllRequests success");
	god.insertRequests(response);
    }

    god.setUser = function(user) {
	localStorage.setItem("userId", user.user_id);
	localStorage.setItem("userRealName", user.real_name);
	localStorage.setItem("userTitle", user.user_title);
	localStorage.setItem("userLocation", user.location);
	localStorage.setItem("userAbout", user.user_about);
	localStorage.setItem("userCreated", god.getFormattedTimestamp(user.timestamp));
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

    god.insertRequests = function(response) {
	$("#requests").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.result.length + " Requests");
	for (var i = 0; i < response.result.length; i++) {
	    var request = response.result[i];
	    var date = god.getFormattedTimestamp(request.timestamp);

	    htmlPost += " <div>";
	    htmlPost += "    <div class='tr-section feed'>";
	    htmlPost += "    	<div class='tr-post'>";
	    htmlPost += "    	<div class='entry-header'>";
	    htmlPost += "    	<div class='entry-thumbnail'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid' src='img/blog/8.jpg' alt='Image'></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='post-content'>";
	    htmlPost += "    	<div class='author-post'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid rounded-circle' src='img/users/8.jpg' alt='Image'></a>";
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
	    htmlPost += "    	<li><i class='fa fa-comments'></i>134</li>&nbsp;";
	    htmlPost += "            <li><i class='fa fa-heart-o'></i>45</li>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='continue-reading pull-right'>";
	    htmlPost += "    	<a href='javascript:void(0)' onclick='window.deleteRequest(" + request.request_id + ")'>Delete <i class='fa fa-angle-right'></i></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += " </div>";
	}
	$("#requests").html(htmlPost);
    }

    god.sendQuery = function(params) {
	url = "callSendQuery.php";

	// get time zone
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	params["tz"] = tz;

	if (!params["command"]) return;

	// get user ID
	var userId = localStorage.getItem("userId");

	var exceptions = { "createUser": true, "login": true };
	if (!exceptions[params["command"]] && !userId) {
	    if (window.location.href.includes("https://pireifej.com/prayer/login.html")) return;
	    if (window.location.href.includes("https://pireifej.com/prayer/profile-edit.html")) return;
	    window.location.href = "login.html?access=true";
	    return;
	}
	
	params["userId"] = userId;
	
	$.ajax({
	    type: 'GET',
	    url: url,
	    data: params,
	    cache: false,
	    dataType: 'jsonp',
	    jsonpCallback: params.jsonpCallback,
	    contentType: 'application/json; charset=utf-8;',
	    success: function(data) {
		console.log(params.command + ' success');
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

    	   $(".dual-nav").on('shown.bs.collapse',function(){
	       $(".dual-navv").collapse('show');
	   })
	   $(".dual-nav").on('hidden.bs.collapse',function(){
	       $(".dual-navv").collapse('hide');
	   })
});
