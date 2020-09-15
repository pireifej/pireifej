#!/usr/bin/env nodejs

var currentDateTime = new Date(new Date().toUTCString()).toISOString();
console.log(currentDateTime);

var options = {
    timeZone: "America/New_York",
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
};

var formatter = new Intl.DateTimeFormat([], options);
var UTCTime = currentDateTime;
var localTime = formatter.format(new Date(UTCTime));
console.log(localTime);
//currentDateTime = currentDateTime.replace("T", " " ).replace("Z", "");
//console.log(currentDateTime.split(".")[0]);
