$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    var requestIndex = 0;
    var prayerList = [];
    var requestList = [];

    god.query("getUnassignedPrayers", "afterGetUnassignedPrayers", {}, false, true);
    god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");

    window.afterAssignPrayer = function(response) {
	requestIndex++;
	if (!requestList[requestIndex]) {
	    alert("All done!");
	    $("#request-text").val("");
	    $("#prayer-for").val("");
	    return;
	}
	
	$("#request-text").val(requestList[requestIndex].request_text);
	$("#prayer-for").val("Prayer For " + requestList[requestIndex].other_person);
    }
    
    window.afterGetUnassignedPrayers = function(response) {
	requestList = response.result;
	if (!requestList[requestIndex]) {
	    alert("All done!");
	    return;
	}
	$("#request-text").val(requestList[requestIndex].request_text);
	$("#prayer-for").val("Prayer For " + requestList[requestIndex].other_person);
    };

    window.afterGetAllPrayers = function(response) {
	prayerList = response.result;
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    $("#select-prayer-box").append('<option style="width:auto;" data-icon="fa-heart" value="'+prayer.prayer_id+'">'+prayer.prayer_title+'</option>');
	}
	$("#select-prayer-box").selectpicker('refresh');
    }

    $( "#skip" ).click(function() {
	console.log("skip");
    });

    $( "#assign-prayer" ).click(function() {
	var params = {
	    request_id: requestList[requestIndex].request_id,
	    prayer_id: $("#select-prayer-box").val()
	};
	god.query("assignPrayer", "afterAssignPrayer", params, true, false, "all");
    });

    $('select').on('change', function(e){
	var prayerId = this.value;
	for (var i = 0; i < prayerList.length; i++) {
	    if (prayerList[i].prayer_id == prayerId) {
		$("#prayer_text").val(prayerList[i].prayer_text);
		break;
	    }
	}
    });
});
