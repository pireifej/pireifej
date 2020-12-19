$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var userId = localStorage.getItem("userId");
    var selectedPicture = "";
    
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
		img.src = event.target.result;//result is base64-encoded Data URI
		img.name = event.target.name;//set name (optional)
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
		    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

		    //assign it to thumb src
		    //document.querySelector('#image').src = srcEncoded;
		    $('#blah').attr('src', srcEncoded);
		    $("#blah").show();

		    $("#pic-upload-button").click();
		    $("#upload-profile-picture-button").prop("disabled", true);
		    $("#upload-profile-picture-button").val("Uploading now...");

		    /*Now you can send "srcEncoded" to the server and
		      convert it to a png o jpg. Also can send
		      "el.target.name" that is the file's name.*/
		    selectedPicture = srcEncoded;

		}
	    }
	}
    }

     $("#but_upload").click(function(){
        var fd = new FormData();
         var files = $('#file')[0].files[0];
	 console.log(files);
        fd.append('file',files);
        $.ajax({
            url: 'upload.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response){
		console.log(response);
                if(response != 0){
                    $("#img").attr("src",response); 
                    $(".preview img").show(); // Display image element
                }else{
                    alert('file not uploaded');
                }
            },
        });
     });

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
	    about: "'" + profileDetails["about"] + "'"
	};

	if (userId) params["userId"] = userId;
	console.log(params);

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
	formData.append("fileToUpload", fileData);

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
	console.log('createUser success');
	
	if (response.error == 0) {
	    $("#form")[0].reset();
	    window.location.href = "login.html?user=true";
	}
    };
})
