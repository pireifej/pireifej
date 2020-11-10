$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    god.init();

    var userId = localStorage.getItem("userId");

    $("#form").submit(function(e) {
	e.preventDefault();

	var formValues = $("#form").serializeArray();
	var userId = localStorage.getItem("userId");
	var helpDetails = {};
	for (var i = 0; i < formValues.length; i++) {
	    helpDetails[formValues[i].name] = formValues[i].value;
	}
	
	var params = {
	    command: 'help',
	    jsonpCallback: 'afterHelp',
	    message: "'" + helpDetails['help'] + "'",
	    email: "'" + helpDetails['email'] + "'",
	    userId: (userId) ? userId : ""
	};
	console.log(params);	
	god.sendQuery(params);
    })

    window.afterHelp = function(response) {
	console.log('help success');
	console.log(response);
	if (response.error == 0) {
	    window.location.href = "profile.html?help=true";
	}
    }
});
