#!/usr/bin/env nodejs

var http = require('http');
var tools = require('./tools');
var security = require("./security");
const url = require('url');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
	user: 'pireifej@gmail.com',
	pass: 'bcvbfcsvklsnegqc'
    }
});

var mailOptions = {
    from: 'pireifej@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

http.createServer(function (request, response) {
    /*
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: 'localhost',
        user:'pireifej',
        password: 'Armani2362!',
        database: 'god',
        connectionLimit: 5
    });
*/
    const queryObject = url.parse(request.url,true).query;
    var command = queryObject.command;
    var query = null;
    var readFile = null;

    if (command == "getPrayer") {
	query = "SELECT * ";
	query += "FROM prayers ";
	query += "WHERE category = '" + queryObject.category + "' ";
	query += "LIMIT 1;";
	readFile = true;
    }
    
    if (command == "deleteRequest") {
	query = "UPDATE request ";
	query += "SET active = FALSE ";
	query += "WHERE request_id = '" + queryObject.requestId + "'";
    }

    if (command == "getAllRequests") {
	query = "SELECT request_id,user_id,request_text,request_title,CONVERT_TZ(timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request WHERE user_id = '" + queryObject.userId + "' ";
	query += "AND active IS TRUE ";
	query += "ORDER BY timestamp DESC";
    }

    if (command == "getRequest") {
	query = "SELECT request_id,user_id,request_text,request_title,CONVERT_TZ(timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request WHERE request_id = '" + queryObject.requestId + "' ";
    }

    if (command == "getRequestFeed") {
	query = "SELECT request_id,user_id,request_text,request_title,CONVERT_TZ(timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request ";
	query += "WHERE active IS TRUE ";
	query += "ORDER BY timestamp DESC";
    }

    if (command == "login") {
	query = "SELECT user_name,email,real_name,user_title,user_about,location,active,timestamp,user_id ";
	query += "FROM user WHERE email = '" + queryObject.email + "' ";
	query += "AND password = '" + queryObject.password + "' ";
	query += "LIMIT 1;";
    }
    
    if (command == "createUser") {
	var password = security.encrypt(queryObject.password);
	console.log(password);
	query = "INSERT INTO user (user_name, password, email, real_name, location, user_title, user_about, active) VALUES (";
	query += "'" + queryObject.userName + "',";
	query += "'" + password + "',";
	query += "'" + queryObject.email + "',";
	query += "'" + queryObject.realName + "',";
	query += "'" + queryObject.location + "',";
	query += "'" + queryObject.title + "',";
	query += "'" + queryObject.about + "',";
	query += "TRUE);";

	mailOptions["to"] = queryObject.email;
	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
		console.log(error);
	    } else {
		console.log('Email sent: ' + info.response);
	    }
	});
    }

    if (command == "createRequest") {
	query = "INSERT INTO request (user_id, request_text, request_title, active) VALUES (";
	query += "'" + queryObject.userId + "',";
	query += "'" + queryObject.requestText + "',";
	query += "'" + queryObject.requestTitle + "',";
	query += "TRUE)";
    }

    if (command == "prayFor") {
	query = "INSERT INTO user_request (request_id, user_id, timestamp) VALUES (";
	query += "'" + queryObject.requestId + "',";
	query += "'" + queryObject.userId + "')";
    }

    console.log(query);

    if (!query) {
	response.setHeader('Content-type','application/json');
	response.setHeader('Charset','utf8');
	var returnError = { "status": "no query" };
	response.end(queryObject.jsonpCallback + '('+ JSON.stringify(returnError) + ');');
	return;
    }

    response.setHeader('Content-type','application/json');
    response.setHeader('Charset','utf8');

    var pool = require("./mariadbConnector");

    exports.getPosts = function(callback) {
	pool.getConnection()
	    .then(connection => {
		connection.query(query)
		    .then((rows) => {
			if (readFile) {
			    var textFileName = rows[0].prayer_file_name;
			    fs.readFile('/home/pireifej/pireifej/prayer/prayers/' + textFileName, 'utf8', function (err,data) {
				if (err) {
				    return console.log(err);
				}
				rows[0]["prayer_text"] = data;
				response.end(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
				connection.end();
			    });
			} else {
			    response.end(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			    connection.release();
			    connection.end();
			}
		    })})}
		      
    exports.getPosts("test");

    /*
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    response.setHeader('Content-type','application/json');
		    response.setHeader('Charset','utf8');

		    if (readFile) {
			var textFileName = rows[0].prayer_file_name;
			fs.readFile('/home/pireifej/pireifej/prayer/prayers/' + textFileName, 'utf8', function (err,data) {
			    if (err) {
				return console.log(err);
			    }
			    rows[0]["prayer_text"] = data;
			    response.end(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			    //console.log(JSON.stringify(rows));
			    conn.end();
			});
		    } else {
			response.end(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			//console.log(JSON.stringify(rows));
			conn.end();
		    }
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
    */
}).listen(8080);
console.log('Server running at http://198.12.248.83:8080/');
