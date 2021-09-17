$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");

    var allPrayers = [];
    var prayerId = null;

    $("#update-prayer").click(function(e) {
	var prayerName = $("#prayer-name").val();
	var prayerText = $("#prayer-text").val();
	var newPrayerText = "";

	if (prayerText) {
	    newPrayerText = prayerText.replace(/'/g, "\\'");
	}

	var params = {
	    prayerText: "\"" + newPrayerText + "\"",
	    prayerTitle: "\"" + prayerName + "\"",
	    prayerId: prayerId
	};

	$("#update-prayer").prop("disabled", true);
	$("#update-prayer").html("Updating Prayer ...");
	
	god.query("updatePrayer", "afterUpdatePrayer", params, false, false);
    })

    window.afterReadPrayer = function(response) {
	$("#prayer-text-input").val(response.result[0].prayer_text);
    }

    $( "#select-prayer-box" ).change(function() {
	for (var i = 0; i < allPrayers.length; i++) {
	    var prayer = allPrayers[i];
	    if (prayer.prayer_id == $("#select-prayer-box").val()) {
		$("#prayer-name").val(prayer.prayer_title);
		$("#prayer-text").val(prayer.prayer_text);
		prayerId = prayer.prayer_id;
		break;
	    }
	}
    });

    function compare( a, b ) {
	if ( a.prayer_title < b.prayer_title ){
	    return -1;
	}
	if ( a.prayer_title > b.prayer_title ){
	    return 1;
	}
	return 0;
    }

    window.afterGetAllPrayers = function(response) {
	var prayerList = response.result;
	allPrayers = prayerList;

	prayerList.sort(compare);

	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    $("#select-prayer-box").append('<option style="width:auto;" data-icon="fa-heart" value="'+prayer.prayer_id+'">'+prayer.prayer_title+'</option>');
	}
	$("#select-prayer-box").selectpicker('refresh');

	var firstPrayer = prayerList[0];
	$("#prayer-name").val(firstPrayer.prayer_title);
	$("#prayer-text").val(firstPrayer.prayer_text);
	prayerId = firstPrayer.prayer_id;
    }

    window.autoGrow = function(element) {
	element.style.height = "5px";
	element.style.height = (element.scrollHeight)+"px";
    }

    window.afterUpdatePrayer = function(response) {
	if (response.error == 0) {
	    $("#update-prayer").prop("disabled", false);
	    $("#update-prayer").html("Update Prayer");
	}
    }
});
