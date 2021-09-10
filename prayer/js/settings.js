$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var userId = localStorage.getItem("userId");
    var srcEncoded = "";
    var uploadedPicName = "";
    var loadedPicName = "";
    var gFileData = null;
    var imageResized = null;

    $("#cancel-btn").click(function(e) {
	god.query("getUser", "afterGetUser", {}, true, true, "all");
    });
    
    $("#update-user-btn").click(function(e) {
	var userId = localStorage.getItem("userId");
//	var uploadedPicName = god.getUploadedPicName();

	var gender = $("#gender").val();
	
	var params = {
	    userName: "'" + $("#username").val() + "'",
	    email: "'" + $("#email").val() + "'",
	    realName: "'" + $("#realname").val() + "'",
	    location: "'" + $("#location").val() + "'",
	    title: "'" + $("#title").val() + "'",
	    about: "'" + $("#about").val() + "'",
	    gender: (gender == 0) ? "male" : "female"
	};

//	if (uploadedPicName) {
//	    params['picture'] = uploadedPicName;
//	}

	$("#update-user-btn").prop('disabled', true);
	$("#update-user-btn").html("Saving ...");

//	if (profileDetails["password"]) {
//	    god.query("passwordChange", "afterPasswordChange", {password: profileDetails.password}, true, true);
//	}

	god.query("updateUser", "afterUpdateUser", params, true, true);
    })

    window.afterPasswordChange = function(response) {
	console.log("afterPasswordChange");
    }

    window.afterUpdateUser = function(response) {
	console.log("window.afterUpdateUser");
	$("#update-user-btn").prop('disabled', false);
	$("#update-user-btn").html("Save");
	console.log(response);
//	window.location.href = "profile.html?updated=true";
    }

    $("#profile-top").click(function() {
	$("#profile-contents").show();
	$("#profile-contents").removeAttr("hidden");

	$("#picture-contents").hide();
	$("#picture-contents").attr("hidden");
	$("#password-contents").hide();
	$("#password-contents").attr("hidden");
    });

    $("#picture-top").click(function() {
	$("#picture-contents").show();
        $("#picture-contents").removeAttr("hidden");

        $("#profile-contents").hide();
        $("#profile-contents").attr("hidden");
	$("#password-contents").hide();
	$("#password-contents").attr("hidden");
    });

    $("#password-top").click(function() {
	$("#password-contents").show();
        $("#password-contents").removeAttr("hidden");

        $("#profile-contents").hide();
        $("#profile-contents").attr("hidden");
	$("#picture-contents").hide();
	$("#picture-contents").attr("hidden");
    });

    window.afterGetUser = function(response) {
	var user = response.result[0];

	// set edit profile form
	console.log("profiloe");
	console.log(user);

	// facebook username
	let isnum = /^\d+$/.test(user.user_name);
	console.log(isnum);
	if (isnum) {
	    $("#username-div").hide();
	}

	$("[name=username]").val(user.user_name);
	$("[name=password]").val("");
	$("[name=email]").val(user.email);
	$("[name=location]").val(user.location);
	$("[name=reason]").val("");
	$("[name=title]").val(user.user_title);
	$("[name=about]").val(user.user_about);
	$("[name=realname]").val(user.real_name);
	$('*[id*=user-picture]').each(function() {
	    $(this).attr("src", "uploads/" + user.picture);
	});

	if (user.gender == "male") {
	    $('select[name=gender]').val(0);
	    $('.selectpicker').selectpicker('refresh')
	}
	if (user.gender == "female") {
	    $('select[name=gender]').val(1);
	    $('.selectpicker').selectpicker('refresh')
	}

	// set user details on screen header, requests, elsewhere
	$('*[id*=user-name]').each(function() {
	    $(this).html(user.real_name);
	});
	$('*[id*=user-title]').each(function() {
	    $(this).html(user.user_title);
	});
	$('*[id*=user-location]').each(function() {
	    $(this).html(user.location);
	});
	$('*[id*=user-about]').each(function() {
	    $(this).html(user.user_about);
	});
	$('*[id*=user-created]').each(function() {
	    $(this).html(god.getFormattedTimestamp(user.timestamp));
	});
	$('*[id*=blah]').each(function() {
	    $(this).attr("src", "uploads/" + user.picture);
	});

	loadedPicName = user.picture;
	console.log("loadedPIcName = " + loadedPicName);
    }

    window.afterCreateUser = function(response) {
	if (response.error == 0) {
	    $("#form")[0].reset();
	    window.location.href = "login.html?user=true";
	}
    };
});
