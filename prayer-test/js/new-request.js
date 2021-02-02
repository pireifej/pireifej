$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    god.getCategories("afterGetCategories");
    var prevSubject = "";
    var prevRequest = "";

    $( "#subject-input" ).keyup(function() {
	var subject = $("#subject-input").val();
	var noChar = subject.length;
	if (noChar <= 20) $("#no-char-subject").css("color", "lightgreen");
	if (noChar > 20 && noChar <= 29) $("#no-char-subject").css("color", "orange");
	if (noChar >= 30) {
	    $("#no-char-subject").css("color", "red");
	    $("#subject-input").val(prevSubject);
	    $("#no-char-subject").text(noChar);
	    return;
	}
	$("#no-char-subject").text(noChar);
	prevSubject = subject;
    });

    $( "#request-input" ).keyup(function() {
	var request = $("#request-input").val();
	var noChar = request.length;

	if (noChar <= 100) $("#no-char-request").css("color", "lightgreen");
	if (noChar > 150 && noChar <= 199) $("#no-char-request").css("color", "orange");
	if (noChar >= 200) {
	    $("#no-char-request").css("color", "red");
	    $("#request-input").val(prevRequest);
	    $("#no-char-request").text(noChar);
	    return;
	}
	$("#no-char-request").text(noChar);
	prevRequest = request;
    });
    
    $("#new-request").submit(function(e) {
	e.preventDefault();

	var formValues = $("#new-request").serializeArray();
	var category = $("#category-options").val();

	var categoryId = "8";
	for (var i = 0; i < god.categories.length; i++) {
	    if (god.categories[i].category_name == category) {
		categoryId = god.categories[i].category_id;
		break;
	    }
	}
	var requestDetails = {};
	for (var i = 0; i < formValues.length; i++) {
	    requestDetails[formValues[i].name] = formValues[i].value;
	}

	console.log(requestDetails);

	if (!requestDetails["message"]) return;
	if (!requestDetails["subject"]) return;

	var sendEmail = (!requestDetails["sendEmail"]) ? "off" : "on";

	requestDetails["subject"] = requestDetails["subject"].replace(/'/g, "\\'");
	requestDetails["message"] = requestDetails["message"].replace(/'/g, "\\'");

	$("#submit-btn").prop("disabled", true);
	$("#submit-label").html("Submitting ...");
	
	params = {
	    requestText: "\"" + requestDetails["message"] + "\"",
	    requestTitle: "\"" + requestDetails["subject"] + "\"",
	    requestCategoryId: categoryId,
	    sendEmail: sendEmail
	};
	god.query("createRequest", "afterCreateRequest", params, true, true);	
    })

    window.afterGetCategories = function(response) {
	var categoryHtml = "<option>Select a category</option>";
	for (var i = 0; i < response.result.length; i++) {
	    categoryHtml += "<option>" + response.result[i].category_name + "</option>";
	}

	$("#category-options").html(categoryHtml);

	god.categories = response.result;
    }

    window.afterCreateRequest = function(response) {
	window.location.href = "profile.html?create=true";
    }

    window.afterGetPrayer = function(response) {
	var prayerText = response.result[0].prayer_text;
	var realName = $("#real-name").html();

	// substitute for name and gender
	$.ajax({
	    url: "https://api.genderize.io?name=" + realName,
	    dataType: "json",
	    success: function(data) {
		prayerText = god.getCustomPrayer(prayerText, data.gender, realName);
		var lines = prayerText.split("\n");
		var prayerTextHtml = "";
		for (var i = 0; i < lines.length; i++) {
		    prayerTextHtml += "<p>" + lines[i] + "</p>";
		}
		$("#prayer-preview").html(prayerTextHtml);	
	    }
	});
    }
});
