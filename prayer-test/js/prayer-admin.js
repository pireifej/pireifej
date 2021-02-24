$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    god.getCategories("afterGetCategories");
    god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false);
    
    var prevSubject = "";
    var prevRequest = "";
    var allPrayers = [];
    var prayerId = null;

    $("#edit-prayer").submit(function(e) {
	e.preventDefault();

	var formValues = $("#edit-prayer").serializeArray();
	var category = $("#category-options").val();
	var prayerName = $("#prayer-names").val();

	var categoryId = "8";
	for (var i = 0; i < god.categories.length; i++) {
	    if (god.categories[i].category_name == category) {
		categoryId = god.categories[i].category_id;
		break;
	    }
	}
	var requestDetails = {};
	for (var i = 0; i < formValues.length; i++) {
	    var formValue = formValues[i];
	    var value = formValue.value;
	    var name = formValue.name;
	    if (!value) continue;
	    requestDetails[name] = value;
	}

//	if (!requestDetails["message"]) return;
//	if (!requestDetails["subject"]) return;

//	var sendEmail = (!requestDetails["sendEmail"]) ? "off" : "on";

//	requestDetails["subject"] = requestDetails["subject"].replace(/'/g, "\\'");
//	requestDetails["message"] = requestDetails["message"].replace(/'/g, "\\'");

	var prayerFileName = requestDetails["prayer-names"];

	console.log(requestDetails);

	if (prayerFileName == "Create a new prayer") {
	    $("#submit-btn").prop("disabled", true);
	    $("#submit-label").html("Creating Prayer ...");
	    prayerFileName = requestDetails["prayer-file-name"];
	} else {
	    $("#submit-btn").prop("disabled", true);
	    $("#submit-label").html("Updating Prayer ...");
	}
	
	params = {
	    prayerText: "\"" + requestDetails["prayer-text"] + "\"",
	    prayerTags: "\"" + requestDetails["tags"] + "\"",
	    prayerTitle: "\"" + requestDetails["prayer-title"] + "\"",
	    prayerName: "\"" + prayerFileName + "\"",
	    prayerId: prayerId,
	    categoryId: categoryId
	};
	console.log(params);
	if (prayerName == "Create a new prayer") {
	    god.query("createPrayer", "afterCreatePrayer", params, false, false);
	} else {
	    god.query("updatePrayer", "afterUpdatePrayer", params, false, false);
	}
    })

    window.afterReadPrayer = function(response) {
	$("#prayer-text-input").val(response.result);
    }

    window.afterGetAllPrayers = function(response) {
	console.log(response);
	var prayerNamesHtml = "<option>Select a prayer name</option>";
	prayerNamesHtml += "<option>Create a new prayer</option>";
	for (var i = 0; i < response.result.length; i++) {
	    prayerNamesHtml += "<option>" + response.result[i].prayer_file_name + "</option>";
	    allPrayers.push(response.result[i]);
	}
	$("#prayer-names").html(prayerNamesHtml);
    }

    window.selectCategory = function() {
	var prayerName = $("#prayer-names").val();
	if (prayerName !== "Create a new prayer") return;
	var category = $("#category-options").val();
	var fileNameNo = 1;
	for (var i = 0; i < allPrayers.length; i++) {
	    var prayer = allPrayers[i];
	    var prayerFileName = prayer.prayer_file_name;
	    var withNoDigits = prayerFileName.replace(/[0-9]/g, '');
	    if (withNoDigits.toLowerCase() == category.toLowerCase()) {
		fileNameNo++;
	    }
	}
	var newPrayerFile = category.toLowerCase() + fileNameNo;
	$("#prayer-file-name-input").val(newPrayerFile);
	console.log(newPrayerFile);
    }

    window.selectPrayerName = function() {
	console.log("window.selectPrayerName");
	var prayerName = $("#prayer-names").val();
	if (prayerName == "Create a new prayer") {
	    $("#prayer-title-input").val("");
	    $("#tags-input").val("");
	    $("#category-options").val("");
	    $("#prayer-text-input").val("");
	    $("#prayer-file-name-input").val("");
	    $("#submit-label").html("Create Prayer");
	    return;
	}
	$("#submit-label").html("Update Prayer");
	for (var i = 0; i < allPrayers.length; i++) {
	    var prayer = allPrayers[i];
	    prayerId = prayer.prayer_id;
	    if (prayer.prayer_file_name == prayerName) {
		console.log(prayer);
		$("#prayer-title-input").val(prayer.prayer_title);
		$("#prayer-file-name-input").val(prayer.prayer_file_name);
		$("#tags-input").val(prayer.tags);

		god.query("readPrayer", "afterReadPrayer", {"fileName":prayer.prayer_file_name}, false, false);

		var categoryName = null;
		for (var j = 0; i < god.categories.length; j++) {
		    if (god.categories[j].category_id == prayer.fk_category_id) {
			categoryName = god.categories[j].category_name;
			$("#category-options").val(categoryName);
			break;
		    }
		}
		break;
	    }
	}
    }

    window.afterGetCategories = function(response) {
	var categoryHtml = "<option>Select a category</option>";
	for (var i = 0; i < response.result.length; i++) {
	    categoryHtml += "<option value='" + response.result[i].category_name + "'>" + response.result[i].category_name + "</option>";
	}

	$("#category-options").html(categoryHtml);

	god.categories = response.result;
    }

    window.afterCreatePrayer = function(response) {
	console.log("afterCreatePrayer");
	if (response.error == 0) {
	    god.notify("Prayer Created", "success");
	    $("#submit-btn").prop("disabled", false);
	    $("#submit-label").html("Update Prayer");
	}
    }

    window.afterUpdatePrayer = function(response) {
	console.log("afterUpdatePrayer");
	if (response.error == 0) {
	    god.notify("Prayer Updated", "success");
	    $("#submit-btn").prop("disabled", false);
	    $("#submit-label").html("Update Prayer");
	}
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
