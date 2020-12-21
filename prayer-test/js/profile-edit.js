$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var userId = localStorage.getItem("userId");
    var uploadedPicName = "";
    var srcEncoded = "";
    var bodyFormData = new FormData();
    var gFileData = null;
    var imageResized = null;
    
    if (userId) {
	$("#submit-text").html("Update User");
	$("#excited").html("Edit your profile");
	var params = {
	    command: 'getUser',
	    userId: userId,
	    jsonpCallback: "afterGetUser"
	};
	god.sendQuery(params);
    } else {
	$("#blah").hide();
    }

    var dataURLToBlob = function(dataURL) {
     var BASE64_MARKER = ';base64,';
     if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = parts[1];

          return new Blob([raw], {type: contentType});
     }

     var parts = dataURL.split(BASE64_MARKER);
     var contentType = parts[0].split(':')[1];
     var raw = window.atob(parts[1]);
     var rawLength = raw.length;

     var uInt8Array = new Uint8Array(rawLength);

     for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
     }

     return new Blob([uInt8Array], {type: "image/jpg"});
     //return new Blob([uInt8Array], {type: contentType});
}

    function readURL(input) {
	if (input.files && input.files[0]) {
	    var reader = new FileReader();
	    var item = input.files[0];
	    reader.readAsDataURL(item); // convert to base64 string
	    reader.name = item.name;//get the image's name
	    reader.size = item.size; //get the image's size
    
	    reader.onload = function(event) {
		$('#blah').attr('src', event.target.result);
		
		var resize_width = 600;//without px
		var img = new Image();//create a image
		uploadedPicName = god.makeId(8) + ".jpg";
		img.src = event.target.result;//result is base64-encoded Data URI
		img.name = uploadedPicName;//set name (optional)
		img.size = event.target.size;//set size (optional)
		img.onload = function(el) {
		    var elem = document.createElement('canvas');//create a canvas

		    //scale the image to 600 (width) and keep aspect ratio
		    var scaleFactor = resize_width / el.target.width;
		    elem.width = resize_width;
		    elem.height = el.target.height * scaleFactor;
		    
		    //draw in canvas
		    var ctx = elem.getContext('2d');
		    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

		    //get the base64-encoded Data URI from the resize image
		    srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);
		    imageResized = dataURLToBlob(srcEncoded);

		    elem.toBlob(function(blob) {        // get content as JPEG blob
			// here the image is a blob
			bodyFormData.set('file', blob, uploadedPicName);
			gFileData = new File([blob], uploadedPicName, {
			    type: "image/jpg",
			});
		    }, "image/jpg", 0.75);

		    //assign it to thumb src
		    $('#blah').attr('src', srcEncoded);
		    $("#fileToUpload").attr('src', srcEncoded);

		    $("#blah").show();

		    $("#pic-upload-button").click();
		    $("#upload-profile-picture-button").prop("disabled", true);
		    $("#upload-profile-picture-button").val("Uploading now...");

		    /*Now you can send "srcEncoded" to the server and
		      convert it to a png o jpg. Also can send
		      "el.target.name" that is the file's name.*/
		}
	    }
	}
    }

    $("#fileToUpload").change(function() {
	readURL(this);
    });

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
	if (!uploadedPicName) {
	    god.notify("Please upload a profile picture", "error");
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
	    picture: uploadedPicName
	};

	if (userId) params["userId"] = userId;

	$("#submit-button").prop('disabled', true);

	if (userId) {
	    $("#submit-text").html("Updating ...");
	} else {
	    $("#submit-text").html("Creating ...");
	}

	god.sendQuery(params);
    })

    $("#pic-upload-form").submit(function(e) {
	console.log("pic-upload-form!");
	e.preventDefault();

	var fileData = $("#fileToUpload").prop("files")[0];
	var formData = new FormData();
	gFileData = new File([imageResized], uploadedPicName, {
	    type: "image/jpg",
	});

	formData.append("fileToUpload", gFileData);
	$.ajax({
            url: "upload.php",
            dataType: 'script',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            type: 'post',
            success: function(response){
		console.log("upload.php success");
		console.log(response);
		var json = JSON.parse(response);
		console.log(json);
		
		if (json.error == 1) {
		    god.notify(json.message, "error");
		    $("#upload-profile-picture-button").prop("disabled", false);
		    $("#upload-profile-picture-button").val("Upload Profile Picture");
		}
		if (json.error == 0) {
		    god.notify(json.message, "success");
		    $("#upload-profile-picture-button").prop("disabled", false);
		    $("#upload-profile-picture-button").val("Upload Profile Picture");
		}
            }
	});

	return;
	
	$.post( "upload.php", function( data ) {
	    console.log(data);
	});	
    });

    window.afterUpdateUser = function(response) {
	console.log("afterUpdateUser success");
	console.log(response);
	window.location.href = "profile.html?updated=true";
    }

    window.afterGetUser = function(response) {
	console.log('afterGetUser success');

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
	    $(this).attr("src", user.picture);
	});
    }

    window.afterCreateUser = function(response) {
	if (response.error == 0) {
	    $("#form")[0].reset();
	    window.location.href = "login.html?user=true";
	}
    };
})
