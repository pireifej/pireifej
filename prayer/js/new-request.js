$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    god.getCategories("afterGetCategories");
    
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
