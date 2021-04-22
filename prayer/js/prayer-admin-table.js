function format ( prayerText, index ) {
    return "<textarea id='prayer-text-input-" + index + "' class='input100 longer' name='prayer-text' placeholder='Your prayer text here...' onfocusout='updatePrayer(\"" + index + "\")'>" + prayerText + "</textarea>";;
/*    return 'Full name: '+d.first_name+' '+d.last_name+'<br>'+
        'Salary: '+d.salary+'<br>'+
        'The child row can contain any data you wish, including links, images, inner tables etc.';
*/
}
 
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
	    dt.row.add({
		index: i,
		id: "<span id='prayer-id-" + i + "'>" + record.prayer_id + "</span>",
		title: "<input id='prayer-title-input-" + i + "' class='input100' type='text' name='prayer-title' placeholder='Enter your prayer title' value='" + record.prayer_title + "' onfocusout='updatePrayer(\"" + i + "\")'>",
		filename: "<span id='prayer-filename-" + i + "'>" + record.prayer_file_name + "</span>",
		tags: "<input id='prayer-tags-input-" + i + "' class='input100' type='text' name='tags' placeholder='Enter your tags' value='" + record.tags + "' onfocusout='updatePrayer(\"" + i + "\")'>",
		delete: "<i class='far fa-times-circle clicky' onclick='deletePrayer(\"" + record.prayer_file_name + "\")'></i>",
		realFileName: record.prayer_file_name
	    }).draw();
	}
    }

    window.updatePrayer = function(index) {
	var newTitle = $("#prayer-title-input-" + index).val();
	var newTags = $("#prayer-tags-input-" + index).val();
	var fileName = $("#prayer-filename-" + index).html();
	var prayerId = $("#prayer-id-" + index).html();
	var prayerText = $("#prayer-text-input-" + index).val();

	god.query("updatePrayer", "afterUpdatePrayer", {
	    "prayerName": fileName,
	    "prayerTags": newTags,
	    "prayerTitle": "'" + newTitle + "'",
	    "prayerId": prayerId,
            "prayerText": "\"" + prayerText + "\"",
	}, false, false, "all");
    }

    window.afterUpdatePrayer = function(result) {
	console.log(result);
    }

    window.deletePrayer = function(prayerFileName) {
	god.query("deletePrayer", "afterDeletePrayer", { prayerName: prayerFileName }, false, false);
    }

    window.afterDeletePrayer = function() {
	console.log("afterDeletePrayer");
    }

    window.afterReadPrayer = function(response) {
	console.log("afterReadPrayer");
	var prayerText = response.result;

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
        }
        else {
	    var fileName = row.data().realFileName;
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
