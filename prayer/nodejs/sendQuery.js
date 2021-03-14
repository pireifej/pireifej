#!/usr/bin/env nodejs

var https = require('https');
var tools = require('./tools');
var security = require("./security");
const url = require('url');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs');

var root = "/var/www/html";
var home = root + "/prayer";
const argv = require('minimist')(process.argv.slice(2));
var queryObject = {};
var thing = argv["_"];;
var env = "prod";

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + thing+"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

for (var i = 0; i < thing.length; i++) {
    var param = thing[i];
    var params = param.split("=");
    queryObject[params[0]] = params[1];
}

if (__filename.includes("prayer-test")) {
    env = "test";
    home = root + "/prayer-test";
}

function log(message) {
    fs.writeFile(home + '/log.txt', message, function (err) {
	if (err) return console.log(err);
    });
}

function requireParam(param) {
    if (param == "userId" && env == "test") {
	queryObject["userId"] = 105; // pireifej user
	return;
    }
    if (!queryObject[param]) {
	var obj = {};
	obj["result"] = param + " is required";
	console.log(JSON.stringify(obj));
	process.exit();
    }
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
	    queueLimit: 0,
	    multipleStatements: true
	});

	return pool;
    } catch (error) {
	return console.log(`Could not connect - ${error}`);
    }
}

var allCommands = {
    "previewPrayer": true,
    "passwordChange": true,
    "getPrayerCount": true,
    "getPrayer": true,
    "deleteRequest": true,
    "getRequest": true,
    "getMyRequests": true,
    "getNotifications": true,
    "getRequestFeed": true,
    "getCategories": true,
    "login": true,
    "getUser": true,
    "getThisUser": true,
    "getAllUsers": true,
    "updateUser": true,
    "help": true,
    "email": true,
    "forgotPassword": true,
    "getPrayerHistory": true,
    "getPeopleWhoPrayed": true,
    "createUser": true,
    "createRequest": true,
    "prayFor": true,
    "getAllPrayers": true,
    "readPrayer": true,
    "updatePrayer": true,
    "createPrayer": true
};

if (!queryObject["command"]) {
    printAllCommands();
}

function printAllCommands() {
    for (var key in allCommands) {
	console.log(key);
    }
}

requireParam("command");

if (!allCommands[queryObject["command"]]) {
    printAllCommands();
}

//https.createServer(options, function (request, response) {
//    const queryObject = url.parse(request.url,true).query;
var command = queryObject.command;
var tz = queryObject.tz;
var query = null;
var readFile = null;

if (command == "getPrayerCount") {
    query = "SELECT COUNT(*) ";
    query += " FROM user_request ";
    query += " WHERE user_id = " + queryObject["userId"];
}

if (command == "getAllPrayers") {
    query = "SELECT * ";
    query += "FROM prayers;";
}

if (command == "createPrayer") {
    requireParam("prayerText");
    requireParam("prayerTags");
    requireParam("prayerTitle");
    requireParam("prayerName");
    requireParam("categoryId");

    fs.appendFile(home + '/prayers/' + queryObject.prayerName, queryObject.prayerText, function (err) {
	if (err) return console.log(err);
    });

    query = "INSERT INTO prayers (prayer_title, prayer_file_name, fk_category_id, tags) VALUES (";
    query += "'" + queryObject.prayerTitle + "',";
    query += "'" + queryObject.prayerName + "',";
    query += "'" + queryObject.categoryId + "',";
    query += "'" + queryObject.prayerTags + "');";
}

if (command == "updatePrayer") {
    requireParam("prayerId");
    requireParam("prayerName");

    var prayerText = queryObject["prayerText"];
    var prayerTags = queryObject["prayerTags"];
    var prayerTitle = queryObject["prayerTitle"];
    var prayerName = queryObject["prayerName"];
    var prayerId = queryObject["prayerId"];
    var categoryId = queryObject["categoryId"];

    if (prayerText) {
	fs.writeFile(home + '/prayers/' + prayerName, prayerText, function (err) {
	    if (err) return console.log(err);
	});
    }

    query = "UPDATE prayers ";
    query += "SET prayer_file_name = '" + prayerName + "' ";
    if (categoryId) query += ", fk_category_id = '" + categoryId + "' ";
    if (prayerTags) query += ", tags = '" + prayerTags + "' ";
    if (prayerTitle) query += ", prayer_title = '" + prayerTitle + "' ";
    query += "WHERE prayer_id = '" + prayerId + "'";
}

