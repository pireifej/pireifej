$( document ).ready(function() {
    window.god = window.god || {};
    var user = $.urlParam('user');
    var access = $.urlParam('access');
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
