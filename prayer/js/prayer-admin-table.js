var windowSelection = null;
var globalTextAreaId = null;
var start = null;
var end = null;
var maxIndex = 0;

function format ( prayerText, index ) {
    var textArea = "<textarea id='prayer-text-input-" + index + "' class='input100 longer' name='prayer-text' placeholder='Your prayer text here...' onkeydown=getLastHighlighted(" + index + ")>" + prayerText + "</textarea>";
    var saveButton2 = "<button onclick='updatePrayer(\"" + index + "\")'>Save</button>";
    return textArea + saveButton2;
}

function formatNewPrayer ( prayerText, index ) {
    var textArea = "<textarea id='prayer-text-input-" + index + "' class='input100 longer' name='prayer-text' placeholder='Your prayer text here...' onkeydown=getLastHighlighted(" + index + ")>" + prayerText + "</textarea>";
    var saveButton2 = "<button onclick='createPrayer(\"" + index + "\")'>Save</button>";
    return textArea + saveButton2;
}

// Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function (event) {    
    // Avoid the real one
    event.preventDefault();
    
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).
    
    // In the right position (the mouse)
    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
});


// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {
    
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {
        
        // Hide it
        $(".custom-menu").hide(100);
    }
});


// If the menu element is clicked
$(".custom-menu li").click(function(){
    // This is the triggered action name

    switch($(this).attr("data-action")) {
        // A case for each action. Your actions here
    case "name": insertVar("name"); break;
    case "gender1": insertVar("gender1"); break;
    case "gender2": insertVar("gender2"); break;
    case "gender3": insertVar("gender3"); break;
    }

    function insertVar(variable) {
	var el = document.getElementById(globalTextAreaId);
	el.setRangeText("{{" + variable + "}}", start, end, 'select');
	return;

	console.log($(globalTextAreaId).selectionStart);

	typeInTextarea("{{" + variable + "}}");
	return;

	var sel, range;
	var replacementText = "{{" + variable + "}}";
	if (windowSelection) {
            sel = windowSelection
            if (sel.rangeCount) {
		range = sel.getRangeAt(0);
		range.deleteContents();
		range.insertNode(document.createTextNode(replacementText));
            }
	} else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = replacementText;
	}
    }
  
    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});
 
