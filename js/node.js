$( document ).ready(function() {
    var url = "http://198.12.248.83:8080/";
    var params = {
	command: "createUser",
	jsonpCallback: "afterCreateUser",
	userName: "testUserName",
	email: "testEmail",
	realName: "testRealName",
	location: "testLocation",
	password: "testPassword"
    };
    sendQuery(params);

    params = {
	command: "createRequest",
	jsonpCallback: "afterCreateRequest",
	userId: "123",
	requestText: "Pray for my family."
    };
    sendQuery(params);

    function sendQuery(params) {
	$.ajax({
	    type: "POST",
	    url: url,
	    data: params,
	    cache: false,
	    dataType: "jsonp",
	    jsonpCallback: params.jsonpCallback,
	    jsonp: false,
	    contentType: "application/json; charset=utf-8;",
	    success: function(data) {
		console.log("success");
		console.log(data);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log('error ' + textStatus + " " + errorThrown);
	    }
	});

	window.afterCreateUser = function(response) {
	    console.log('createUser success');
	    console.log(response);
	};

	window.afterCreateRequest = function(response) {
	    console.log('createRequest success');
	    console.log(response);
	}
    }
});
