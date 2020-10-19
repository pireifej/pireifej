$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    getRequestFeed();
    god.getCategories("afterGetCategories");

    $("#newRequestForm").submit(function(e) {
	console.log("CREATE");
	e.preventDefault();

	var formValues = $("#newRequestForm").serializeArray();
	var category = formValues[1].value;

	for (var i = 0; i < god.categories.length; i++) {
	    if (god.categories[i].category_name == category) {
		categoryId = god.categories[i].category_id;
		break;
	    }
	}

	params = {
	    command: 'createRequest',
	    jsonpCallback: 'afterCreateRequest',
	    requestText: "\"" + formValues[2].value + "\"",
	    requestTitle: "\"" + formValues[0].value + "\"",
	    requestCategoryId: categoryId
	};
	console.log(params);
	god.sendQuery(params);
    })

    $("#quickRequestPost").click(function() {
	for (var i = 0; i < god.categories.length; i++) {
	    if (god.categories[i].category_name == "general") {
		categoryId = god.categories[i].category_id;
		break;
	    }
	}
	
	params = {
	    command: 'createRequest',
	    jsonpCallback: 'afterQuickCreateRequest',
	    requestText: "\"" + $("#quickRequestText").val() + "\"",
	    requestTitle: "quick request",
	    requestCategoryId: categoryId
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

    function getRequestHtml(requestId, requestDate, categoryName, requestTitle, requestText) {
	var htmlPost = "";
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
	htmlPost += "    	<li><a href='#'>" + requestId + "</a></li>";
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
	htmlPost += "    	<li><i class='fa fa-comments'></i>134</li>&nbsp;";
	htmlPost += "            <li><i class='fa fa-heart-o'></i>45</li>";
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
	return htmlPost;
    }

    function insertRequestFeed(response) {
	console.log("insertRequestFeed...");
	$("#request-feed").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.result.length + " Requests");
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
	    htmlPost += getRequestHtml(request.request_id, date, request.category_name, request.request_title, request.request_text);
	}
	$("#request-feed").html(htmlPost);
    }

    $("#login").submit(function(e) {
	e.preventDefault();
	console.log("login");
	var formValues = $("#login").serializeArray();
	console.log(formValues);
	var username = formValues[0].value;
	var password = formValues[1].value;

	if (!username || !password) {
	    alert("Enter both!");
	    return;
	}
	
//	var encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase');
//	var plaintexte = encrypted.toString();
//	var decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
//	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

	params = {
	    command: 'login',
	    jsonpCallback: 'afterLogin',
	    userName: username,
	    password: password
	};
	god.sendQuery(params);
    })


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

    window.afterGetRequestFeed = function(response) {
	console.log('afterGetRequestFeed success');
	console.log(localStorage.getItem("userId"));
	console.log(response);
	insertRequestFeed(response);
    }

    window.afterGetCategories = function(response) {
	console.log('afterGetCategories success');
	var categoryHtml = "";
	for (var i = 0; i < response.result.length; i++) {
	    categoryHtml += "<option>" + response.result[i].category_name + "</option>";
	}
	$("#category-options").html(categoryHtml);
	god.categories = response.result;
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
	    window.location.href = "profile.html";
	    god.getAllRequests();
	}

    	window.afterQuickCreateRequest = function(response) {
	    console.log('quickCreateRequest success');
	    console.log(response);
	    $("#quickRequestText").val("");
	}
});
