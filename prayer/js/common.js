$( document ).ready(function() {
    window.god = window.god || {};
    var categories = [];

    // text - display text
    // type - success, info, warning, error
    god.notify = function(text, type) {
	$.notify(text, { position: "bottom left", className: type });
    }

    // god functions
    god.init = function () {
	// load all request for this user
	var userId = localStorage.getItem("userId");
	god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

	if (userId) {
	    god.query("getUser", "afterGetUser", {}, true, true);
	    $("#login-button").hide();
	    $("#become-a-member").html("Edit Profile");
	    $("#login-button-mobile").hide();
	}

	// site wide configuration
	if (!userId) {
	    $("#header-notifications-text").hide();
	    $("#header-prayer-text").hide();
	    $("#header-requests-text").attr("src", "login.html");
	    $("#header-requests-text").html("Login");

	    $("#profile-button-mobile").hide();
	    $("#request-feed-button-mobile").hide();
	    $("#notification-button-mobile").hide();
	    $("#new-request-button-mobile").hide();
	    $("#login-button-mobile").show();
	    
	    $("#user-name").html("Welcome");
	    $('*[id*=user-picture]').each(function() {
		console.log("image..");
		console.log($(this));
		$(this).hide();
	    });
	    $("#user-pic-circle").hide();
	    $("#navigation").hide();
	    $("#user-notification").hide();
	    $("#request-feed").hide();
	    $("#login-button").show();
	}

	god.query("getNotifications", "afterGetNotifications", {}, true, true);
	god.getCategories("afterGetCategories");
	
	$("#copyright").html("&#169; prayerforus.com");
	$("#title").html("Pray For Us - Prayer Social Network");
    }

    window.submitQuickRequest = function() {
	var categoryId = null;
	for (var i = 0; i < categories.length; i++) {
	    if (categories[i].category_name == "general") {
		categoryId = categories[i].category_id;
		break;
	    }
	}

	var text = $('#quickRequestText').val();

	if (!text) {
	    god.notify("Quick request needs a message", "error");
	    return;
	}

	$("#quickRequestPost").prop("disabled", true);
	
	params = {
	    requestText: "\"" + $("#quickRequestText").val() + "\"",
	    requestTitle: "Quick Request",
	    requestCategoryId: categoryId
	};
	god.query("createRequest", "afterQuickCreateRequest", params, true, true);
    };

    god.categories = {};
    $.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) return null;
	return results[1] || 0;
    }

    god.makeId = function(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
    }

    // mode - feed or profile
    god.getHtmlPost = function(request, mode) {
	var date = god.getFormattedTimestamp(request.timestamp);

	var topLeft = (mode == "profile") ? request.request_id : request.real_name;
	var button = (mode == "profile") ? "<a href='javascript:void(0)' onclick='window.deleteRequest(" + request.request_id + ")'><span id='delete-button'>Delete</span> <i class='fa fa-angle-right' aria-hidden='true'></i></a>" : "<a href='pray.html?requestId=" + request.request_id + "'>Pray for me <i class='fa fa-angle-right'></i></a>";
	
	return "<div id='" + request.request_id + "'>    <div class='tr-section feed'>    	<div class='tr-post'>    	<div class='entry-header'>    	<div class='entry-thumbnail'>    	<a href='#'><img class='img-fluid' src='img/requests/" + request.category_name + ".jpg' alt='Image'></a>    	</div>    	</div>    	<div class='post-content'>    	<div class='author-post'>    	<a href='#'><img class='img-fluid rounded-circle' name='userpic' id='user-picture' alt='Image' src='" + request.picture + "'></a>    	</div>    	<div class='entry-meta'>    	<ul>    	<li><a href='#'>" + topLeft + "</a></li>    	<li>" + date + "</li>    	<li><i class='fa fa-align-left' aria-hidden='true'></i>&nbsp;" + request.category_name + " </li>    	</ul>    	</div>    	<div class='read-more'>    	<div class='feed pull-left'>    	<ul>    	</ul>    	</div>    	<h2><a href='#' class='entry-title'>" + request.request_title + " </a></h2>    	<p>" + request.request_text + " </p>    	<div class='read-more'>    	<div class='feed pull-left'>    	<ul><div id='" + request.request_id + "'></div>    	</ul>                        <div id='people-who-prayed-" + request.request_id + "'>" + request.prayer_count + "&nbsp;<i class='fa fa-handshake-o' aria-hidden='true'>&nbsp;</i></div>    	</div>    	<div class='continue-reading pull-right'>    	" + button + "    	</div>    	</div>    	</div>    	</div>    	</div> </div>";
    }

    god.getTimeAgo = function (time) {
        var thisTimestamp = time.replace(".000Z", "");
        var current = new Date().getTime();
        var prayedFor = new Date(thisTimestamp).getTime();
        var difference = current - prayedFor;

        var seconds = (current-prayedFor)/1000;
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var timeAgo = days + " days ago";

	if (days == 1) timeAgo = " yesterday";

        if (days == 0) {
            if (hours == 1) timeAgo = hours + " hour ago";
            else timeAgo = hours + " hours ago";
        }

        if (days == 0 && hours == 0) {
            if (minutes == 1) timeAgo = " minute ago";
            else timeAgo = minutes + " minutes ago";
        }

        if (days == 0 && hours == 0 && minutes == 0) {
            timeAgo = parseInt(seconds) + " just now";
        }
	return timeAgo;
    }

    window.afterGetCategories = function(response) {
	categories = response.result;
    };

    window.afterQuickCreateRequest = function(response) {
	$("#quickRequestText").val("");
	god.notify("Quick request created.", "success");
    }

    window.afterGetAllUsers = function(response) {
	var html = "<div class='active-profile-mobile' id='all-users-mobile'>";

	var users = response.result;
	for (var i = 0; i < users.length; i++) {
	    var user = users[i];
	    
	    html += "<div class='single-slide'>";
	    html += "<div class='profile-thumb active profile-active'>";
	    html += "<a href='user.html?userId=" + user.user_id + ">";
	    html += "<figure class='profile-thumb-small profile-active'>";
            html += "<img src='" + user.picture + "' alt='profile picture'>";
            html += "</figure>";
	    html += "</a>";
	    html += "</div>";
	    html += "</div>";
	    
	    var htmlDesktop = "";
	    htmlDesktop += "      <div class='single-slide'>";
	    htmlDesktop += "                                          <div class='profile-thumb active profile-active'>";
	    htmlDesktop += "                                                <a href='javascript:void(0)'>";
	    htmlDesktop += "                                                   <figure class='profile-thumb-small'>";
	    htmlDesktop += "                                                        <img src='" + user.picture + "' alt='profile picture'>";
	    htmlDesktop += "                                                   </figure>";
	    htmlDesktop += "                                               </a>";
	    htmlDesktop += "                                           </div>";
	    htmlDesktop += "                                        </div>";
	    $("#all-users-desktop").append(htmlDesktop);
	}
	html += "</div>";

	$("#all-users-mobile").html(html);

    }

    window.afterGetNotifications = function(response) {
	$("#notifications").empty();
	$("#notifications-mobile").empty();
	var htmlNotifications = "";
	var htmlNotificationsMobile = "";

	for (var i = 0; i < response.result.length; i++) {
	    var notice = response.result[i];
	    var timeAgo = god.getTimeAgo(notice.timestamp);
	    
	    htmlNotifications += "<li class='msg-list-item d-flex justify-content-between'>";
            htmlNotifications += "<!-- profile picture end -->";
	    htmlNotifications += "<div class='profile-thumb'>";
	    htmlNotifications += + "<figure class='profile-thumb-middle'>";
	    htmlNotifications += "<img src='" + notice.picture + "' alt='profile picture' class='notice-picture'>";
	    htmlNotifications += "</figure>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- profile picture end -->";
	    htmlNotifications += "<!-- message content start -->";
	    htmlNotifications += "<div class='msg-content notification-content'>";
	    htmlNotifications += "<a href='user.html?userId=" + notice.user_id + "'>" + notice.real_name + "</a> ";
	    htmlNotifications += "<p>prayed for '" + notice.request_title + "'.</p>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- message content end -->";
	    htmlNotifications += "<!-- message time start -->";
	    htmlNotifications += "<div class='msg-time'>";
	    htmlNotifications += "<p>" + timeAgo + "</p>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- message time end -->";
	    htmlNotifications += "</li>";

	    htmlNotificationsMobile += "                                <li>";
	    htmlNotificationsMobile += "                                    <div class='frnd-request-member'>";
	    htmlNotificationsMobile += "                                        <figure class='request-thumb'>";
	    htmlNotificationsMobile += "                                            <a href='profile.html'>";
	    htmlNotificationsMobile += "                                                <img style='width: 75px; height: 75px' src='" + notice.picture + "' alt='proflie author'>";
	    htmlNotificationsMobile += "                                            </a>";
	    htmlNotificationsMobile += "                                        </figure>";
	    htmlNotificationsMobile += "                                        <div class='frnd-content'>";
	    htmlNotificationsMobile += "                                            <p class='author-subtitle'><a href='user.html?userId=" + notice.user_id + "'>" + notice.real_name + "</a> prayed for '" + notice.request_title + "'.</p>";
	    htmlNotificationsMobile += "                                            <div class='request-btn-inner'>";
	    htmlNotificationsMobile += "<p>" + timeAgo + "</p>";
//	    htmlNotificationsMobile += "                                                <button class='frnd-btn'>confirm</button>";
//	    htmlNotificationsMobile += "                                                <button class='frnd-btn delete'>delete</button>";
	    htmlNotificationsMobile += "                                            </div>";
	    htmlNotificationsMobile += "                                        </div>";
	    htmlNotificationsMobile += "                                    </div>";
	    htmlNotificationsMobile += "                                </li>";
	}

	htmlNotifications = htmlNotifications.replaceAll("NaN", "");
	$("#notifications").html(htmlNotifications);
	$("#notifications-mobile").html(htmlNotificationsMobile);
    }

    window.goToRequestFeed = function() {
	window.location.href = "request-feed.html";
    }

    window.afterGetUser = function(response) {
	var user = response.result[0];

	var logout = $.urlParam('signout')
	if (logout) return;

	// set edit profile form
	$("[name=username]").val(user.user_name);
	$("[name=password]").val("");
	$("[name=email]").val(user.email);
	$("[name=location]").val(user.location);
	$("[name=reason]").val("");
	$("[name=title]").val(user.user_title);
	$("[name=about]").val(user.user_about);
	$("[name=name]").val(user.real_name);

	// set user details on screen header, requests, elsewhere
	$('*[id*=real-name]').each(function() {
	    $(this).html(user.real_name);
	});
	$('*[id*=user-name]').each(function() {
	    $(this).html(user.user_name);
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
	$('*[id*=user-picture]').each(function() {
	    $(this).attr("src", user.picture);
	});
	$('*[id*=profile-link]').each(function() {
	    $(this).attr("href", "user.html?userId="+user.user_id);
	});
	$('*[id*=my-email-address]').each(function() {
	    $(this).html(user.email);
	});
    }

    window.afterGetAllRequests = function(response) {
	god.insertRequests(response);
    }

    god.getEnv = function() {
	return (window.location.href.includes("prayer-test") ? "test" : "prod");
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

	var dateVals = date.split("-");
	var year = dateVals[0];
	var month = dateVals[1];
	var day = dateVals[2];

	var dayArray = day.split(" ");
	day = dayArray[0];

	if (month == 1) month = "January";
	if (month == 2) month = "February";
	if (month == 3) month = "March";
	if (month == 4) month = "April";
	if (month == 5) month = "May";
	if (month == 6) month = "June";
	if (month == 7) month = "July";
	if (month == 8) month = "August";
	if (month == 9) month = "September";
	if (month == 10) month = "October";
	if (month == 11) month = "November";
	if (month == 12) month = "December";

	return month + " " + day + ", " + year + " @ " + time;
	//return date;
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

    // commandName - command name to send to nodejs/sendQuery
    // jsonpCallback - function to callback after query returns with a response
    // params - object that includes key/value parameters for query
    // includeUserId - do you want to include current user ID?
    // includeTimeZone - do you want to include client time zone?
    god.query = function(commandName, jsonpCallback, params, includeUserId, includeTimeZone) {
	params = (!params) ? {} : params;
	if (!commandName) return;
	if (!jsonpCallback) return;

	params["command"] = commandName;
	params["jsonpCallback"] = jsonpCallback;
	
	if (includeTimeZone) {
	    // get time zone
	    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	    params["tz"] = tz;
	}

	// redirect to login screen if user is not already logged on
	var userId = localStorage.getItem("userId");
	// exceptions are creating a user, logging in, contact the website for help
	var exceptions = { "createUser": true, "login": true, "email": true, "help" :true };
	if (!exceptions[params["command"]] && !userId) {
	    if (window.location.href.includes("login.html")) return;
	    if (window.location.href.includes("profile-edit.html")) return;
	    if (window.location.href.includes("contact.html")) return;
	    if (window.location.href.includes("index.html")) return;
	    window.location.href = "login.html?access=true";
	    return;
	}
	
	if (includeUserId) {
	    params["userId"] = userId;
	}

	god.sendQuery(params);
    }

    god.sendQuery = function(params) {
	console.log(params["command"]);
	console.log(params);

	$.ajax({
	    type: "GET",
	    url: "callSendQuery.php",
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
	god.query("getCategories", callback, {}, false, true);
    }

    $(".dual-nav").on('shown.bs.collapse',function(){
	$(".dual-navv").collapse('show');
    })
    $(".dual-nav").on('hidden.bs.collapse',function(){
	$(".dual-navv").collapse('hide');
    })
});
