$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    $("#create-prayer").click(function(e) {
	var prayerName = $("#prayer-name").val();
	var prayerText = $("#prayer-text").val();
	var newPrayerText = "";

	if (prayerText) {
	    newPrayerText = prayerText.replace(/'/g, "\\'");
	}

	var params = {
	    prayerText: "\"" + newPrayerText + "\"",
	    prayerTitle: "\"" + prayerName + "\""
	};

	$("#create-prayer").prop("disabled", true);
	$("#create-prayer").html("Creating Prayer ...");

	god.query("createPrayer", "afterCreatePrayer", params, false, false);
    })

    window.afterCreatePrayer = function(response) {
	if (response.error == 0) {
	    window.location.href = "index.html";
	}
    }
});
