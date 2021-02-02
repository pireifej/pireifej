$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    var logout = $.urlParam('signout');
    if (logout) {
	god.query("getUser", "logout", {}, true, true);
    }

    window.logout = function(response) {
	localStorage.removeItem("userId");
	god.init();
	var name = response.result[0].real_name;
	god.notify("See you later, " + name + "!", "success");
    }
});
