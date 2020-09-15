$( document ).ready(function() {
    var url = "http://198.12.248.83:8080/";
    var params = {};
    var userId = "";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    getAllRequests();

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
	    userId: '123',
	    requestText: formValues[1].value,
	    requestTitle: formValues[0].value
	};
	sendQuery(params);
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
	sendQuery(params);
    })

    function insertRequests(response) {
	console.log("insertRequests...");
	$("#requests").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.length + " Requests");
	for (var i = 0; i < response.length; i++) {
	    var request = response[i];
	    console.log(request);
	    var date = new Date(request.timestamp);
	    
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
	    htmlPost += "    	<li><a href='#'>" + request.user_id + "</a></li>";
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

    window.deleteRequest = function(requestId) {
	params = {
	    command: 'deleteRequest',
	    jsonpCallback: 'afterDeleteRequest',
	    requestId: requestId
	};
	sendQuery(params);
    }

    function getAllRequests() {
	params = {
	    command: 'getAllRequests',
	    jsonpCallback: 'afterGetAllRequests',
	    userId: '123'
	};
	sendQuery(params);
    }

    function prayFor() {
	params = {
	    command: 'prayFor',
	    jsonpCallback: 'afterPrayFor',
	    userId: '123',
	    requestId: '456'
	};
	sendQuery(params);
    }

    function login() {
	var encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase');
	var plaintexte = encrypted.toString();
	var decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

	params = {
	    command: 'login',
	    jsonpCallback: 'afterLogin',
	    email: 'testEmail',
	    password: 'f20a88be9d55d6931c69a89f32c5dc4f'
	};
	sendQuery(params);
    }

    function sendQuery(params) {
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
		console.log('error ' + textStatus + ' ' + errorThrown);
	    }
	});

	window.afterCreateUser = function(response) {
	    console.log('createUser success');
	    console.log(response);
	    alert("Thanks! Profile is created and shit.");
	    $("#form")[0].reset();
	};

	window.afterCreateRequest = function(response) {
	    console.log('createRequest success');
	    console.log(response);
	    getAllRequests();
	}

	window.afterPrayFor = function(response) {
	    console.log('afterPrayFor success');
	    console.log(response);
	}

	window.afterLogin = function(response) {
	    console.log('afterLogin success');
	    console.log(response);
	    user = response.user_id;
	}

	window.afterGetAllRequests = function(response) {
	    console.log("afterGetAllRequests success");
	    insertRequests(response);
	}

	window.afterDeleteRequest = function(response) {
	    console.log("afterDeleteRequest success");
	    console.log(response);
	    getAllRequests();
	};
    }
});
