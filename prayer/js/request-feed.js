$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    var requestIds = [];
    god.init();
    var pray = $.urlParam("pray");
    var requestId = $.urlParam("requestId");

    // 'add to your request' data loaded status
    var prayersLoaded = false;
    var otherPeopleLoaded = false;

    // 'add to your request' view toggle status
    var prayersOpen = false;
    var otherPeopleOpen = false;

    var sectionState = {
	"prayers": false,
	"person": false,
	"picture": false,
	"person-dropdown": false
    };
    
    var users = null;
    var commentRequestId = null;

    if (pray) {
	god.notify("Prayer completed.", "success");
    }
    getRequestFeed();
    god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

    $( "#request-input" ).keyup(function() {
	var request = $("#request-input").val();
	var noChar = request.length;

	if (noChar == 0) {
	    $("#request-publish").css("color", "gray");
	}

	if (noChar > 0) {
	    $("#request-publish").css("color", "white");
	}

	if (noChar <= 100) $("#no-char-request").css("color", "lightgreen");
	if (noChar > 150 && noChar <= 199) $("#no-char-request").css("color", "orange");
	if (noChar >= 200) {
	    $("#no-char-request").css("color", "red");
	    $("#request-input").val(prevRequest);
	    $("#no-char-request").text(noChar);
	    return;
	}
	$("#no-char-request").text(noChar);
	prevRequest = request;
    });

    $("#other-person-entry").click(function() {
	sectionState["person-dropdown"] = !sectionState["person-dropdown"]
	updateSectionVisibility();
    });

    $("#upload-picture-btn").click(function() {
	sectionState["picture"] = !sectionState["picture"];
	updateSectionVisibility();
    });

    $("#select-prayer").click(function() {
	sectionState["prayers"] = !sectionState["prayers"];
	updateSectionVisibility();
	if (!prayersLoaded) god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");
    });

    $("#select-other-person").click(function() {
	sectionState["person"] = !sectionState["person"];
	updateSectionVisibility();

	if (otherPeopleLoaded) return;
	var selectOtherPersonBoxHtml = "";
	for (var i = 0; i < users.length; i++) {
	    var person = users[i];
	    selectOtherPersonBoxHtml+="<li onclick='selectOtherPerson(" + i + ")'><a href='#'><img src='uploads/" + person.picture + "' alt='' class='list-avatar'><div class='list-name'>" + person.real_name + "</div></a></li>";
	}

	$("#select-other-person-box").html(selectOtherPersonBoxHtml);
	otherPeopleLoaded = true;
    });

    function updateSectionVisibility() {
	console.log("updateSectionVisibility");
	console.log(sectionState);

	// prayers section
	if (sectionState["prayers"]) {
	    $("#select-prayer-list").removeAttr("hidden");
	    $("#select-prayer-list").show();
	} else {
	    $("#select-prayer-list").hide();
	    $("#select-prayer-box").val("")
	}

	// other person section
	if (sectionState["person"]) {
	    $("#select-other-person-list").removeAttr("hidden");
	    $("#select-other-person-list").show();
	    $("#select-other-person-box").show();
	} else {
	    $("#select-other-person-list").hide();
	    $("#select-other-person-box").hide();
	}

	// picture section
	if (sectionState["picture"]) {
	    $("#blah").removeAttr("hidden");
	    $("#blah").show();
	} else {
	    $("#blah").attr("hidden");
	    $("#blah").hide();
	}

	// person list dropdown
	if (!sectionState["person-dropdown"]) {
//	    $("#select-other-person-box").show();
	} else {
//	    $("#select-other-person-box").hide();
	}
    }

    $("#request-publish").click(function() {
	var requestText = $("#request-input").val();
	var prayerId = $("#select-prayer-box").val();
	var otherPerson = $("#other-person-entry").val();

	if (!requestText) {
	    return;
	}
	
	$("#request-publish").prop("disabled", true);
	$("#request-publish").html("Sharing");

	var params = {
	    requestText: "\"" + requestText + "\"",
	    requestTitle: "\"From Request Feed Page\"",
	    requestCategoryId: 8,
	    sendEmail: $("#sendEmail").val(),
	    preview: false,
	    prayerId: (prayerId) ? prayerId : 37,
	};

	if (!$("#select-other-person-list").is(":hidden") && otherPerson) {
	    params["otherPerson"] = otherPerson;
	}

	if (!$("#blah").is(":hidden") && god.getUploadedPicName()) {
	    params["picture"] = god.getUploadedPicName();
	}

	console.log(params);
	god.query("createRequest", "afterCreateRequest", params, true, true);	
    })

    window.sendComment = function(requestId) {
	commentRequestId = requestId;
	var params = {
	    requestId: requestId,
	    comment: "'" + $("#enter-comment-" + requestId).val() + "'"
	};
	god.query("postComment", "afterPostComment", params, true, true);
    }

    window.afterPostComment = function(response) {
	$("#enter-comment-" + commentRequestId).val("");
	god.query("getRequestComments", "afterGetRequestComments", { requestId: commentRequestId }, false, true, "comments-" + commentRequestId);
    };

    window.selectOtherPerson = function(i) {
	sectionState["person-dropdown"] = !sectionState["person-dropdown"];
	$("#other-person-entry").val(users[i].real_name);
	$("#select-other-person-box").hide();
//	updateSectionVisibility();
    }

    window.afterGetAllPrayers = function(response) {
	var prayerList = response.result;
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    $("#select-prayer-box").append('<option style="width:auto;" data-icon="fa-heart" value="'+prayer.prayer_id+'">'+prayer.prayer_title+'</option>');
	}
	$("#select-prayer-box").selectpicker('refresh');
	prayersLoaded = true;
    };

    window.afterCreateRequest = function(response) {
	console.log("window.afterCreateRequest");
	window.location.href = "index.html";
    }

    function insertRequestFeed(response) {
	$("#request-feed").empty();
	var htmlPost = "";
	requestIds = [];
	var nbrRequests = response.result.length;
	$("#nbrRequests").html(nbrRequests + " Requests");

	if (nbrRequests == 0) {
	    $("#request-feed").html("<h5 style='padding:30px 30px 30px 30px'>You prayed for everyone! Check back later.</h5>");
	    return;
	}

	for (var i = 0; i < response.result.length; i++) {
	    var request = response.result[i];
	    requestIds.push(request.request_id);
	    htmlPost += god.getHtmlPost(request, "feed");
	}
	$("#request-feed").html(htmlPost);

	var requestId = $.urlParam("requestId");
	if (requestId) {
	    var targetOffset = $('#' + requestId).offset();
	    var targetTop = targetOffset.top;
	    $('html, body').animate({
		scrollTop: targetTop
	    }, 800);
	}
    }

    function getRequestFeed() {
	god.query("getRequestFeed", "afterGetRequestFeed", {}, true, true);//, "request-feed");
	god.query("getPrayerCount", "afterGetPrayerCount", {}, true, true);
	god.query("getMyRequests", "afterGetMyRequests", {}, true, true);
    }

     window.afterGetMyRequests = function(response) {
         $("#no-requests").html("<a href='#'><i class='fa fa-edit'></i></a>" + response.result.length);
     }

    window.afterGetPrayerCount = function(response) {
         var count = response.result[0]["COUNT(*)"];
         $("#no-prayers").html("<a href='#'><i class='fa fa-handshake'></i></a>" + count);
    }

    window.afterGetAllUsers = function(response) {
	var html = "<ul class='people-rel-list-photos' id='all-users'>";
	$("#no-users").html("<a href='#'><i class='fa fa-users'></i></a>" + response.result.length);

	users = response.result;
	for (var i = 0; i < users.length; i++) {
	    var user = users[i];
	    html += "<li><a href='user.html?userId=" + user.user_id + "'><img src='uploads/" + user.picture + "' alt=''></a></li>";
	}
	html += "</ul>";
	$("#all-users").html(html);
    }
    
    window.afterGetRequestFeed = function(response) {
	insertRequestFeed(response);
	god.query("getPeopleWhoPrayed", "afterGetPeopleWhoPrayed", { requestId:  requestIds.join(",") }, false, true);
	god.query("getRequestComments", "afterGetRequestComments", { requestId:  requestIds.join(",") }, false, true);
    }

    window.afterGetRequestComments = function(response) {
	console.log("window.afterGetRequestComments");
	console.log(response);

	if (!response.result.length) return;

	var comments = {};
	for (var i = 0; i < response.result.length; i++) {
	    if (!comments[response.result[i].request_id]) comments[response.result[i].request_id] = [];
	    comments[response.result[i].request_id].push({
		name:response.result[i].real_name,
		picture:response.result[i].picture,
		comment:response.result[i].comment,
		timestamp:response.result[i].timestamp
	    });
	}

	for (var key in comments) {
	    var commentList = comments[key];
	    var userCommentsHtml = "<div class='border-t py-4 space-y-4 dark:border-gray-600'>";
	    for (var i = 0; i < commentList.length; i++) {
		var currComment = commentList[i];
		var timeAgo = god.getTimeAgo(currComment.timestamp);

		userCommentsHtml += "<div class='flex'><div class='w-10 h-10 rounded-full relative flex-shrink-0'><img src='uploads/" + currComment.picture + "' alt='' class='absolute h-full rounded-full w-full'></div><div><div class='text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12  dark:bg-gray-800 dark:text-gray-100'><p class='leading-6'>" + currComment.comment + "</p><div class='absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800'></div></div><div class='text-sm flex items-center space-x-3 mt-2 ml-5'><span>" + timeAgo + "</span></div></div></div>";
	    }
	    $("#comments-"+key).html(userCommentsHtml + "</div>");
	}
    };

    window.afterGetPeopleWhoPrayed = function(response) {
	if (!response.result.length) return;

	var requests = {};
        for (var i = 0; i < response.result.length; i++) {
            if (!requests[response.result[i].request_id]) requests[response.result[i].request_id] = [];
	    requests[response.result[i].request_id].push({name:response.result[i].real_name,picture:response.result[i].picture});
        }

        for (var key in requests) {
            var people = requests[key];
	    var peopleText = "";
	    var peopleImg = "";

	    if (people.length == 1) {
		peopleText = people[0].name;
	    }
	    
	    if (people.length == 2) {
		peopleText = people[0].name + " and " + people[1].name;
	    }

            if (people.length > 2) {
		peopleText = people[0].name + " and " + (people.length - 1) + " other people ";
            }
            $("#people-who-prayed-" + key).html("<div class='dark:text-gray-100'>Thank you, <strong>" + peopleText + "</strong> for your prayer.</div>");

	    $("#people-who-prayed-img-" + key).html("<span class='bg-blue-100 h-9 p-1.5 rounded-full text-blue-600 w-9 iconify' data-icon='fxemoji:pray' style='color:blue'></span>");
        }
    }
});
