$( document ).ready(function() {
    window.god = window.god || {};
    var params = {};
    params["jsonpCallback"] = "afterEmail";
    god.sendQuery(params);
})
