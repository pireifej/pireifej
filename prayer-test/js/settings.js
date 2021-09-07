$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var userId = localStorage.getItem("userId");
    var srcEncoded = "";
    var uploadedPicName = "";
    var loadedPicName = "";
    var gFileData = null;
    var imageResized = null;
    
    if (userId) {
	$("#submit-text").html("Update User");
	$("#excited").html("Edit your profile");
	//$('#enter-password').attr('readonly', true);
	god.query("getUser", "afterGetUser", {}, true, true);
    } else {
	$('#enter-password').attr('readonly', false);
	$("#password-change").hide();
	$("#blah").hide();
    }

    $("#form").submit(function(e) {
	e.preventDefault();

	var formValues = $("#form").serializeArray();
	var userId = localStorage.getItem("userId");
	var profileDetails = {};
	for (var i = 0; i < formValues.length; i++) {
	    profileDetails[formValues[i].name] = formValues[i].value;
	}

	if (!profileDetails["username"]) {
	    god.notify("Username required", "error");
	    return;
	}
	if (!profileDetails["password"] && !userId) {
	    god.notify("Password required", "error");
	    return;
	}
	if (!profileDetails["email"]) {
	    god.notify("Email required", "error");
	    return;
	}
	if (!profileDetails["realname"]) {
	    god.notify("Name required", "error");
	    return;
	} else {
	    var name = profileDetails["realname"];
	    var nameParts = name.split(" ");
	    if (nameParts.length > 1) {
		god.notify("Only first name is needed.", "info");
		return;
	    }
	}
	var uploadedPicName = god.getUploadedPicName();
/*	if (!uploadedPicName) {
	    god.notify("Please upload a profile picture", "error");
	    return;
	}
*/
	var params = {
	    userName: "'" + profileDetails["username"] + "'",
	    password: "'" + profileDetails["password"] + "'",
	    email: "'" + profileDetails["email"] + "'",
	    realName: "'" + profileDetails["realname"] + "'",
	    location: "'" + profileDetails["location"] + "'",
	    title: "'" + profileDetails["title"] + "'",
	    about: "'" + profileDetails["about"] + "'"
	};

	if (uploadedPicName) {
	    params['picture'] = uploadedPicName;
	}


	$("#submit-button").prop('disabled', true);

	if (userId) {
	    $("#submit-text").html("Updating ...");
	} else {
	    $("#submit-text").html("Creating ...");
	}
	
	if (profileDetails["password"]) {
	    god.query("passwordChange", "afterPasswordChange", {password: profileDetails.password}, true, true);
	}

	if (userId) {
	    god.query("updateUser", "afterUpdateUser", params, true, true);
	} else {
	    god.query("createUser", "afterCreateUser", params, false, true);
	}
    })

    window.afterPasswordChange = function(response) {
	console.log("afterPasswordChange");
    }

    window.afterUpdateUser = function(response) {
	window.location.href = "profile.html?updated=true";
    }

    $("#profile-top").click(function() {
	$("#profile-contents").show();
	$("#profile-contents").removeAttr("hidden");

	$("#picture-contents").hide();
	$("#picture-contents").attr("hidden");
    });

    $("#picture-top").click(function() {
	$("#picture-contents").show();
        $("#picture-contents").removeAttr("hidden");

        $("#profile-contents").hide();
        $("#profile-contents").attr("hidden");

    });

    window.afterGetUser = function(response) {
	var user = response.result[0];
	var logout = $.urlParam('signout')
	if (logout) return;

	// set edit profile form
	$("[name=username]").val(user.user_name);
	$("[name=password]").val("");
	$("[name=email]").val(user.email);
	$("[name=location]").val(user.location);
	$("[name=reason]").val("");
	$("[name=title]").val(user.user_title);
	$("[name=about]").val(user.user_about);
	$("[name=realname]").val(user.real_name);

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
