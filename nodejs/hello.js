#!/usr/bin/env nodejs

var http = require('http');
var tools = require('./tools');
var security = require("./security");
const url = require('url');

http.createServer(function (request, response) {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: 'localhost',
        user:'pireifej',
        password: 'Armani2362!',
        database: 'god',
        connectionLimit: 5
    });

    const queryObject = url.parse(request.url,true).query;
    var command = queryObject.command;
    console.log(queryObject);

    var query = "SELECT * FROM user";
    var currentDateTime = new Date().toISOString();
    currentDateTime = currentDateTime.replace("T", " " ).replace("Z", "");
    currentDateTime = currentDateTime.split(".")[0];
    
    if (command == "createUser") {
	var password = security.encrypt(queryObject.password);
	console.log(password);
	query = "INSERT INTO user (user_name, password, email, real_name, location, created, active) VALUES (";
	query += "'" + queryObject.userName + "',";
	query += "'" + password + "',";
	query += "'" + queryObject.email + "',";
	query += "'" + queryObject.realName + "',";
	query += "'" + queryObject.location + "',";
	query += "'" + currentDateTime + "',";
	query += "TRUE);";
	console.log(query);
    }

    if (command == "createRequest") {
	query = "INSERT INTO request (user_id, request_text, active, request_date_time) VALUES (";
	query += "'" + queryObject.userId + "',";
	query += "'" + queryObject.requestText + "',";
	query += "TRUE,";
	query += "'" + currentDateTime + "')";
	console.log(query);
    }
    
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    response.setHeader('Content-type','application/json');
		    response.setHeader('Charset','utf8');
		    response.end(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
		    conn.end();
                })
                .catch(err => {
                    console.log("error");
                    response.end("{status:'error'}");
                    console.log(err);
                    conn.end();
                })
        }).catch(err => {
            console.log("Error again");
            response.end("Error again");
            conn.end();
        });
}).listen(8080);
console.log('Server running at https://198.12.248.83:8080/');