if (command == "readPrayer") {
    requireParam("fileName");

    fs.readFile(home + '/prayers/' + queryObject["fileName"], 'utf8', function (err,data) {
	if (err) {
	    return;
	}
	var prayerText = data;
	var obj = {};
	obj["result"] = prayerText;
	obj["query"] = query;
	console.log(JSON.stringify(obj));
	process.exit();
	return;
    })
}

if (command == "previewPrayer") {
    requireParam("userId");
    requireParam("requestText");
    requireParam("categoryId");

    query = "SELECT user.real_name,user.gender ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    query += "SELECT prayers.tags,prayers.prayer_file_name,prayers.prayer_title ";
    query += "FROM prayers ";
    query += "WHERE prayers.fk_category_id = '" + queryObject.categoryId + "' ";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    var user = rows[0][0];
		    var obj = {};
		    var gender = user.gender;
		    var realName = user.real_name;
		    var otherPerson = queryObject["otherPerson"];
		    var requestText = queryObject.requestText;
		    var prayers = rows[1];

		    var bestPrayer = getBestPrayer(prayers, requestText);

		    fs.readFile(home + '/prayers/' + bestPrayer, 'utf8', function (err,data) {
			if (err) {
			    console.log("Error");
			    console.log(err);
			    return;
			}

			var customPrayer = generateCustomPrayer(data, realName, gender, otherPerson);
			obj["result"] = customPrayer;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    })
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
                })
	});
    return;
}

if (command == "getPrayer") {
    requireParam("requestId");

    query = "SELECT user.real_name,user.gender,request.request_text,request.other_person,prayers.tags,prayers.prayer_file_name,prayers.prayer_title ";
    query += "FROM prayers INNER JOIN request INNER JOIN user ";
    query += "WHERE prayers.fk_category_id = request.fk_category_id ";
    query += "AND user.user_id = request.user_id ";
    query += "AND request.request_id = '" + queryObject.requestId + "';";
    
    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    var requestText = "";
		    var realName = "";
		    var gender = "";
		    var otherPerson = "";
		    var prayers = rows;

		    if (prayers.length > 0) {
			requestText = prayers[0].request_text
			realName = prayers[0].real_name;
			gender = prayers[0].gender;
			otherPerson = prayers[0].other_person;
		    }

		    var bestPrayer = getBestPrayer(prayers, requestText);

		    fs.readFile(home + '/prayers/' + bestPrayer, 'utf8', function (err,data) {
			if (err) {
			    console.log("Error");
			    console.log(err);
			    return;
			}
			var customPrayer = generateCustomPrayer(data, realName, gender, otherPerson);
			rows[0]["prayer_text"] = customPrayer;
			var obj = {};
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    });
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
                })
	})
    return;	    
}

if (command == "deleteRequest") {
    query = "UPDATE request ";
    query += "SET active = FALSE ";
    query += "WHERE request_id = '" + queryObject.requestId + "'";
}

if (command == "getRequest") {
    requireParam("requestId");

    query = "SELECT request_id,request_text,request_title,request.picture as request_picture,category.category_name,user.user_name,user.picture,user.real_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request ";
    query += "INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request_id = '" + queryObject.requestId + "'; ";
}

if (command == "getMyRequests") {
    requireParam("userId");

    query = "SELECT request.request_id,request.user_id,request_text,request_title,picture as request_picture,category.category_name,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' and active is TRUE ";
    query += "ORDER BY timestamp DESC";
/*    
    query += "SELECT user.picture,user.real_name,user.user_name,user_request.user_id,user_request.request_id,user_request.timestamp, ";
    query += "FROM user_request INNER JOIN user ";
    query += "ON user.user_id = user_request.user_id ";
    query += "WHERE request_id=" + queryObject.requestId;
*/
}

