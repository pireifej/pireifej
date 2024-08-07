$( document ).ready(function() {
    window.god = window.god || {};
    var categories = [];
    var bodyFormData = new FormData();
    var uploadedPicName = "";
    var userRealName = "";
    var allUsers = [];
    var deleteAreYouSure = {};

    $("#pic-upload-form").submit(function(e) {
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
		    $("#blah").removeAttr("hidden");

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
//	$.notify(text, { position: "bottom left", className: type });
    }

    // god functions
    god.init = function () {
	// load all request for this user
	var userId = localStorage.getItem("userId");
	god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

	if (userId) {
	    god.query("getUser", "afterGetUser", {}, true, true, "all");
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

	    // exceptions are creating a user, logging in, contact the website for help
	    if (!window.location.href.includes("register.html"))
		window.location.href = "login.html";
	}

	god.query("getNotifications", "afterGetNotifications", {}, true, true);
	
	$("#copyright").html("&#169; prayerforus.com");
	$("#title").html("Pray For Us - Prayer Social Network");
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

    window.share = function(requestId) {
	FB.ui({
	    display: 'popup',
	    method: 'share',
	    href: 'https://pireifej.com/prayer/pray.html?requestId=' + requestId
//	    quote: 'Please pray for me through the \"Pray for Us\" site'
	}, function(response){});
    };

    window.deleteRequest = function(requestId) {
	var deleteButtonText = $("#delete-text-" + requestId).text();
	
	// first time clicking Delete
	if (deleteButtonText == "Delete") {
	    $("#delete-text-" + requestId).text("Are you sure?");
	    return;
	}

	// second time clicking Delete
	$("#" + requestId).hide();
	god.query("deleteRequest", "afterDeleteRequest",{requestId: requestId},true, true);
    }

    // mode is deprecated, used to be 'feed' or 'profile'
    god.getHtmlPost = function(request, mode) {
	var timeAgo = god.getTimeAgo(request.timestamp);
	var requestText = request.request_text;
	var requestOwnerName = request.real_name;
	var requestPicture = request.request_picture;
	var requestId = request.request_id;
	var userId = localStorage.getItem("userId");
	var requestUserId = request.user_id;
	var requestOtherPerson = request.other_person;
	deleteAreYouSure[requestId] = false;
	requestOtherPerson = (requestOtherPerson !== "undefined") ? " (for " + requestOtherPerson + ")" : "";

	var deleteHtml = (userId == requestUserId) ? "<li> <a onclick='window.deleteRequest(" + requestId +")' class='clicky delete-btn flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600' style='color:red'><i class='iconify' data-icon='bi:trash'></i>     <div id='delete-text-" + requestId + "'>Delete</div></a> </li>" : "";
	var editPostHtml = (userId == requestUserId) ? "<li> <a href='#' class='flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800'><i class='uil-edit-alt mr-1'></i>  Edit Post </a> </li>" : "";
	var addFavoritesHtml = "<li> <a href='#' class='flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800'><i class='uil-favorite mr-1'></i>  Add favorites </a> </li><li><hr class='-mx-2 my-2 dark:border-gray-800'></li>";
	var commentHtml = (true) ? "<div> Comment</div></a><a href='#' class='flex items-center space-x-2 flex-1 justify-end'><div class='p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' width='22' height='22' class='dark:text-gray-100'><path d='M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z'></path></svg></div>" : "";

	var addYourCommentHtml = "<span id='view-comments-" + requestId + "' class='hover:text-blue-600 hover:underline clicky' onclick='loadComments(" + requestId + ")'> View Comments </span><div class='bg-gray-100 rounded-full relative dark:bg-gray-800 border-t'><input id='enter-comment-" + requestId + "' placeholder='Add your Comment..' class='bg-transparent max-h-10 shadow-none px-5'><div class='-m-0.5 absolute bottom-0 flex items-center right-3 text-xl'><span id='send-comment-button-" + requestId + "' class='iconify clicky' onclick='sendComment(" + requestId + ")' data-icon='ant-design:send-outlined' style='margin-bottom:10px'></span></div></div>";

	var newHtml = "<div id='" + requestId + "' class='card lg:mx-0 uk-animation-slide-bottom-small'><!-- post header--><div class='flex justify-between items-center lg:p-4 p-2.5'><div class='flex flex-1 items-center space-x-4'><a href='#'><img id='user-request-picture' name='userrequestpic' src='uploads/" + request.picture + "' class='bg-gray-200 border border-white rounded-full w-10 h-10'></a><div class='flex-1 font-semibold capitalize'><a href='#' class='text-black dark:text-gray-100'>" + requestOwnerName + "</a><div class='text-gray-700 flex items-center space-x-2'> " + timeAgo + " <ion-icon name='people' role='img' class='md hydrated' aria-label='people'></ion-icon></div></div></div><div><a href='#' aria-expanded='false'> <i class='iconify text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-900' data-icon='akar-icons:more-horizontal-fill' data-height='30'></i> </a><div class='bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 uk-drop' uk-drop='mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small'><ul class='clicky space-y-1'><li> <a onclick='window.share(" + requestId + ")' class='flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800'><i class='uil-share-alt mr-1'></i> Share</a> </li>" + editPostHtml + deleteHtml + "</ul></div></div></div><img src='uploads/" + request.request_picture + "' alt='' class='max-h-96 w-full object-cover'><div class='p-3 border-b dark:border-gray-700'>" + requestText + requestOtherPerson + "</div><div class='p-4 space-y-3'> <div class='flex space-x-4 lg:font-bold'><a href='pray.html?requestId=" + requestId + "' class='flex items-center space-x-2'><span class='bg-gray-100 h-9 p-1.5 rounded-full text-blue-600 w-9 cursor-pointer iconify' data-icon='mdi:hands-pray' style='color:blue'></span><div> Pray</div></a><a onclick='window.share(" + requestId + ")' class='flex items-center space-x-2 clicky'><div class='p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' width='22' height='22' class='dark:text-gray-100'><path fill-rule='evenodd' d='M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z' clip-rule='evenodd'></path></svg></div>" + "<div> Share</div></a></div><div class='flex items-center space-x-3 pt-2'> <div class='flex items-center'><div id='people-who-prayed-img-" + requestId + "'></div></div><div id='people-who-prayed-" + requestId + "'></div></div><div id='comments-" + requestId + "'></div>" + addYourCommentHtml + "</div></div></div>";

	newHtml += "</br>";
	
	return newHtml;
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
            if (minutes == 1) timeAgo = " a minute ago";
            else timeAgo = minutes + " minutes ago";
        }

        if (days == 0 && hours == 0 && minutes == 0) {
            //timeAgo = parseInt(seconds) + " just now";
	    timeAgo = " just now";
        }
	return timeAgo;
    }

    window.afterDeleteRequest = function(response) {
	console.log("window.afterDeleteRequest");
	console.log(response);
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
	allUsers = users;
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
	$("#notification-list").empty();
	var htmlNotifications = "";

	var notifications = response.result;
	if (!notifications.length) return;

	for (var i = 0; i < notifications.length; i++) {
	    var entry = notifications[i];
	    var timeAgo = god.getTimeAgo(entry.timestamp);
	    htmlNotifications += "<li class='not-read'><a href='#'><div class='drop_avatar status-online'> <img src='uploads/" + entry.picture + "' alt=''></div><div class='drop_text'><p><strong>" + entry.real_name + "</strong> prayed for you.</p><time>" + timeAgo + "</time></div></a></li>";
	}
	
	$("#notifications-count").html(notifications.length);
	
	// hard code additional empty spaces strictly for mobile display purposes
	$("#notification-list").html(htmlNotifications+"<li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div></div></a></li><li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div><div class='drop_text'><p></div></a></li><li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div><div class='drop_text'><p></div></a></li><li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div><div class='drop_text'></div></a></li><li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div><div class='drop_text'></div></a></li><li><a href='#'><div class='drop_avatar'><img src='assets/images/avatars/avatar-1.jpg' alt=''></div><div class='drop_text'></div></a></li>");
    }

    window.goToRequestFeed = function() {
	window.location.href = "request-feed.html";
    }

    window.afterGetUser = function(response) {
	var user = response.result[0];

	console.log("checking user in afterGetUser...");
	console.log(user);

	// admin-level displays
	$("#assign-prayer-menu").hide();
	$("#prayer-admin-menu").hide();
//	$("#create-prayer-menu").hide();

	if (user.user_name == "pireifej" || user.user_name == "10101437702988656") {
	    $("#assign-prayer-menu").show();
	    $("#prayer-admin-menu").show();
//	    $("#create-prayer-menu").show();
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
	$("[name=realname]").val(user.real_name);
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

	if (user.gender == "male") {
	    $('select[name=gender]').val(0);
	    $('.selectpicker').selectpicker('refresh')
	}
	if (user.gender == "female") {
	    $('select[name=gender]').val(1);
	    $('.selectpicker').selectpicker('refresh')
	}
    }

    god.getEnv = function() {
	return "prod";
    }

    window.logout = function() {
	var userId = localStorage.getItem("userId");
	console.log(userId);
	if (userId) {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	}
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
	    if (window.location.href.includes("contact.html")) return;
	    if (window.location.href.includes("index.html")) return;
	    if (window.location.href.includes("register.html")) return;
	    window.location.href = "login.html";
	    return;
	}
	
	if (includeUserId) {
	    params["userId"] = userId;
	}

	god.sendQuery(params, showLoadingOverlay);
    }

    god.sendQuery = function(params, showLoadingOverlay) {
	console.log(params);

	if (window.location.protocol !== "https:") {
	    var command = params["command"];
	    console.log(command);
	    
	    return;
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
		console.log(data);
		// Hide loading overlay
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus + ': ' + params.command);
		// Hide loading overlay
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
