$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var thisUserId = $.urlParam('userId');
    if (thisUserId) {
	god.query("getThisUser", "afterGetThisUser", {thisUserId: thisUserId}, false, true);
    }

    god.query("getAllUsers", "afterGetAllUsers", {}, false, true);
    god.query("getMyRequests", "afterGetMyRequests", {"userId":thisUserId}, false, true);
    god.query("getPrayerCount", "afterGetPrayerCount", {"userId":thisUserId}, false, true);
    god.query("getPrayerHistory", "afterGetPrayerHistory", {"userId":thisUserId}, false, true);

    window.afterGetThisUser = function(response) {
	$("#my-picture").attr("src", response.result[0].picture);
	$("#my-title").html(response.result[0].user_title);
	$("#my-about").html(response.result[0].user_about);
	$("#my-name").html(response.result[0].real_name);
	$("#my-location").html(response.result[0].location);
    }

    window.afterGetPrayerHistory = function(response) {
	var html = "";
	for (var i = 0; i < response.result.length; i++) {
	    var prayer = response.result[i];
	    html += "		   <div class='col-lg-4 col-md-6'>";
	    html += "	     <div class='card-box widget-user'>";
	    html += "	       <div>";
	    html += "		 <img src='" + prayer.picture + "' class='img-fluid rounded-circle' alt='user'>";
	    html += "		 <div class='wid-u-info'>";
	    html += "		   <h4 class='m-t-0 m-b-5 font-600'>" + prayer.real_name + "</h4>";
	    html += "		   <p class='text-muted m-b-5 font-13'>" + prayer.request_title + "</p>";
//	    html += "		   <small class='text-warning'><b>Follow</b></small>";
	    html += "		 </div>";
	    html += "	       </div>";
	    html += "	     </div>";
	    html += "	   </div>";
	}
	$( html ).insertAfter("#prayers");
    }

    window.afterGetAllUsers = function(response) {
	$("#no-users").html(response.result.length);
    }

    window.afterGetMyRequests = function(response) {
	$("#no-requests").html(response.result.length);
	var html = "";
	for (var i = 0; i < response.result.length; i++) {
	    var request = response.result[i];
	    html += "		   <div class='col-lg-4 col-md-6'>";
	    html += "	     <div class='card-box widget-user'>";
	    html += "	       <div>";
	    html += "		 <img src='img/requests/" + request.category_name + ".jpg' class='img-fluid rounded-circle' alt='user'>";
	    html += "		 <div class='wid-u-info'>";
	    html += "		   <h4 class='m-t-0 m-b-5 font-600'>" + request.request_title + "</h4>";
	    html += "		   <p class='text-muted m-b-5 font-13'>" + request.request_text + "</p>";
//	    html += "		   <small class='text-warning'><b>Follow</b></small>";
	    html += "		 </div>";
	    html += "	       </div>";
	    html += "	     </div>";
	    html += "	   </div>";
	}
	$( html ).insertAfter("#requests");
    }

    window.afterGetPrayerCount = function(response) {
	$("#no-prayers").html(response.result[0]["COUNT(*)"]);
    }
});