if (command == "getNotifications") {
    query = "SELECT user.real_name, request.request_title,user_request.user_id, request.request_id, user.picture, CONVERT_TZ(user_request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request INNER JOIN user_request ON user_request.request_id = request.request_id INNER JOIN user on user.user_id = user_request.user_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' AND request.active = 1 ";
    query += "ORDER BY user_request.timestamp DESC ";
    query += "LIMIT 3;";
}

if (command == "getRequestFeed") {
    var requestId = (queryObject["requestId"]) ? queryObject["requestId"] : null;
    query = "SELECT request_id,request.user_id,request_text,request_title,request.picture as request_picture,request.other_person,category.category_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp,user.real_name,user.picture, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    // only active prayers
    query += "WHERE request.active IS TRUE ";
    // get a specific request only
    if (requestId) {
	query += "AND request.request_id = " + requestId + " ";
    }
    // not your request
    query += "AND (request.user_id <> '" + queryObject.userId + "' OR request.other_person <> '') ";
    // you already prayed
    query += "AND request.request_id NOT IN ";
    query += "(SELECT request_id FROM user_request WHERE user_request.user_id = '" + queryObject.userId + "') ";
    query += "ORDER BY timestamp DESC";
}

if (command == "getCategories") {
    query = "SELECT category_id, category_name ";
    query += "FROM category ";
}

if (command == "login") {
    requireParam("userName");
    requireParam("password");
    
    query = "SELECT password,user_name,email,real_name,user_title,user_about,location,active,timestamp,user_id,picture ";
    query += "FROM user WHERE user_name = '" + queryObject.userName + "' ";
    query += "LIMIT 1;";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
	.then(conn => {
	    conn.query(query)
		.then((rows) => {
		    var obj = {};
		    var hash = rows[0].password;
		    delete rows[0]["password"];
		    obj["result"] = rows;
		    obj["query"] = query;

		    if (!obj["result"]) {

		    } else {
			var bcrypt = require('bcrypt');
			bcrypt.compare(queryObject.password, hash, function(err, result) {
			    if (err) {
				obj["result"] = err;
			    }
			    if (!result) {
				obj["result"] = result;
			    }
				       
			    console.log(JSON.stringify(obj));
			    conn.release();
			    conn.end();
			    process.exit();
			    return;
			});
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
}

if (command == "getUser") {
    query = "SELECT user_id,user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.userId + "';";
}

if (command == "getThisUser") {
    query = "SELECT user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.thisUserId + "';";
}

if (command == "getAllUsers") {
    query = "SELECT user_id,user_name,picture ";
    query += "FROM user";
}

if (command=="passwordChange") {
    requireParam("password");
    requireParam("userId");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;
   
    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "UPDATE user ";
	query += "SET password = '" + password + "' ";
	query += "WHERE user_id = '" + queryObject.userId + "';";

	const pool = createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
		    })
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
}

if (command == "updateUser") {
    requireParam("userId");
    var queryParts = [];

    if (queryObject["userName"]) {
	queryParts.push("user_name = '" + queryObject.userName + "'");
    }
    if (queryObject["email"]) {
	queryParts.push("email = '" + queryObject.email + "'");
    }
    if (queryObject["realName"]) {
	queryParts.push("real_name = '" + queryObject.realName + "'");
    }
    if (queryObject["location"]) {
	queryParts.push("location = '" + queryObject.location + "'");
    }
    if (queryObject["title"]) {
	queryParts.push("user_title = '" + queryObject.title + "'");
    }
    if (queryObject["picture"]) {
	queryParts.push("picture = '" + queryObject.picture + "'");
    }
    if (queryObject["about"]) {
	queryParts.push("user_about = '" + queryObject.about + "'");
    }

    if (queryParts.length > 0) {
	query = "UPDATE user SET " + queryParts.join(",") + " WHERE user_id = '" + queryObject.userId + "';";
    }
}

if (command == "help") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: queryObject.subject,
	text: "Message : " + queryObject.message + "\n" +
	    "Email: " + queryObject.email + "\n" +
	    "User ID: " + queryObject.userId + "\n" +
	    "Name: " + queryObject.name + "\n"
    };

    mailOptions["to"] = "pireifej@gmail.com";
    transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

if (command == "email") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: 'Welcome to the Prayer Network, ' + queryObject.realName + '!',
	text: 'Thanks for joining, ' + queryObject.realName + '! Try to login and start praying.'
    };

    mailOptions["to"] = queryObject.email;
    transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

if (command == "forgotPassword") {
    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: 'pireifej@gmail.com',
	    pass: 'bcvbfcsvklsnegqc'
	}
    });
    
    var mailOptions = {
	from: 'welcome@prayforus.com',
	subject: 'Welcome to the Prayer Network, ' + queryObject.realName + '!',
	text: 'Thanks for joining, ' + queryObject.realName + '! Try to login and start praying.'
    };

    mailOptions["to"] = queryObject.email;
    transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	    var obj = {};
	    obj["result"] = 'Error: ' + error;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	} else {
	    var obj = {};
	    obj["result"] = 'Email sent: ' + info.response;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    return;
	}
    });
}

