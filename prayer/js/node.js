$( document ).ready(function() {
    window.god = window.god || {};
    
    var params = {};

    god.login();
    getRequestFeed();

    window.openForm = function() {
	$("#newRequest").css("display", "block");
    }

    window.closeForm = function() {
	$("#newRequest").css("display", "none");
    }

    $("#newRequestForm").submit(function(e) {
	console.log("CREATE");
	e.preventDefault();
	window.closeForm();

	var formValues = $("#newRequestForm").serializeArray();

	params = {
	    command: 'createRequest',
	    jsonpCallback: 'afterCreateRequest',
	    userId: god.userId,
	    requestText: formValues[1].value,
	    requestTitle: formValues[0].value
	};
	god.sendQuery(params);
    })

    $("#form").submit(function(e) {
	e.preventDefault();

	var formValues = $("#form").serializeArray();
	var params = {
	    command: 'createUser',
	    jsonpCallback: 'afterCreateUser',
	    userName: formValues[0].value,
	    password: formValues[1].value,
	    email: formValues[2].value,
	    realName: formValues[3].value,
	    location: formValues[4].value,
	    title: formValues[6].value,
	    about: formValues[7].value
	};
	god.sendQuery(params);
    })

    $("#edit-profile").click(function() {
	window.location.href = "profile-edit.html";
    });

    function insertRequests(response) {
	console.log("insertRequests...");
	$("#requests").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.length + " Requests");
	for (var i = 0; i < response.length; i++) {
	    var request = response[i];
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
	    htmlPost += "    	<li><i class='fa fa-align-left'></i>&nbsp;" + request.request_id + " Min Read</li>";
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

    function insertRequestFeed(response) {
	console.log("insertRequestFeed...");
	$("#request-feed").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.length + " Requests");
	for (var i = 0; i < response.length; i++) {
	    var request = response[i];
	    var timestamp = request.timestamp.split("T");
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
	    htmlPost += "    	<li><i class='fa fa-align-left'></i>&nbsp;" + request.request_id + " Min Read</li>";
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
	    htmlPost += "    	<a href='pray.html?requestId=" + request.request_id + "'>Pray for me <i class='fa fa-angle-right'></i></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += " </div>";
	}
	$("#request-feed").html(htmlPost);
    }

    window.deleteRequest = function(requestId) {
	params = {
	    command: 'deleteRequest',
	    jsonpCallback: 'afterDeleteRequest',
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

    function getRequestFeed() {
	params = {
	    command: 'getRequestFeed',
	    jsonpCallback: 'afterGetRequestFeed',
	    userId: god.userId
	};
	god.sendQuery(params);
    }

    function prayFor() {
	params = {
	    command: 'prayFor',
	    jsonpCallback: 'afterPrayFor',
	    userId: god.userId,
	    requestId: '456'
	};
	god.sendQuery(params);
    }

	window.afterGetRequestFeed = function(response) {
	    console.log('afterGetRequestFeed success');
	    console.log(response);
	    insertRequestFeed(response);
	}

	window.afterGetPrayer = function(response) {
	    console.log('afterGetPrayer success');
	    console.log(response);
	}
	window.afterCreateUser = function(response) {
	    console.log('createUser success');
	    console.log(response);
	    alert("Thanks! Profile is created.");
	    $("#form")[0].reset();
	};

	window.afterCreateRequest = function(response) {
	    console.log('createRequest success');
	    window.location.href = "index.html";
	    console.log(response);
	    god.getAllRequests();
	}

	window.afterPrayFor = function(response) {
	    console.log('afterPrayFor success');
	    console.log(response);
	}

	window.afterGetAllRequests = function(response) {
	    console.log("afterGetAllRequests success");
	    insertRequests(response);
	}

	window.afterDeleteRequest = function(response) {
	    console.log("afterDeleteRequest success");
	    console.log(response);
	    god.getAllRequests();
	};
});
