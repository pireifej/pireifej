$( document ).ready(function() {
    window.god = window.god || {};
    var categories = [];
    var bodyFormData = new FormData();
    var uploadedPicName = "";
    var userRealName = "";

    $("#pic-upload-form").submit(function(e) {
	e.preventDefault();

	var fileData = $("#fileToUpload").prop("files")[0];
	var formData = new FormData();
	gFileData = new File([imageResized], uploadedPicName, {
	    type: "image/jpg",
	});

	formData.append("fileToUpload", gFileData);
	$.LoadingOverlay("show");
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
		$.LoadingOverlay("hide");
		
		if (json.error == 1) {
		    god.notify(json.message, "error");
		    $("#upload-profile-picture-button").prop("disabled", false);
		    $("#upload-profile-picture-button").val("Upload Profile Picture");
		    uploadedPicName = "";
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
    
    $("#fileToUpload").change(function() {
	god.readURL(this, 600);
    });

    god.getUserRealName = function() {
	return userRealName;
    }

    god.getUploadedPicName = function() {
	console.log("god.getUploadedPicName");
	console.log(uploadedPicName);
	return uploadedPicName;
    }

    god.readURL = function(input, resizeWidth) {
	if (input.files && input.files[0]) {
	    var reader = new FileReader();
	    var item = input.files[0];
	    reader.readAsDataURL(item); // convert to base64 string
	    reader.name = item.name;//get the image's name
	    reader.size = item.size; //get the image's size
    
	    reader.onload = function(event) {
		$('#blah').attr('src', "uploads/" + event.target.result);
		
		var resize_width = resizeWidth;//without px
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
		    imageResized = god.dataURLToBlob(srcEncoded);

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

    god.dataURLToBlob = function(dataURL) {
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
    }

    // text - display text
    // type - success, info, warning, error
    god.notify = function(text, type) {
	$.notify(text, { position: "bottom left", className: type });
    }

    // god functions
    god.init = function () {
	// load all request for this user
	var userId = localStorage.getItem("userId");
	god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

	if (userId) {
	    god.query("getUser", "afterGetUser", {}, true, true);
	    $("#login-button").hide();
	    $("#become-a-member").html("Edit Profile");
	    $("#login-button-mobile").hide();
	}

	// site wide configuration
	if (!userId) {
	    $("#header-notifications-text").hide();
	    $("#header-prayer-text").hide();
	    $("#header-requests-text").attr("src", "login.html");
	    $("#header-requests-text").html("Login");

	    $("#profile-button-mobile").hide();
	    $("#request-feed-button-mobile").hide();
	    $("#notification-button-mobile").hide();
	    $("#new-request-button-mobile").hide();
	    $("#header-new-request-text").hide();
	    $("#login-button-mobile").show();
	    
	    $("#user-name").html("Welcome");
	    $('*[id*=user-picture]').each(function() {
		$(this).hide();
	    });
	    $("#user-pic-circle").hide();
	    $("#navigation").hide();
	    $("#user-notification").hide();
	    $("#request-feed").hide();
	    $("#login-button").show();
	}

	god.query("getNotifications", "afterGetNotifications", {}, true, true);
	god.getCategories("afterGetCategories");
	
	$("#copyright").html("&#169; prayerforus.com");
	$("#title").html("Pray For Us - Prayer Social Network");
    }

    window.helloClick = function() {
	console.log("Hello!");
	FB.ui({
	    method: 'share',
	    href: 'https://developers.facebook.com/docs/',
	}, function(response){});
    }

    window.submitQuickRequest = function() {
	var categoryId = null;
	for (var i = 0; i < categories.length; i++) {
	    if (categories[i].category_name == "general") {
		categoryId = categories[i].category_id;
		break;
	    }
	}

	var text = $('#quickRequestText').val();

	if (!text) {
	    god.notify("Quick request needs a message", "error");
	    return;
	}

	$("#quickRequestPost").prop("disabled", true);
	
	params = {
	    requestText: "\"" + $("#quickRequestText").val() + "\"",
	    requestTitle: "Quick Request",
	    requestCategoryId: categoryId
	};
	god.query("createRequest", "afterQuickCreateRequest", params, true, true);
    };

    god.categories = {};
    $.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) return null;
	return results[1] || 0;
    }

    god.makeId = function(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
    }

    // mode - feed or profile
    god.getHtmlPost = function(request, mode) {
	var date = god.getFormattedTimestamp(request.timestamp);

	var topLeft = (mode == "profile") ? request.request_id : request.real_name;
	var button = (mode == "profile") ? "<a href='javascript:void(0)' onclick='window.deleteRequest(" + request.request_id + ")'><span id='delete-button'>Delete</span> <i class='fa fa-angle-right' aria-hidden='true'></i></a>" : "<a href='pray.html?requestId=" + request.request_id + "'>Pray for me <i class='fa fa-angle-right'></i></a>";

	var img = "img/requests/" + request.category_name + ".jpg";
	if (request["request_picture"]) {
	    img = "uploads/" + request["request_picture"];
	}
	console.log(request);

	var otherPerson = request["other_person"];
	var forOtherPerson = (otherPerson) ? " (for " + otherPerson + ")" : "";

	console.log(otherPerson, forOtherPerson);

	return "<a href='#" + request.request_id + "'><div id='" + request.request_id + "'>    <div class='tr-section feed'>    	<div class='tr-post'>    	<div class='entry-header'>    	<div class='entry-thumbnail'>    	<a href='#'><img class='img-fluid' src='" + img + "' alt='Image'></a>    	</div>    	</div>    	<div class='post-content'>    	<div class='author-post'>    	<a href='#'><img class='img-fluid rounded-circle' name='userpic' id='user-picture' alt='Image' src='uploads/" + request.picture + "'></a>    	</div>    	<div class='entry-meta'>    	<ul>    	<li><a href='#'>" + topLeft + "</a></li>    	<li>" + date + "</li>    	<li><i class='fa fa-align-left' aria-hidden='true'></i>&nbsp;" + request.category_name + " </li>    	</ul>    	</div>    	<div class='read-more'>    	<div class='feed pull-left'>    	<ul>    	</ul>    	</div>    	<h2><a href='#' class='entry-title'>" + request.request_title + " </a></h2>    	<p>" + request.request_text + forOtherPerson + " </p>    	<div class='read-more'>    	<div class='feed pull-left'>    	<ul><div id='" + request.request_id + "'></div>    	</ul>                        <div id='people-who-prayed-" + request.request_id + "'>" + request.prayer_count + "&nbsp;<i class='fa fa-handshake-o' aria-hidden='true'>&nbsp;</i></div>    	</div>    	<div class='continue-reading pull-right'>    	" + button + "    	</div>    	</div>    	</div>    	</div>    	</div> </div></a>";
    }

    god.mobileCheck = function() {
	let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

    god.getTimeAgo = function (time) {
        var thisTimestamp = time.replace(".000Z", "");
        var current = new Date().getTime();
        var prayedFor = new Date(thisTimestamp).getTime();
        var difference = current - prayedFor;

        var seconds = (current-prayedFor)/1000;
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var timeAgo = days + " days ago";

	if (days == 1) timeAgo = " yesterday";

        if (days == 0) {
            if (hours == 1) timeAgo = hours + " hour ago";
            else timeAgo = hours + " hours ago";
        }

        if (days == 0 && hours == 0) {
            if (minutes == 1) timeAgo = " minute ago";
            else timeAgo = minutes + " minutes ago";
        }

        if (days == 0 && hours == 0 && minutes == 0) {
            timeAgo = parseInt(seconds) + " just now";
        }
	return timeAgo;
    }

    window.afterGetCategories = function(response) {
	categories = response.result;
    };

    window.afterQuickCreateRequest = function(response) {
	$("#quickRequestText").val("");
	god.notify("Quick request created.", "success");
    }

    window.afterGetAllUsers = function(response) {
	var html = "<div class='active-profile-mobile' id='all-users-mobile'>";

	var users = response.result;
	for (var i = 0; i < users.length; i++) {
	    var user = users[i];
	    
	    html += "<div class='single-slide'>";
	    html += "<div class='profile-thumb active profile-active'>";
	    html += "<a href='user.html?userId=" + user.user_id + ">";
	    html += "<figure class='profile-thumb-small profile-active'>";
            html += "<img src='uploads/" + user.picture + "' alt='profile picture'>";
            html += "</figure>";
	    html += "</a>";
	    html += "</div>";
	    html += "</div>";
	    
	    var htmlDesktop = "";
	    htmlDesktop += "      <div class='single-slide'>";
	    htmlDesktop += "                                          <div class='profile-thumb active profile-active'>";
	    htmlDesktop += "                                                <a href='javascript:void(0)'>";
	    htmlDesktop += "                                                   <figure class='profile-thumb-small'>";
	    htmlDesktop += "                                                        <img src='uploads/" + user.picture + "' alt='profile picture'>";
	    htmlDesktop += "                                                   </figure>";
	    htmlDesktop += "                                               </a>";
	    htmlDesktop += "                                           </div>";
	    htmlDesktop += "                                        </div>";
	    $("#all-users-desktop").append(htmlDesktop);
	}
	html += "</div>";

	$("#all-users-mobile").html(html);

    }

    window.afterGetNotifications = function(response) {
	$("#notifications").empty();
	$("#notifications-mobile").empty();
	var htmlNotifications = "";
	var htmlNotificationsMobile = "";

	for (var i = 0; i < response.result.length; i++) {
	    var notice = response.result[i];
	    var timeAgo = god.getTimeAgo(notice.timestamp);
	    
	    htmlNotifications += "<li class='msg-list-item d-flex justify-content-between'>";
            htmlNotifications += "<!-- profile picture end -->";
	    htmlNotifications += "<div class='profile-thumb'>";
	    htmlNotifications += + "<figure class='profile-thumb-middle'>";
	    htmlNotifications += "<img src='uploads/" + notice.picture + "' alt='profile picture' class='notice-picture'>";
	    htmlNotifications += "</figure>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- profile picture end -->";
	    htmlNotifications += "<!-- message content start -->";
	    htmlNotifications += "<div class='msg-content notification-content'>";
	    htmlNotifications += "<a href='user.html?userId=" + notice.user_id + "'>" + notice.real_name + "</a> ";
	    htmlNotifications += "<p>prayed for '" + notice.request_title + "'.</p>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- message content end -->";
	    htmlNotifications += "<!-- message time start -->";
	    htmlNotifications += "<div class='msg-time'>";
	    htmlNotifications += "<p>" + timeAgo + "</p>";
	    htmlNotifications += "</div>";
	    htmlNotifications += "<!-- message time end -->";
	    htmlNotifications += "</li>";

	    htmlNotificationsMobile += "                                <li>";
	    htmlNotificationsMobile += "                                    <div class='frnd-request-member'>";
	    htmlNotificationsMobile += "                                        <figure class='request-thumb'>";
	    htmlNotificationsMobile += "                                            <a href='profile.html'>";
	    htmlNotificationsMobile += "                                                <img style='width: 75px; height: 75px' src='uploads/" + notice.picture + "' alt='proflie author'>";
	    htmlNotificationsMobile += "                                            </a>";
	    htmlNotificationsMobile += "                                        </figure>";
	    htmlNotificationsMobile += "                                        <div class='frnd-content'>";
	    htmlNotificationsMobile += "                                            <p class='author-subtitle'><a href='user.html?userId=" + notice.user_id + "'>" + notice.real_name + "</a> prayed for '" + notice.request_title + "'.</p>";
	    htmlNotificationsMobile += "                                            <div class='request-btn-inner'>";
	    htmlNotificationsMobile += "<p>" + timeAgo + "</p>";
//	    htmlNotificationsMobile += "                                                <button class='frnd-btn'>confirm</button>";
//	    htmlNotificationsMobile += "                                                <button class='frnd-btn delete'>delete</button>";
	    htmlNotificationsMobile += "                                            </div>";
	    htmlNotificationsMobile += "                                        </div>";
	    htmlNotificationsMobile += "                                    </div>";
	    htmlNotificationsMobile += "                                </li>";
	}

	htmlNotifications = htmlNotifications.replaceAll("NaN", "");
	$("#notifications").html(htmlNotifications);
	$("#notifications-mobile").html(htmlNotificationsMobile);
    }

    window.goToRequestFeed = function() {
	window.location.href = "request-feed.html";
    }

    window.afterGetUser = function(response) {
	var user = response.result[0];

	var logout = $.urlParam('signout')
	if (logout) return;

	if (user.user_name !== "pireifej") {
	    $("#prayer-admin-link").hide();
	    $("#prayer-admin-link-mobile").hide();
	}

	if (god.getEnv() == "test") {
	    $("#prayer-admin-link").hide();
	    $("#prayer-admin-link-mobile").hide();
	}

	// set edit profile form
	$("[name=username]").val(user.user_name);
	$("[name=password]").val("");
	$("[name=email]").val(user.email);
	$("[name=location]").val(user.location);
	$("[name=reason]").val("");
	$("[name=title]").val(user.user_title);
	$("[name=about]").val(user.user_about);
	$("[name=name]").val(user.real_name);

	userRealName = user.real_name;

	// set user details on screen header, requests, elsewhere
	$('*[id*=real-name]').each(function() {
	    $(this).html(user.real_name);
	});
	$('*[id*=user-name]').each(function() {
	    $(this).html(user.user_name);
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
	    $(this).attr("src", "uploads/" + user.picture);
	});
	$('*[id*=profile-link]').each(function() {
	    $(this).attr("href", "user.html?userId="+user.user_id);
	});
	$('*[id*=my-email-address]').each(function() {
	    $(this).html(user.email);
	});
    }

    window.afterGetAllRequests = function(response) {
	god.insertRequests(response);
    }

    god.getEnv = function() {
	return (window.location.href.includes("prayer-test") ? "test" : "prod");
    }

    god.getFormattedTimestamp = function(timestamp) {
	var timestamp = timestamp.split("T");
	var date = timestamp[0];
	var time = timestamp[1];
	var times = time.split(":");
	var hour = parseInt(times[0]);
	var amOrPM = "AM";
	if (hour > 12) {
	    hour -= 12;
	    amOrPM = "PM"
	}
	time = hour + ":" + times[1] + " " + amOrPM;
	date = date + " " + time;

	var dateVals = date.split("-");
	var year = dateVals[0];
	var month = dateVals[1];
	var day = dateVals[2];

	var dayArray = day.split(" ");
	day = dayArray[0];

	if (month == 1) month = "January";
	if (month == 2) month = "February";
	if (month == 3) month = "March";
	if (month == 4) month = "April";
	if (month == 5) month = "May";
	if (month == 6) month = "June";
	if (month == 7) month = "July";
	if (month == 8) month = "August";
	if (month == 9) month = "September";
	if (month == 10) month = "October";
	if (month == 11) month = "November";
	if (month == 12) month = "December";

	return month + " " + day + ", " + year + " @ " + time;
	//return date;
    }

    god.insertRequests = function(response) {
	$("#requests").empty();
	var htmlPost = "";
	$("#nbrRequests").html(response.result.length + " Requests");
	for (var i = 0; i < response.result.length; i++) {
	    var request = response.result[i];
	    var date = god.getFormattedTimestamp(request.timestamp);

	    htmlPost += " <div>";
	    htmlPost += "    <div class='tr-section feed'>";
	    htmlPost += "    	<div class='tr-post'>";
	    htmlPost += "    	<div class='entry-header'>";
	    htmlPost += "    	<div class='entry-thumbnail'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid' src='img/blog/8.jpg' alt='Image'></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='post-content'>";
	    htmlPost += "    	<div class='author-post'>";
	    htmlPost += "    	<a href='#'><img class='img-fluid rounded-circle' src='img/users/8.jpg' alt='Image'></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='entry-meta'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "    	<li><a href='#'>" + request.request_id + "</a></li>";
	    htmlPost += "    	<li>" + date + "</li>";
	    htmlPost += "    	<li><i class='fa fa-align-left'></i>&nbsp;" + request.category_name + " </li>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='read-more'>";
	    htmlPost += "    	<div class='feed pull-left'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<h2><a href='#' class='entry-title'>" + request.request_title + "</a></h2>";
	    htmlPost += "    	<p>" + request.request_text + "</p>";
	    htmlPost += "    	<div class='read-more'>";
	    htmlPost += "    	<div class='feed pull-left'>";
	    htmlPost += "    	<ul>";
	    htmlPost += "    	<li><i class='fa fa-comments'></i>134</li>&nbsp;";
	    htmlPost += "            <li><i class='fa fa-heart-o'></i>45</li>";
	    htmlPost += "    	</ul>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	<div class='continue-reading pull-right'>";
	    htmlPost += "    	<a href='javascript:void(0)' onclick='window.deleteRequest(" + request.request_id + ")'>Delete <i class='fa fa-angle-right'></i></a>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += "    	</div>";
	    htmlPost += " </div>";
	}
	$("#requests").html(htmlPost);
    }

    // commandName - command name to send to nodejs/sendQuery
    // jsonpCallback - function to callback after query returns with a response
    // params - object that includes key/value parameters for query
    // includeUserId - do you want to include current user ID?
    // includeTimeZone - do you want to include client time zone?
    // showLoadingOverlay - show the spinny circle thing on entire page 'all' or element 'id of elem'
    god.query = function(commandName, jsonpCallback, params, includeUserId, includeTimeZone, showLoadingOverlay) {
	params = (!params) ? {} : params;
	if (!commandName) return;
	if (!jsonpCallback) return;

	params["command"] = commandName;
	params["jsonpCallback"] = jsonpCallback;
	
	if (includeTimeZone) {
	    // get time zone
	    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	    params["tz"] = tz;
	}

	// redirect to login screen if user is not already logged on
	var userId = localStorage.getItem("userId");
	// exceptions are creating a user, logging in, contact the website for help
	var exceptions = { "createUser": true, "login": true, "email": true, "help" :true, "logVisitor": true };
	if (!exceptions[params["command"]] && !userId) {
	    if (window.location.href.includes("login.html")) return;
	    if (window.location.href.includes("profile-edit.html")) return;
	    if (window.location.href.includes("contact.html")) return;
	    if (window.location.href.includes("index.html")) return;
	    window.location.href = "login.html?access=true";
	    return;
	}
	
	if (includeUserId) {
	    params["userId"] = userId;
	}

	god.sendQuery(params, showLoadingOverlay);
    }

    god.sendQuery = function(params, showLoadingOverlay) {
	console.log(params["command"]);
	console.log(params);

	// Show full page LoadingOverlay
	if (showLoadingOverlay) {
	    if (showLoadingOverlay == "all") $.LoadingOverlay("show");
	    else $("#" + showLoadingOverlay).LoadingOverlay("show");
	}

	$.ajax({
	    type: "GET",
	    url: "callSendQuery.php",
	    data: params,
	    cache: false,
	    dataType: 'jsonp',
	    jsonpCallback: params.jsonpCallback,
	    contentType: 'application/json; charset=utf-8;',
	    success: function(data) {
		console.log(params.command + ' success');
		console.log(data);
		// Hide loading overlay
		$("#requests").LoadingOverlay("hide");
		$("#request-feed").LoadingOverlay("hide");
		$("#prayer").LoadingOverlay("hide");
		if (showLoadingOverlay) {
		    if (showLoadingOverlay == "all") $.LoadingOverlay("hide");
		    else $("#" + showLoadingOverlay).LoadingOverlay("hide");
		}
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus + ': ' + params.command);
		// Hide loading overlay
		$.LoadingOverlay("hide");
	    }
	});
    }

    god.getCategories = function(callback) {
	god.query("getCategories", callback, {}, false, true);
    }

    $(".dual-nav").on('shown.bs.collapse',function(){
	$(".dual-navv").collapse('show');
    })
    $(".dual-nav").on('hidden.bs.collapse',function(){
	$(".dual-navv").collapse('hide');
    })
});
