$( document ).ready(function() {
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
	FB.init({
	    appId: '820853052173991',
	    version: 'v2.7' // or v2.1, v2.2, v2.3, ...
	});
	$('#loginbutton,#feedbutton').removeAttr('disabled');
	FB.getLoginStatus(updateStatusCallback);
    });
    
    window.god = window.god || {};
    var user = $.urlParam('user');
    var access = $.urlParam('access');
    var facebookId = null;
    
    god.init();
    if (user) {
	god.notify("New user profile created.", "success");
    }
//    if (access) {
//	god.notify("Need to login first.", "error");
//    }
    
    if (localStorage.getItem("userId")) {
	window.location.href = "profile.html";
    }

    window.forgot = function() {
	var params = {
	    email: "pireifej@gmail.com",
	    realName: "Forgot Password!"
	};
	god.query("forgotPassword", "afterForgot", params, false, true);
    }

    $("#login").submit(function(e) {
	e.preventDefault();
	console.log("login");
	var formValues = $("#login").serializeArray();
	console.log(formValues);
	var username = formValues[0].value;
	var password = formValues[1].value;

	if (!username || !password) {
	    god.notify("Both username and password are required.", "error");
	    return;
	}
	
	params = {
	    userName: username,
	    password: password
	};
	god.query("login", "afterLogin", params, false, true);
    })

    
    window.checkLoginState = function() {
	FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	});
    }

    window.statusChangeCallback = function(response) {
	console.log(response);
	console.log("great");

	var userId = response.authResponse.userID;
	console.log(userId);

	/* make the API call */
	FB.api(
	    "/" + userId + "/",
	    function (response) {
		console.log("Response!");
		console.log(response);
		if (response && !response.error) {
		    /* handle the result */
		    facebookId = response.id;
		    var params = {
			userName: "'" + response.id + "'",
			password: "facebook",
			email: "facebook",
			realName: response.name,
			location: "facebook",
			title: "facebook",
			about: "facebook",
			picture: "facebook"
		    };

		    god.query("createUser", "afterCreateUser", params, false, true);
		}
	    }
	);
    }

    // maybe not used?
    window.updateStatusCallback = function(response) {
	console.log(response);
    }

    window.afterCreateUser = function(response) {
	console.log(response);
	if (response.result.code == "ER_DUP_ENTRY") {
	    var params = {
		userName: facebookId,
		password: "facebook"
	    };
	    god.query("login", "afterLogin", params, false, true);
	}
    }

    window.afterForgot = function(response) {
	$("#forgot").hide();
	god.notify("Help is on its way! Check your email shortly.", "info");
    }

    window.afterLogin = function(response) {
	if (!response.result) {
	    god.notify("Wrong username or password.", "error");
	} else {
	    var user = response.result[0];
	    localStorage.setItem("userId", user.user_id);
	    window.location.href = "profile.html?login=true";
	}
    }
});