$(document).ready(function() {
    // global variables for sub-row
    var globalTr = null;
    var globalRow = null;
    var globalIdx = null;
    var globalIndex = null;
    
    // Array to track the ids of the details displayed rows
    var detailRows = [];
    
    var dt = $('#example').DataTable( {
//        "processing": true,
//        "serverSide": true,
//	"ajax": "ireifej2.txt",
//	"ajax":"nodejs/getData.js",
        "columns": [ 
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            { "data": "id" },
            { "data": "title" },
            { "data": "filename" },
            { "data": "tags" },
	    { "data": "delete" }
        ],
        "order": [[1, 'asc']]
    } );
 
    god.query("getAllPrayers", "afterGetAllPrayers", {}, false, false, "all");

    window.afterGetAllPrayers = function(response) {
	var result = response.result;
	for (var i = 0; i < result.length; i++) {
	    var record = result[i];
	    if (record.prayer_id > maxIndex) maxIndex = record.prayer_id;
	    dt.row.add({
		index: i,
		id: "<span id='prayer-id-" + i + "'>" + record.prayer_id + "</span>",
		title: "<input id='prayer-title-input-" + i + "' class='input100' type='text' name='prayer-title' placeholder='Enter your prayer title' value='" + record.prayer_title + "'>",
		filename: "<span id='prayer-filename-" + i + "'>" + record.prayer_file_name + "</span>",
		tags: "<input id='prayer-tags-input-" + i + "' class='input100' type='text' name='tags' placeholder='Enter your tags' value='" + record.tags + "'>",
		delete: "<i class='far fa-times-circle clicky' onclick='deletePrayer(\"" + record.prayer_file_name + "\")'></i>",
		realFileName: record.prayer_file_name
	    }).draw();
	}
    }

    window.getLastHighlighted = function(index) {
	globalTextAreaId = "prayer-text-input-" + index;
	var el = document.getElementById("prayer-text-input-" + index);
	start = el.selectionStart;
	end = el.selectionEnd;
    }

    window.insertPrayer = function() {
	console.log("insert");
	var t = $('#example').DataTable();
	maxIndex++;
	t.row.add({
	    index: maxIndex,
	    id: "<span id='prayer-id-" + maxIndex + "'>" + maxIndex + "</span>",
	    title: "<input id='prayer-title-input-" + maxIndex + "' class='input100' type='text' name='prayer-title' placeholder='Enter your prayer title' value=''>",
	    filename: "<span id='prayer-filename-" + maxIndex + "'>newPrayerName" + maxIndex + "</span>",
	    tags: "<input id='prayer-tags-input-" + maxIndex + "' class='input100' type='text' name='tags' placeholder='Enter your tags' value=''>",
	    delete: "<i class='far fa-times-circle clicky' onclick='deletePrayer(\"" + 'none' + "\")'></i>",
	    realFileName: "newPrayerName"
        }).draw();
    }

    window.updatePrayer = function(index) {
	var newTitle = $("#prayer-title-input-" + index).val();
	var newTags = $("#prayer-tags-input-" + index).val();
	var fileName = $("#prayer-filename-" + index).html();
	var prayerId = $("#prayer-id-" + index).html();
	var prayerText = $("#prayer-text-input-" + index).val();

	var params = {
	    "prayerName": fileName,
	    "prayerTags": newTags,
	    "prayerTitle": "'" + newTitle + "'",
	    "prayerId": prayerId
	};

	if (prayerText) {
	    var newPrayerText = prayerText.replace(/'/g, "\\'");
            params["prayerText"] = "\"" + newPrayerText + "\"";
	}

	god.query("updatePrayer", "afterUpdatePrayer", params, false, false, "all");
    }

    window.createPrayer = function(index) {
	var newTitle = $("#prayer-title-input-" + index).val();
	var newTags = $("#prayer-tags-input-" + index).val();
	var fileName = $("#prayer-filename-" + index).html();
	var prayerId = $("#prayer-id-" + index).html();
	var prayerText = $("#prayer-text-input-" + index).val();

	var params = {
	    "prayerName": fileName,
	    "prayerTags": newTags,
	    "prayerTitle": "'" + newTitle + "'",
	    "prayerId": prayerId,
	    "categoryId": 8,
	    "prayerText": prayerText
	};

	if (prayerText) {
	    var newPrayerText = prayerText.replace(/'/g, "\\'");
            params["prayerText"] = "\"" + newPrayerText + "\"";
	}

	god.query("createPrayer", "afterCreatePrayer", params, false, false, "all");
    }

    window.afterUpdatePrayer = function(result) {
	console.log(result);
    }

    window.afterCreatePrayer = function(result) {
	location.reload();
    }

    window.deletePrayer = function(prayerFileName) {
	god.query("deletePrayer", "afterDeletePrayer", { prayerName: prayerFileName }, false, false);
    }

    window.afterDeletePrayer = function() {
	console.log("afterDeletePrayer");
    }

    window.afterReadPrayer = function(response) {
	console.log("afterReadPrayer");
	var prayerText = response.result[0].prayer_text;

	globalTr.addClass( 'details' );
        globalRow.child( format( prayerText, globalIndex ) ).show();
 
        // Add to the 'open' array
        if ( globalIdx === -1 ) {
            detailRows.push( globalTr.attr('id') );
        }
    }

    $('#example tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );

	globalTr = tr;
	globalRow = row;
	globalIdx = idx;

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
 
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        } else {
	    var fileName = row.data().realFileName;
	    console.log(fileName);
	    if (fileName == "newPrayerName") {
		globalTr.addClass( 'details' );
		globalRow.child( formatNewPrayer( "new prayer", maxIndex ) ).show();
 
		// Add to the 'open' array
		if ( globalIdx === -1 ) {
		    detailRows.push( globalTr.attr('id') );
		}
		return;
	    }
	    globalIndex = row.data().index;
	    god.query("readPrayer", "afterReadPrayer", {"fileName":fileName}, false, false, "all");
        }
    } );
 
    // On each draw, loop over the `detailRows` array and show any child rows
    dt.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    } );
} );
