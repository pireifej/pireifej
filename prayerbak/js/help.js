$( document ).ready(function() {
    window.god = window.god || {};
    var email = "";
    var realName = "";
    god.init();

    var subject = $.urlParam('subject');
    if (subject) $("[name='subject']").val(decodeURIComponent(subject));

    $("#submit-email").submit(function(e) {
	e.preventDefault();

	var formValues = $("#submit-email").serializeArray();
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
	    subject: "'" + helpDetails['subject'] + "'",
	    message: "'" + helpDetails['message'] + "'",
	    email: "'" + helpDetails['email'] + "'",
	    name: "'" + helpDetails["name"] + "'"
	};

	god.query("help", "afterHelp", params, true, true);
    })

    window.afterHelp = function(response) {
	if (response.error == 0) {
	    window.location.href = "profile.html?help=true";
	}
    }
});
