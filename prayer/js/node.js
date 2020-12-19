$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    var categories = [];
    god.init();
    var pray = $.urlParam("pray");

    if (pray) {
	god.notify("Prayer completed.", "success");
    }
    getRequestFeed();
    god.getCategories("afterGetCategories");

    $("#headerImage").css("margin-bottom", "50px");
    $("#headerImage").css("background", "linear-gradient(rgba(34, 34, 34, 0.7), rgba(34, 34, 34, 0.7)), url('img/blog/FULL.jpg') no-repeat center center");
    $("#headerImage").css("background-color: #777777");
    $("#headerImage").css("background-attachment", "scroll");
    $("#headerImage").css("-webkit-background-size", "cover");
    $("#headerImage").css("-moz-background-size", "cover");
    $("#headerImage").css("-o-background-size", "cover");
    $("#headerImage").css("background-size", "cover");
    
    $("#quickRequestPost").click(function() {
	var categoryId = null;
	for (var i = 0; i < categories.length; i++) {
	    if (categories[i].category_name == "general") {
		categoryId = categories[i].category_id;
		break;
	    }
	}

	var text = $("#quickRequestText").val();
	console.log(text);

	if (!text) {
	    god.notify("Quick request needs a message", "error");
	    return;
	}

	$("#quickRequestPost").html("Posting now ...");
	$("#quickRequestPost").prop("disabled", true);
	
	params = {
	    command: 'createRequest',
	    jsonpCallback: 'afterQuickCreateRequest',
	    requestText: "\"" + $("#quickRequestText").val() + "\"",
	    requestTitle: "quick request",
	    requestCategoryId: categoryId
	};
	god.sendQuery(params);
    })

    function getRequestHtml(requestId, requestDate, categoryName, requestTitle, requestText, prayerCount, realName, picture) {
	var htmlPost = "";
	htmlPost += " <div>";
	htmlPost += "    <div class='tr-section feed'>";
	htmlPost += "    	<div class='tr-post'>";
	htmlPost += "    	<div class='entry-header'>";
	htmlPost += "    	<div class='entry-thumbnail'>";
	htmlPost += "    	<a href='#'><img class='img-fluid' src='img/requests/" + categoryName + ".jpg' alt='Image'></a>";
	htmlPost += "    	</div>";
	htmlPost += "    	</div>";
	htmlPost += "    	<div class='post-content'>";
	htmlPost += "    	<div class='author-post'>";
	htmlPost += "    	<a href='#'><img class='img-fluid rounded-circle' src='" + picture + "' alt='Image'></a>";
	htmlPost += "    	</div>";
	htmlPost += "    	<div class='entry-meta'>";
	htmlPost += "    	<ul>";
	htmlPost += "    	<li><a href='#'>" + realName + "</a></li>";
	htmlPost += "    	<li>" + requestDate + "</li>";
	htmlPost += "    	<li><i class='fa fa-align-left'></i>&nbsp;" + categoryName + " </li>";
	htmlPost += "    	</ul>";
	htmlPost += "    	</div>";
	htmlPost += "    	<div class='read-more'>";
	htmlPost += "    	<div class='feed pull-left'>";
	htmlPost += "    	<ul>";
	htmlPost += "    	</ul>";
	htmlPost += "    	</div>";
	htmlPost += "    	<h2><a href='#' class='entry-title'>" + requestTitle + "</a></h2>";
	htmlPost += "    	<p>" + requestText + "</p>";
	htmlPost += "    	<div class='read-more'>";
	htmlPost += "    	<div class='feed pull-left'>";
	htmlPost += "    	<ul>";
	htmlPost += "    	<li><i class='fa fa-handshake-o'></i>" + prayerCount + "</li>&nbsp;";
//	htmlPost += "            <li><i class='fa fa-heart-o'></i>45</li>";
	htmlPost += "    	</ul>";
	htmlPost += "    	</div>";
	htmlPost += "    	<div class='continue-reading pull-right'>";
	htmlPost += "    	<a href='pray.html?requestId=" + requestId + "'>Pray for me <i class='fa fa-angle-right'></i></a>";
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
	} else {

	}
	return htmlPost;
    }

    function insertRequestFeed(response) {
	console.log("insertRequestFeed...");
	$("#request-feed").empty();
	var htmlPost = "";
	var nbrRequests = response.result.length;
	$("#nbrRequests").html(nbrRequests + " Requests");

	if (nbrRequests == 0) {
	    $("#request-feed").html("<h5>You prayed for everyone! Check back later.</h5>");
	    return;
	}
	
	for (var i = 0; i < response.result.length; i++) {
	    console.log(response.result[i]);
	    var request = response.result[i];
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
	    htmlPost += getRequestHtml(request.request_id, date, request.category_name, request.request_title, request.request_text, request.prayer_count, request.real_name, request.picture);
	}
	$("#request-feed").html(htmlPost);
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
	    jsonpCallback: 'afterGetRequestFeed'
	};
	god.sendQuery(params);
    }

    window.afterGetCategories = function(response) {
	console.log("afterGetCategories success");
	categories = response.result;
	console.log(response);
    };

    window.afterGetRequestFeed = function(response) {
	console.log('afterGetRequestFeed success');
	console.log(localStorage.getItem("userId"));
	console.log(response);
	insertRequestFeed(response);
    }
    
    window.afterGetPrayer = function(response) {
	console.log('afterGetPrayer success');
	console.log(response);
    }

    window.afterQuickCreateRequest = function(response) {
	console.log('quickCreateRequest success');
	console.log(response);
	$("#quickRequestText").val("");
	god.notify("Quick request created.", "success");
    }
});