// determine best prayer to use
function getBestPrayer(prayers, requestText) {
    var scores = {};

    for (var i = 0; i < prayers.length; i++) {
        var tags = prayers[i].tags;
        var fileName = prayers[i].prayer_file_name;
	if (!tags) {
	    scores[fileName] = 0;
	    continue;
	}
        scores[fileName] = 0;

        var words = requestText.split(" ");
        for (var j = 0; j < words.length; j++) {
            if (tags.includes(words[j])) scores[fileName]++;
        }
    }

    const max = Object.keys(scores).reduce((a, v) => Math.max(a, scores[v]), -Infinity);
    const result = Object.keys(scores).filter(v => scores[v] === max);
    return result[0];
}

function generateCustomPrayer(prayerText, realName,gender,otherPerson) {
    const genderDetect = require('gender-detection');

    // is this prayer for someone else?
    // CODE IN PROGRESS
    /*
      var x = require('people-names');
      var words = requestText.split(" ");
      var newText = "";
      var subject = "";
      for (var i = 0; i < words.length; i++) {
      var txt = words[i];
      newText = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      if (x.isPersonName(newText)) {
      subject = newText;
      }
      }
      console.log(subject);
      
      realName = (subject) ? subject : realName;
    */

    realName = (otherPerson) ? otherPerson : realName;

    if (!gender) {
	gender = genderDetect.detect(realName);
    }

    var hisOrHer = (gender == "male") ? "his" : "her";
    var heOrShe = (gender == "male") ? "he" : "she";
    var himOrHer = (gender == "male") ? "him" : "her";
    
    prayerText = prayerText.replace(/{{name}}/g, realName);
    prayerText = prayerText.replace(/{{gender1}}/g, hisOrHer);
    prayerText = prayerText.replace(/{{gender2}}/g, heOrShe);
    prayerText = prayerText.replace(/{{gender3}}/g, himOrHer);

    return prayerText;
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	response = {};

    if (matches.length !== 3) {
	return new Error('Invalid input string');
    }

    var type = matches[1];
    var fileType = type.split("/")[1];
    response.type = fileType;
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

if (command == "getPrayerHistory") {
    requireParam("userId");
    
    query = "SELECT user.real_name,user.picture,request.request_title,request.request_text ";
    query += "FROM user_request INNER JOIN request ON request.request_id = user_request.request_id ";
    query += "INNER JOIN user on user.user_id = request.user_id ";
    query += "WHERE user_request.user_id=" + queryObject.userId;
}

if (command == "getPeopleWhoPrayed") {
    requireParam("requestId");
    
    query = "SELECT user.picture,user.real_name,user.user_name,user_request.user_id,user_request.request_id,user_request.timestamp ";
    query += "FROM user_request INNER JOIN user ";
    query += "ON user.user_id = user_request.user_id ";
    query += "WHERE request_id IN (" + queryObject.requestId + ")";
}

if (command == "createUser") {
    requireParam("userName");
    requireParam("password");
    requireParam("email");
    requireParam("realName");
    requireParam("location");
    requireParam("title");
    requireParam("about");
    requireParam("picture");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;

    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "INSERT INTO user (user_name, password, email, real_name, location, user_title, user_about, picture, active) VALUES (";
	query += "'" + queryObject.userName + "',";
	query += "'" + password + "',";
	query += "'" + queryObject.email + "',";
	query += "'" + queryObject.realName + "',";
	query += "'" + queryObject.location + "',";
	query += "'" + queryObject.title + "',";
	query += "'" + queryObject.about + "',";
	query += "'" + queryObject.picture + "',";
	query += "TRUE);";

	const pool = createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};

			var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
				user: 'pireifej@gmail.com',
				pass: 'bcvbfcsvklsnegqc'
                            }
			});

			fs.readFile(home + '/nodejs/welcomeEmailTemplate.html', 'utf8', function (err,data) {
			    if (err) {
				console.log(err);
				return;
			    }

			    data = data.replace("{{realName}}", queryObject.realName);
			    data = data.replace("{{userName}}", queryObject.userName);
			    
			    var mailOptions = {
				from: 'pireifej@gmail.com',
				to: queryObject.email,
				bcc: "pireifej@gmail.com",
				subject: "Welcome to Pray For Us!",
				html: data
			    };

			    transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
				    var obj = {};
				    obj["result"] = 'Error: ' + error;
				    obj["query"] = "No Query";
				    console.log(JSON.stringify(obj));
				    process.exit();
				    return;
				} else {
				    var obj = {};
				    obj["output"] = env;
				    obj["result"] = 'Email sent: ' + info.response;
				    obj["query"] = "No Query";
				    console.log(JSON.stringify(obj));
				    process.exit();
				    conn.release();
				    conn.end();
				    return;
				}
			    });
			})
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
    })
}

