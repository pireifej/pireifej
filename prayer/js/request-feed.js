$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    var categories = [];
    var requestIds = [];
    god.init();
    var pray = $.urlParam("pray");

    if (pray) {
	god.notify("Prayer completed.", "success");
    }
    getRequestFeed();
    god.getCategories("afterGetCategories");
    god.query("getAllUsers", "afterGetAllUsers", {}, false, true);

    $("#headerImage").css("margin-bottom", "50px");
    $("#headerImage").css("background", "linear-gradient(rgba(34, 34, 34, 0.7), rgba(34, 34, 34, 0.7)), url('img/blog/FULL.jpg') no-repeat center center");
    $("#headerImage").css("background-color: #777777");
    $("#headerImage").css("background-attachment", "scroll");
    $("#headerImage").css("-webkit-background-size", "cover");
    $("#headerImage").css("-moz-background-size", "cover");
    $("#headerImage").css("-o-background-size", "cover");
    $("#headerImage").css("background-size", "cover");
    
    $("#quickRequestPost").click(function() {
	var categoryId = null;
	for (var i = 0; i < categories.length; i++) {
	    if (categories[i].category_name == "general") {
		categoryId = categories[i].category_id;
		break;
	    }
	}

	var text = $("#quickRequestText").val();

	if (!text) {
	    god.notify("Quick request needs a message", "error");
	    return;
	}

	$("#quickRequestPost").html("Posting now ...");
	$("#quickRequestPost").prop("disabled", true);
	
	params = {
	    requestText: "\"" + $("#quickRequestText").val() + "\"",
	    requestTitle: "Quick Request",
	    requestCategoryId: categoryId
	};
	god.query("createRequest", "afterQuickCreateRequest", params, false, true);
    })

    function insertRequestFeed(response) {
	$("#request-feed").empty();
	var htmlPost = "";
	requestIds = [];
	var nbrRequests = response.result.length;
	$("#nbrRequests").html(nbrRequests + " Requests");

	if (nbrRequests == 0) {
	    $("#request-feed").html("<h5>You prayed for everyone! Check back later.</h5>");
	    return;
	}
	
	for (var i = 0; i < response.result.length; i++) {
	    var request = response.result[i];
	    htmlPost += god.getHtmlPost(request, "feed");
	    requestIds.push(request.request_id);
	}
	$("#request-feed").html(htmlPost);
    }

    function getRequestFeed() {
	god.query("getRequestFeed", "afterGetRequestFeed", {}, true, true);
	god.query("getPrayerCount", "afterGetPrayerCount", {}, true, true);
	god.query("getMyRequests", "afterGetMyRequests", {}, true, true);
    }

     window.afterGetMyRequests = function(response) {
         $("#no-requests").html("<a href='#'><i class='fa fa-edit'></i></a>" + response.result.length);
     }

    window.afterGetPrayerCount = function(response) {
	console.log("IREIFEJ");
	console.log(response);
         var count = response.result[0]["COUNT(*)"];
         $("#no-prayers").html("<a href='#'><i class='fa fa-handshake'></i></a>" + count);
    }

    window.afterGetAllUsers = function(response) {
	var html = "<ul class='people-rel-list-photos' id='all-users'>";
	$("#no-users").html("<a href='#'><i class='fa fa-users'></i></a>" + response.result.length);

	var users = response.result;
	for (var i = 0; i < users.length; i++) {
	    var user = users[i];
	    html += "<li><a href='user.html?userId=" + user.user_id + "'><img src='" + user.picture + "' alt=''></a></li>";
	}
	html += "</ul>";
	$("#all-users").html(html);
    }

    window.afterGetCategories = function(response) {
	categories = response.result;
    };

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
            $("#people-who-prayed-" + key).html(people.length + "&nbsp;<i class='fa fa-handshake-o'>&nbsp;" + peopleText + " prayed.</i>");
        }
    }

    window.afterQuickCreateRequest = function(response) {
	$("#quickRequestText").val("");
	god.notify("Quick request created.", "success");
    }
});
