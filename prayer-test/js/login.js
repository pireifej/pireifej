$( document ).ready(function() {
    $.ajaxSetup({ cache: true });
    
    // Logout
    var logout = $.urlParam('signout');

    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
	FB.init({
	    appId: '820853052173991',
	    version: 'v2.7' // or v2.1, v2.2, v2.3, ...
	});
	FB.getLoginStatus(updateStatusCallback);
    });

    window.updateStatusCallback = function(response) {
	console.log(response);
	console.log("window.updateStatusCallback");

	if (logout) {
	    localStorage.removeItem("userId");

	    if (response.status == "unknown") {
		console.log("status unknown");
	    }
	}
    }

    $("#login-submit-btn").click(function() {
	var params = {
	    userName: $("#login-email-address").val(),
	    password: $("#login-password").val()
	};
	god.query("login", "afterLogin", params, false, true);
    });

    window.afterLogin = function(response) {
	if (!response.result) {
	    god.notify("Wrong username or password.", "error");
	} else {
	    var user = response.result[0];
	    localStorage.setItem("userId", user.user_id);
	    window.location.href = "index.html";
	}
    }

    window.checkLoginState = function() {
	FB.getLoginStatus(function(response) {
	    console.log("window.checkLoginState");
	    console.log(response);
	    statusChangeCallback(response);
	});
    }

    if (logout) return;
        
    window.god = window.god || {};
    var user = $.urlParam('user');
    var access = $.urlParam('access');
    var facebookId = null;

    if (user) {
	god.notify("New user profile created.", "success");
    }
    
//    if (access) {
//	god.notify("Need to login first.", "error");
//    }
    
    if (localStorage.getItem("userId")) {
	window.location.href = "index.html";
    }

    window.forgot = function() {
	var params = {
	    email: "pireifej@gmail.com",
	    realName: "Forgot Password!"
	};
	god.query("forgotPassword", "afterForgot", params, false, true);
    }

    window.statusChangeCallback = function(response) {
	console.log(response);

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
			picture: "facebook",
			gender: "facebook",
			phone: "facebook"
		    };

		    god.query("createUser", "afterCreateUser", params, false, true);
		}
	    }
	);
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
});
