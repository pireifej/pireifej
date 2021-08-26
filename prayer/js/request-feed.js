$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    var requestIds = [];
    god.init();
    var pray = $.urlParam("pray");
    var requestId = $.urlParam("requestId");
    var prayersLoaded = false;
    
    if (requestId) {
	var aTag = $("a[name='"+ "my-anchor" +"']");
	$('html,body').animate({scrollTop: aTag.offset().top},'slow');
    }

    if (pray) {
	god.notify("Prayer completed.", "success");
    }
    getRequestFeed();
    god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

    $( "#request-input" ).keyup(function() {
	var request = $("#request-input").val();
	var noChar = request.length;

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

    $("#prayer-cancel").click(function() {
	$("#select-prayer-list").hide();
    });

    $("#select-prayer").click(function() {
	if (prayersLoaded) {
	    $("#select-prayer-list").removeAttr("hidden");
	    $("#select-prayer-list").show();
	    return;
	}	
	god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");
    });

    $("#request-publish").click(function() {
	var requestText = $("#request-input").val();
	var prayerId = $("#select-prayer-box").val();

	if (!requestText) return;
	
	$("#request-publish").prop("disabled", true);
	$("#request-publish").html("Sharing");
	
	var params = {
	    requestText: "\"" + requestText + "\"",
	    requestTitle: "\"From Request Feed Page\"",
	    requestCategoryId: 8,
	    sendEmail: "off",
	    otherPerson: null,//(requestDetails["otherPerson"]) ? requestDetails["otherPerson"] : "",
	    picture: null,//god.getUploadedPicName(),
	    preview: false,
	    prayerId: (prayerId) ? prayerId : 37,
	};
	god.query("createRequest", "afterCreateRequest", params, true, true);	
    })

    window.afterGetAllPrayers = function(response) {
	$("#select-prayer-list").removeAttr("hidden");
	$("#select-prayer-list").show();

	var prayerList = response.result;
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    $("#select-prayer-box").append('<option data-icon="fa-heart" value="'+prayer.prayer_id+'">'+prayer.prayer_title+'</option>');
	}
	$("#select-prayer-box").selectpicker('refresh');
	prayersLoaded = true;
    };

    window.afterCreateRequest = function(response) {
	console.log("window.afterCreateRequest");
	console.log(response);
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
    }

    function getRequestFeed() {
	god.query("getRequestFeed", "afterGetRequestFeed", {"requestId":requestId}, true, true, "request-feed");
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

	var users = response.result;
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
	    requests[response.result[i].request_id].push(response.result[i].real_name);
        }

        for (var key in requests) {
            var people = requests[key];
	    var peopleText = "";

	    if (people.length == 1) {
		peopleText = people[0];
	    }
	    
	    if (people.length == 2) {
		peopleText = people[0] + " and " + people[1];
	    }

            if (people.length > 2) {
                people[people.length - 1] = "and " + people[people.length - 1];
                peopleText = people.join(", ");
            }
	    console.log("I am here!");
	    console.log("#people-who-prayed-" + key);
            $("#people-who-prayed-" + key).html(people.length + "&nbsp;<i class='fa fa-handshake-o'>&nbsp;" + peopleText + " prayed.</i>");
        }
    }
});
