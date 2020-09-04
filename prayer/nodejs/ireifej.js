#!/usr/bin/env nodejs

var currentDateTime = new Date().toISOString();
currentDateTime = currentDateTime.replace("T", " " ).replace("Z", "");
console.log(currentDateTime.split(".")[0]);
