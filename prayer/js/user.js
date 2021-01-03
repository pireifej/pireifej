$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    var thisUserId = $.urlParam('userId');
    console.log("thisUserId = " + thisUserId);
    if (thisUserId) {
	god.query("getThisUser", "afterGetThisUser", {thisUserId: thisUserId}, false, true);
    }

    window.afterGetThisUser = function(response) {
	$("#my-picture").attr("src", response.result[0].picture);
	$("#my-title").html(response.result[0].user_title);
	$("#my-about").html(response.result[0].user_about);
	$("#my-name").html(response.result[0].real_name);
    }
});
