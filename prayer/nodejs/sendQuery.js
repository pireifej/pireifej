#!/usr/bin/env nodejs

var https = require('https');
var tools = require('./tools');
var security = require("./security");
const url = require('url');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs')

var home = "/home/pireifej/pireifej/prayer/nodejs/";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
	user: 'pireifej@gmail.com',
	pass: 'bcvbfcsvklsnegqc'
    }
});

var mailOptions = {
    from: 'pireifej@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

const argv = require('minimist')(process.argv.slice(2));
var queryObject = {};
var thing = argv["_"];;

for (var i = 0; i < thing.length; i++) {
    var param = thing[i];
    var params = param.split("=");
    queryObject[params[0]] = params[1];
}

function createPool() {
    try {
	const mariadb = require('mariadb');

	const pool = mariadb.createPool({
	    host: 'localhost',
	    user: 'pireifej',
	    password: 'Armani2362!',
	    database: 'god',
	    connectionLimit: 10,
	    waitForConnections: true,
	    queueLimit: 0
	});

	return pool;
    } catch (error) {
	return console.log(`Could not connect - ${error}`);
    }
}

//https.createServer(options, function (request, response) {
//    const queryObject = url.parse(request.url,true).query;
    var command = queryObject.command;
    var query = null;
    var readFile = null;   

    if (command == "getPrayer") {
	query = "SELECT * ";
	query += "FROM prayers ";
	query += "WHERE fk_category_id = ";
	query += " (SELECT category_id FROM category WHERE category_name='" + queryObject.category + "') ";
	query += "LIMIT 1;";
	readFile = true;
    }
    
    if (command == "deleteRequest") {
	query = "UPDATE request ";
	query += "SET active = FALSE ";
	query += "WHERE request_id = '" + queryObject.requestId + "'";
    }

    if (command == "getAllRequests") {
	query = "SELECT request_id,user_id,request_text,request_title,category.category_name,CONVERT_TZ(timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
	query += "WHERE user_id = '" + queryObject.userId + "' and active is TRUE ";
	query += "ORDER BY timestamp DESC";
    }

    if (command == "getRequest") {
	query = "SELECT request_id,request_text,request_title,category.category_name,user.user_name,CONVERT_TZ(request.timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request ";
	query += "INNER JOIN category ON category.category_id = fk_category_id ";
	query += "INNER JOIN user ON user.user_id = request.user_id ";
	query += "WHERE request_id = '" + queryObject.requestId + "' ";
    }

    if (command == "getRequestFeed") {
	query = "SELECT request_id,user_id,request_text,request_title,category.category_name,CONVERT_TZ(timestamp,'GMT','America/New_York') as timestamp ";
	query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
	query += "WHERE active IS TRUE ";
	query += "ORDER BY timestamp DESC";
    }

    if (command == "getCategories") {
	query = "SELECT category_id, category_name ";
	query += "FROM category ";
    }

    if (command == "login") {
	query = "SELECT user_name,email,real_name,user_title,user_about,location,active,timestamp,user_id ";
	query += "FROM user WHERE email = '" + queryObject.email + "' ";
	query += "AND password = '" + queryObject.password + "' ";
	query += "LIMIT 1;";
    }
    
    if (command == "createUser") {
	var password = security.encrypt(queryObject.password);
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
	//console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
		//console.log(error);
	    } else {
		//console.log('Email sent: ' + info.response);
	    }
	});
    }

    if (command == "createRequest") {
	query = "INSERT INTO request (user_id, request_text, request_title, fk_category_id, active) VALUES (";
	query += "'" + queryObject.userId + "',";
	query += "'" + queryObject.requestText + "',";
	query += "'" + queryObject.requestTitle + "',";
	query += "'" + queryObject.requestCategoryId + "',";
	query += "TRUE)";
    }

    if (command == "prayFor") {
	query = "INSERT INTO user_request (request_id, user_id) VALUES (";
	query += "'" + queryObject.requestId + "',";
	query += "'" + queryObject.userId + "')";
    }

    if (!query) {
	//response.setHeader('Content-type','application/json');
	//response.setHeader('Charset','utf8');
	//response.setHeader('Access-Control-Allow-Origin', '*');
	var returnError = { "status": "no query" };
	//response.end(queryObject.jsonpCallback + '('+ JSON.stringify(returnError) + ');');
	return;
    }

    //response.setHeader('Content-type','application/json');
    //response.setHeader('Charset','utf8');
    //response.setHeader('Access-Control-Allow-Origin', '*');
    
//    var pool = require("./mariadbConnector");

const pool = createPool();
module.exports = pool;
pool.getConnection()
    .then(conn => {
	conn.query(query)
	    .then((rows) => {
		if (readFile) {
		    var textFileName = rows[0].prayer_file_name;
		    fs.readFile('/home/pireifej/pireifej/prayer/prayers/' + textFileName, 'utf8', function (err,data) {
			if (err) {
			    //console.log(err);
			    return;
			}
			rows[0]["prayer_text"] = data;
			var obj = {}
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    });
		} else {
		    var obj = {}
		    obj["result"] = rows;
		    obj["query"] = query;
		    console.log(JSON.stringify(obj));
		    conn.release();
		    conn.end();
		    process.exit();
		    return;
		}
	    })
	    .catch(err => {
		console.log("not connected due to error: " + err);
		var obj = {};
		obj["result"] = err;
		obj["query"] = query;
		console.log(JSON.stringify(obj));
		conn.release();
		conn.end();
		process.exit();
	    });
    });

return;

var obj = {};
obj["query"] = query;

    exports.getPosts = function(callback) {
	pool.getConnection()
	    .then(connection => {
		connection.query(query)
		    .then((rows) => {
			if (readFile) {
			    var textFileName = rows[0].prayer_file_name;
			    fs.readFile('/home/pireifej/pireifej/prayer/prayers/' + textFileName, 'utf8', function (err,data) {
				if (err) {
				    //console.log(err);
				    return;
				}
				rows[0]["prayer_text"] = data;
				console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
				connection.end();
			    });
			} else {
			    console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			    connection.release();
			    connection.end();
			}
		    })})}
//}).listen(8080);
//console.log('Server running at https://198.12.248.83:8080/');
