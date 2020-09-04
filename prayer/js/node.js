$( document ).ready(function() {
    var url = "http://198.12.248.83:8080/";
    var params = {};
    var userId = "";

    login();
    getAllRequests();

    function getAllRequests() {
	params = {
	    command: "getAllRequests",
	    jsonpCallback: "afterGetAllRequests",
	    userId: "123"
	};
	sendQuery(params);
    }

    function createUser() {
	params = {
	    command: "createUser",
	    jsonpCallback: "afterCreateUser",
	    userName: "testUserName",
	    email: "testEmail",
	    realName: "testRealName",
	    location: "testLocation",
	    password: "testPassword"
	};
	sendQuery(params);
    }

    function createRequest() {
	params = {
	    command: "createRequest",
	    jsonpCallback: "afterCreateRequest",
	    userId: "123",
	    requestText: "Pray for my family."
	};
	sendQuery(params);
    }

    function prayFor() {
	params = {
	    command: "prayFor",
	    jsonpCallback: "afterPrayFor",
	    userId: "123",
	    requestId: "456"
	};
	sendQuery(params);
    }

    function login() {
	var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
	var plaintexte = encrypted.toString();
	var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

	params = {
	    command: "login",
	    jsonpCallback: "afterLogin",
	    email: "testEmail",
	    password: "f20a88be9d55d6931c69a89f32c5dc4f"
	};
	sendQuery(params);
    }

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

	window.afterPrayFor = function(response) {
	    console.log("afterPrayFor success");
	    console.log(response);
	}

	window.afterLogin = function(response) {
	    console.log("afterLogin success");
	    console.log(response);
	    user = response.user_id;
	}
    }
});
