#!/usr/bin/env nodejs

var query = "select * from user";
var pool = require("./mariadbConnector");

exports.getPosts=function(callback) {
    pool.getConnection()
	.then(connection => {
	    connection.query(query)
		.then((rows) =>
		      connection.release());
	})
}
		      
exports.getPosts("test");
