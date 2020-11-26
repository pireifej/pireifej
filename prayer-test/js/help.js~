$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    god.init();

    var userId = localStorage.getItem("userId");

    $("#submit-email").submit(function(e) {
	e.preventDefault();

	var formValues = $("#submit-email").serializeArray();
	var userId = localStorage.getItem("userId");
	var helpDetails = {};
	for (var i = 0; i < formValues.length; i++) {
	    helpDetails[formValues[i].name] = formValues[i].value;
	}

	if (!helpDetails["name"]) return;
	if (!helpDetails["email"]) return;
	if (!helpDetails["subject"]) return;
	if (!helpDetails["message"]) return;

	$("#submit-email-button").prop('disabled', true);
	$("#send-email-text").html("Sending ...");
	
	var params = {
	    command: 'help',
	    jsonpCallback: 'afterHelp',
	    subject: "'" + helpDetails['subject'] + "'",
	    message: "'" + helpDetails['message'] + "'",
	    email: "'" + helpDetails['email'] + "'",
	    userId: (userId) ? userId : "",
	    name: "'" + helpDetails["name"] + "'"
	};

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
