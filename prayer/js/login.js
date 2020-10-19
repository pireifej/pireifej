$( document ).ready(function() {
    window.god = window.god || {};
    if (localStorage.getItem("userId")) {
	window.location.href = "profile.html";
    }
});
