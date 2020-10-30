$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    var logout = $.urlParam('signout');
    if (logout) {
	god.notify("See you later, " + localStorage.getItem("userRealName") + "!", "success");
	localStorage.removeItem("userId");
	localStorage.removeItem("userRealName");
	localStorage.removeItem("userTitle");
	localStorage.removeItem("userLocation");
	localStorage.removeItem("userAbout");
	localStorage.removeItem("userCreated");
    }
    if (!localStorage.getItem("userId")) {
	$("#user-name").html("Welcome");
	$("#user-pic").hide();
	$("#user-pic-circle").hide();
	$("#navigation").hide();
	$("#user-notification").hide();
    }
});
