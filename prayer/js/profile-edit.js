$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var userId = localStorage.getItem("userId");
    var selectedPicture = "";
    
    if (userId) {
	$("#submit-button").val("Update User");
	var params = {
	    command: 'getUser',
	    userId: userId,
	    jsonpCallback: "afterGetUser"
	};
	god.sendQuery(params);
    }

    $('body').on('click','img',function(element){
	$('.pic-select').each(function(i, obj) {
	    $(obj).css('border', "");
	});
	$(event.target).css('border', "5px inset yellow");
	selectedPicture = $(event.target).attr("src");
    })

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
	if (!selectedPicture) {
	    god.notify("Please select a profile picture", "error");
	    return;
	}
	
	var params = {
	    command: (userId) ? 'updateUser' : 'createUser',
	    jsonpCallback: (userId) ? 'afterUpdateUser' : 'afterCreateUser',
	    userName: "'" + profileDetails["username"] + "'",
	    password: "'" + profileDetails["password"] + "'",
	    email: "'" + profileDetails["email"] + "'",
	    realName: "'" + profileDetails["realname"] + "'",
	    location: "'" + profileDetails["location"] + "'",
	    title: "'" + profileDetails["title"] + "'",
	    about: "'" + profileDetails["about"] + "'",
	    picture: "'" + selectedPicture + "'",
	    userId: (userId) ? userId : ""
	};
	
	god.sendQuery(params);
    })

    window.afterUpdateUser = function(response) {
	console.log("afterUpdateUser success");
	console.log(response);
	window.location.href = "profile.html?updated=true";
    }

    window.afterGetUser = function(response) {
	console.log('afterGetUser success');

	var user = response.result[0];
	selectedPicture = user.picture;

	// select the selected user profile picture
	$('.pic-select').each(function(i, obj) {
	    if ($(obj).attr("src") == selectedPicture) {
		$(obj).css('border', "5px inset yellow");
	    }
	});

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
	$('*[id*=user-picture]').each(function() {
	    $(this).attr("src", user.picture);
	});
    }

    window.afterCreateUser = function(response) {
	console.log('createUser success');
	if (response.error == 0) {
	    $("#form")[0].reset();
	    window.location.href = "login.html?user=true";
	    var params = {
		command: "email",
		email: email,
		realName: realName
	    };
	    god.sendQuery(params);
	}
    };
})