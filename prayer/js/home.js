$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    var logout = $.urlParam('signout');
    if (logout) {
	var userId = localStorage.getItem("userId");
	var params = {
	    command: 'getUser',
	    userId: userId,
	    jsonpCallback: "logout"
	  };
	
	god.sendQuery(params);
    }

    window.logout = function(response) {
	console.log(response);
	var name = response.result[0].real_name;
	god.notify("See you later, " + name + "!", "success");
	localStorage.removeItem("userId");
	$('*[id*=user-name]').each(function() {
	    $(this).html("Welcome");
	});
	$("#user-picture").hide();
	$("#user-pic-circle").hide();
	$("#navigation").hide();
	$("#user-notification").hide();
    }
});