if (command == "createRequest") {
    requireParam("userId");
    requireParam("requestText");
    requireParam("requestTitle");
    requireParam("requestCategoryId");
    requireParam("sendEmail");
    
    query = "INSERT INTO request (user_id, request_text, request_title, fk_category_id, other_person, picture, active) VALUES (";
    query += "'" + queryObject.userId + "',";
    query += "'" + queryObject.requestText + "',";
    query += "'" + queryObject.requestTitle + "',";
    query += "'" + queryObject.requestCategoryId + "',";
    query += "'" + queryObject.otherPerson + "',";
    query += "'" + queryObject.picture + "',";
    query += "TRUE);";

    query += "SELECT user.real_name, user.email ";
    query += "FROM user ";
    query += "WHERE user.user_id <> '" + queryObject.userId + "';";

    query += "SELECT user.real_name ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
    	.then(conn => {
	    conn.query(query)
	    	.then((rows) => {
		    if (queryObject.sendEmail !== "on") {
			var obj = {};
			obj["result"] = 'No email sent';
			obj["query"] = "No Query";
			console.log(JSON.stringify(obj));
			process.exit();
			return;
		    }

		    var obj = {};
		    var requestId = rows[0].insertId;
		    var url = "https://pireifej.com/prayer/request-feed.html?requestId=" + requestId;
		    var users = rows[1];
		    var realName = rows[2][0].real_name;
		    var comma = "";
		    var emailList = "";
		    var emails = [];
		    
		    for (var i = 0; i < users.length; i++) {
			emailList += comma + users[i].email;
			emails.push(users[i].email);
			comma = ",";
		    }

		    if (env == "test") emails = "pireifej@gmail.com";

		    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'pireifej@gmail.com',
                            pass: 'bcvbfcsvklsnegqc'
                        }
                    });

		    fs.readFile(home + '/nodejs/emailTemplate.html', 'utf8', function (err,data) {
                        if (err) {
			    console.log(err);
                            return;
                        }

			var otherPerson = queryObject.otherPerson;

			data = data.replace("{{realName}}", realName);
			data = data.replace("{{realName}}", realName);
			
			if (otherPerson) {
			    data = data.replace("{{otherPerson}}", "(for " + otherPerson + ")");
			} else {
			    data = data.replace("{{otherPerson}}", "");
			}

			data = data.replace("{{prayerText}}", queryObject.requestText);
			data = data.replace("{{requestLink}}", url);

			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: 'pireifej@gmail.com',
			    bcc: emails,
			    subject: "Please pray for me!",
			    html: data
			};

			console.log(mailOptions);
		    
			transporter.sendMail(mailOptions, function(error, info) {
			    if (error) {
				var obj = {};
				obj["result"] = 'Error: ' + error;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    } else {
				var obj = {};
				obj["output"] = env;
				obj["result"] = 'Email sent: ' + info.response;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				conn.release();
				conn.end();
				return;
			    }
			});
		    })
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
		})
	})
    return;
}

