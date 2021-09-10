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
    
    var users = null;

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

    $("#picture-cancel").click(function() {
	$("#upload-picture").attr("hidden");
	$("#upload-picture").hide();
	$("#blah").attr("hidden");
	$("#blah").hide();
    });

    $("#prayer-cancel").click(function() {
	$("#select-prayer-list").hide();
	$("#select-prayer-box").val("")
    });

    $("#other-person-cancel").click(function() {
	$("#select-other-person-list").hide();
    });

    $("#upload-picture-btn").click(function() {
	console.log("Hello");
	$("#upload-picture").removeAttr("hidden");
	$("#upload-picture").show();
    });

    $("#select-prayer").click(function() {
	if (prayersLoaded) {
	    $("#select-prayer-list").removeAttr("hidden");
	    $("#select-prayer-list").show();
	    return;
	}
	god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");
    });

    $("#select-other-person").click(function() {
	if (otherPeopleLoaded) {
	    $("#select-other-person-list").removeAttr("hidden");
	    $("#select-other-person-list").show();
	    return;
	}

	$("#select-other-person-list").removeAttr("hidden");
	$("#select-other-person-list").show();

	for (var i = 0; i < users.length; i++) {
	    var person = users[i];
	    $("#select-other-person-box").append('<option style="width:auto;" data-icon="fa-heart" value="'+person.real_name+'">'+person.real_name+'</option>');
	}
	$("#select-other-person-box").selectpicker('refresh');
	otherPeopleLoaded = true;
    });

    $("#request-publish").click(function() {
	var requestText = $("#request-input").val();
	var prayerId = $("#select-prayer-box").val();
	var otherPerson = $("#select-other-person-box").val();

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

	if (!$("#upload-picture").is(":hidden") && god.getUploadedPicName()) {
	    params["picture"] = god.getUploadedPicName();
	}

	god.query("createRequest", "afterCreateRequest", params, true, true);	
    })

    window.afterGetAllPrayers = function(response) {
	$("#select-prayer-list").removeAttr("hidden");
	$("#select-prayer-list").show();

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
    }

    window.afterGetPeopleWhoPrayed = function(response) {
	if (!response.result.length) return;
        var requestId = response.result[0].request_id;

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

/*	    for (var i = 0; i < people.length; i++) {
		peopleImg += "<img src='uploads/" + people[i].picture + "' alt='' class='w-6 h-6 rounded-full border-2 border-white dark:border-gray-900'>";
	    }
*/
	    $("#people-who-prayed-img-" + key).html("<span class='bg-blue-100 h-9 p-1.5 rounded-full text-blue-600 w-9 iconify' data-icon='fxemoji:pray' style='color:blue'></span>");
        }
    }
});
