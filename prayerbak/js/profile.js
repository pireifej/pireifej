$( document ).ready(function() {
    window.god = window.god || {};
    var login = $.urlParam('login');
    var create = $.urlParam('create');
    var deleted = $.urlParam('deleted');
    var name = $.urlParam("name");
    var updated = $.urlParam("updated");
    var help = $.urlParam("help");
    var requestIds = [];
        
    getPrayerCount();
    getMyRequests();

    if (help) {
	god.notify("Help is on it's way!.", "success");
    }
    if (updated) {
	god.notify("Profile updated.", "success");
    }
    if (login) {
	god.notify("Welcome back!", "success");
    }
    if (create) {
	god.notify("Request created.", "success");
    }
    if (deleted) {
	god.notify("Request deleted.", "success");
    }

    window.afterGetPrayerCount = function(response) {
	var count = response.result[0]["COUNT(*)"];
	$("#nbrPrayers").html(count + " Prayers");
    }

    window.afterGetMyRequests = function(response) {
	insertRequests(response.result);
	god.init();

	god.query("getPeopleWhoPrayed", "afterGetPeopleWhoPrayed",
		  {requestId: requestIds.join(",")},
		  true, true);
    }

    window.deleteRequest = function(requestId) {
	var buttonText = $("#delete-button").text();
	if (buttonText == "Delete") {
	    $("#delete-button").html("Are you sure?!");
	    return;
	}

	god.query("deleteRequest", "afterDeleteRequest",{requestId: requestId},true, true);
    }

    window.afterGetPeopleWhoPrayed = function(response) {
	console.log("profile.js: afterGetPeopleWhoPrayed success");
	if (!response.result.length) return;
	var requestId = response.result[0].request_id;
	console.log("requestId = " + requestId);
	var requests = {};
	for (var i = 0; i < response.result.length; i++) {
	    if (!requests[response.result[i].request_id]) requests[response.result[i].request_id] = [];
	    requests[response.result[i].request_id].push(response.result[i].real_name);
	}
	console.log(requests);

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
	    $("#people-who-prayed-" + key).html(people.length + "&nbsp;<i class='fa fa-handshake-o'>&nbsp;" + peopleText + " prayed for you.</i>");
	}
    }

    window.afterDeleteRequest = function(response) {
	console.log("profile.js: afterDeleteRequest success");
	console.log(response);
	window.location.href = "profile.html?deleted=true";

//	console.log(globalRequests);
//	$("#nbrRequests").html(globalRequests.length-1 + " Requests");
	//insertRequests(globalRequests);
//	god.notify("Request deleted.", "success");
    };

    $("#delete").confirm({
	text: "Are you sure you want to delete that comment?",
	title: "Confirmation required",
	confirm: function(button) {
	    //delete();
	},
	cancel: function(button) {
	    // nothing to do
	},
	confirmButton: "Yes I am",
	cancelButton: "No",
	post: true,
	confirmButtonClass: "btn-danger",
	cancelButtonClass: "btn-default",
	dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
    });

    function getPrayerCount() {
	god.query("getPrayerCount", "afterGetPrayerCount", {}, true, true);
    }

    function getMyRequests() {
	god.query("getMyRequests", "afterGetMyRequests", {}, true, true, "requests");
    }

    function insertRequests(requests) {
	requestIds = [];
	var htmlPost = "";
	$("#nbrRequests").html(requests.length + " Requests");
	for (var i = 0; i < requests.length; i++) {
	    var request = requests[i];
	    htmlPost += god.getHtmlPost(request, "profile");
	    requestIds.push(request.request_id);
	}
	$("#requests").html(htmlPost);
    }

    $("#edit-profile").click(function() {
	console.log("edit profile!");
	window.location.href = "profile-edit.html";
    });
})
