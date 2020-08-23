$( document ).ready(function() {
 $.ajax({
        url: 'http://198.12.248.83:8080/',
        dataType: "jsonp",
        //              jsonpCallback: "_testcb",
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log("success");
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error");
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
});