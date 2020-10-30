$( document ).ready(function() {
    window.god = window.god || {};
    var login = $.urlParam('login');
    var create = $.urlParam('create');

    if (login) {
	god.notify("Welcome back, " + localStorage.getItem("userRealName"), "success");
    }
    if (create) {
	god.notify("Request created.", "success");
    }
    
    god.init();
    getPrayerCount();
    getMyRequests();

    window.afterGetPrayerCount = function(response) {
	console.log("afterGetPrayerCount success");
	console.log(response);
	var count = response.result[0]["COUNT(*)"];
	$("#nbrPrayers").html(count + " Prayers");
    }

    window.afterGetMyRequests = function(response) {
	console.log("profile.js: afterGetMyRequests success");
	insertRequests(response);
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

    window.afterDeleteRequest = function(response) {
	console.log("profile.js: afterDeleteRequest success");
	console.log(response);
	getMyRequests();
	god.notify("Request deleted.", "success");
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

    function insertRequests(response) {
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
	    htmlPost += "    	<a href='#'><img class='img-fluid' src='img/requests/" + request.category_name + ".jpg' alt='Image'></a>";
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
	    htmlPost += "    	<li><i class='fa fa-handshake-o'></i>" + request.prayer_count + "</li>&nbsp;";
//	    htmlPost += "            <li><i class='fa fa-heart-o'></i>45</li>";
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
})