if (command == "prayFor") {
    requireParam("requestId");
    requireParam("userId");
    
    var query = "INSERT INTO user_request (request_id, user_id) VALUES (";
    query += "'" + queryObject.requestId + "',";
    query += "'" + queryObject.userId + "'); ";

    query += "SELECT user.real_name, user.email, user.picture, request.request_title ";
    query += "FROM request ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request.request_id = '" + queryObject.requestId + "'; ";

    query += "SELECT user.real_name, user.email, user.picture ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    const pool = createPool();
    module.exports = pool;
    pool.getConnection()
    	.then(conn => {
	    conn.query(query)
	    	.then((rows) => {
		    var person1 = rows[1][0];
		    var person2 = rows[2][0];
		    
		    var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			    user: 'pireifej@gmail.com',
			    pass: 'bcvbfcsvklsnegqc'
			}
		    });

		    fs.readFile(home + '/nodejs/prayedEmailTemplate.html', 'utf8', function (err,data) {
			if (err) {
			    console.log(err);
			    return;
			}
			
			data = data.replace("{{realName}}", person2.real_name);
			data = data.replace("{{prayerText}}", person1.request_title);
			data = data.replace("{{picture}}", person2.picture);
			
			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: person1.email,
			    bcc: 'pireifej@gmail.com',
			    subject: person2.real_name + " prayed for you!",
			    html: data
			};

			transporter.sendMail(mailOptions, function(error, info) {
			    if (error) {
				var obj = {};
				obj["result"] = 'Error: ' + error;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    } else {
				var obj = {};
				obj["result"] = 'Email sent: ' + info.response;
				obj["query"] = "No Query";
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    }
			});
		    })
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
		})
	})
    return;
}

if (!query) {
    var returnError = { "status": "no query" };
    return;
}

const pool = createPool();
module.exports = pool;
pool.getConnection()
    .then(conn => {
	conn.query(query)
	    .then((rows) => {
		if (readFile) {
		    var textFileName = rows[0].prayer_file_name;
		    fs.readFile(home + '/prayers/' + textFileName, 'utf8', function (err,data) {
			if (err) {
			    //console.log(err);
			    return;
			}
			rows[0]["prayer_text"] = data;
			var obj = {};
			obj["result"] = rows;
			obj["query"] = query;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    });
		} else {
		    var obj = {};
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
			    fs.readFile(home + '/prayers/' + textFileName, 'utf8', function (err,data) {
				if (err) {
				    //console.log(err);
				    return;
				}
				rows[0]["prayer_text"] = data;
				//console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
				console.log(JSON.stringify(rows));
				connection.end();
			    });
			} else {
			    //console.log(queryObject.jsonpCallback + '('+ JSON.stringify(rows) + ');');
			    console.log(JSON.stringify(rows));
			    connection.release();
			    connection.end();
			}
		    })})}
//}).listen(8080);
//console.log('Server running at https://198.12.248.83:8080/');
