$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    god.getCategories("afterGetCategories");
    var prevSubject = "";
    var prevRequest = "";
    var prayerInfo = {
	"You decide for me!": 37
    };

    god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");

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

    $("#checkForSomeoneElse").change(function() {
	var otherPersonHtml = "<div id='otherPersonContainer'><div class='wrap-input100 validate-input' data-validate='Person is required'>";
	otherPersonHtml += "<span class='label-input100'>Who are you praying for?</span>";
	otherPersonHtml += "<input id='who-input' class='input100' type='text' name='otherPerson' placeholder='Enter the person's first name'>";
	otherPersonHtml += "</div></div>";
	if (this.checked) {
	    $("#who").after(otherPersonHtml);
	} else {
	    $("#otherPersonContainer").remove();
	}
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

	if (!requestDetails["message"]) return;
	if (!requestDetails["subject"]) return;

	var sendEmail = (!requestDetails["sendEmail"]) ? "off" : "on";

	if (requestDetails["prayer"] == "You decide for me!") {
	    sendEmail = "off";
	}

	requestDetails["subject"] = requestDetails["subject"].replace(/'/g, "\\'");
	requestDetails["message"] = requestDetails["message"].replace(/'/g, "\\'");

	$("#submit-btn").prop("disabled", true);
	$("#submit-label").html("Submitting ...");
	
	params = {
	    requestText: "\"" + requestDetails["message"] + "\"",
	    requestTitle: "\"" + requestDetails["subject"] + "\"",
	    requestCategoryId: categoryId,
	    sendEmail: sendEmail,
	    otherPerson: (requestDetails["otherPerson"]) ? requestDetails["otherPerson"] : "",
	    picture: god.getUploadedPicName(),
	    preview: false,
	    prayerId: prayerInfo[requestDetails["prayer"]]
	};
	god.query("createRequest", "afterCreateRequest", params, true, true);	
    })

    window.preview = function() {
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

	if (!requestDetails["message"]) return;

	requestDetails["subject"] = requestDetails["subject"].replace(/'/g, "\\'");
	requestDetails["message"] = requestDetails["message"].replace(/'/g, "\\'");
	
	var params = {
	    requestTitle: "\"" + requestDetails["subject"] + "\"",
	    requestText: "\"" + requestDetails["message"] + "\"",
	    requestCategoryId: categoryId,
	    sendEmail: "off",
	    preview: true,
	    prayerId: 11,
	    otherPerson: (requestDetails["otherPerson"]) ? requestDetails["otherPerson"] : "",
	    prayerId: prayerInfo[requestDetails["prayer"]]
	};
	console.log(params);
	god.query("createRequest", "afterPreviewPrayer", params, true, false);
    }

    window.afterPreviewPrayer = function(response) {
//	alert(response.result.prayer);
	//	console.log(response.result.scores);
	console.log(response);
	var requestId = response.result.request_id;
//	$("#preview-eye").tooltip();
	console.log("requestId = " + requestId);
	//	$("#prayer-preview").text(response.result);
	god.query("getPrayer", "afterGetPrayerPreview", {requestId: requestId}, false, true, "prayer");
    }

    window.afterGetPrayerPreview = function(response) {
	console.log("window.afterGetPrayerPreview");
	console.log(response);

	if (!response) return;
	var result = response.result;

	if (!result) return;
	var request = result.request;
	
	var prayerText = result.prayer_text;
	var scores = result.scores;
	var chosen = result.scores["chosen"];
	alert(prayerText + chosen);
	console.log(prayerText);
    }

    window.afterGetAllPrayers = function(response) {
	var prayerHtml = "<option>You decide for me!</option>";
	for (var i = 0; i < response.result.length; i++) {
	    prayerHtml += "<option>" + response.result[i].prayer_title + "</option>";
	    prayerInfo[response.result[i].prayer_title] = response.result[i].prayer_id;
	}
	$("#prayer-options").html(prayerHtml);
    }

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
