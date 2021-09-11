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
	god.query("getUser", "resetUserProfile", {}, true, true, "all");
    });
    $("#cancel-btn-picture").click(function(e) {
	god.query("getUser", "resetUserProfile", {}, true, true, "all");
    });

    $("#update-user-btn-picture").click(function(e) {
	var uploadedPicName = god.getUploadedPicName();
	var params = {};
	if (uploadedPicName) {
	    params['picture'] = uploadedPicName;
	    god.query("updateUser", "afterUpdateUser", params, true, true);
	    $("#update-user-btn-picture").prop('disabled', true);
	    $("#update-user-btn-picture").html("Saving ...");
	}
    });
    
    $("#update-user-btn").click(function(e) {
	updateUser();
    })

    function updateUser() {
	var userId = localStorage.getItem("userId");
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

	$("#update-user-btn").prop('disabled', true);
	$("#update-user-btn").html("Saving ...");

//	if (profileDetails["password"]) {
//	    god.query("passwordChange", "afterPasswordChange", {password: profileDetails.password}, true, true);
//	}

	god.query("updateUser", "afterUpdateUser", params, true, true);
    }

    window.afterPasswordChange = function(response) {
	console.log("afterPasswordChange");
    }

    window.afterUpdateUser = function(response) {
	$("#update-user-btn").prop('disabled', false);
	$("#update-user-btn").html("Save");
	$("#update-user-btn-picture").prop('disabled', false);
	$("#update-user-btn-picture").html("Save");
	console.log(response);
    }

    $("#profile-top").click(function() {
	$("#basic").show();
        $("#basic").removeAttr("hidden");
	$("#picture").hide();
        $("#picture").attr("hidden");
	$("#basic-heading").html("Basic");
	$("#basic-sub-heading").html("Update your basic profile information.");
    });

    $("#picture-top").click(function() {
	$("#basic").hide();
        $("#basic").attr("hidden");
	$("#picture").show();
        $("#picture").removeAttr("hidden");
	$("#basic-heading").html("Picture");
	$("#basic-sub-heading").html("Change your profile picture.");

	// display current profile picture
	var userPicture = $("#user-picture").attr("src");
	$("#blah").attr("src", userPicture);
    });

    $("#password-top").click(function() {
	$("#basic").hide();
        $("#basic").attr("hidden");
	$("#picture").hide();
        $("#picture").attr("hidden");
	$("#password").show();
        $("#password").removeAttr("hidden");
	$("#basic-heading").html("Password");
	$("#basic-sub-heading").html("Update your password.");
    });

    // set edit profile form
    window.resetUserProfile = function(response) {
	var user = response.result[0];

	// facebook username
	let isnum = /^\d+$/.test(user.user_name);
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
    }

    window.afterCreateUser = function(response) {
	if (response.error == 0) {
	    $("#form")[0].reset();
	    window.location.href = "login.html?user=true";
	}
    };
});
