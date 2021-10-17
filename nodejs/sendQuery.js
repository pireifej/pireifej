#!/usr/bin/env nodejs

var https = require('https');
var security = require("./security");
const url = require('url');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs');
var queryObjectShared = require('./queryObject.js');

var root = "/var/www";
var home = root + "/prayer";
const argv = require('minimist')(process.argv.slice(2));
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

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + thing+"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

// correction for requestText, which comes in with commas (don't know why!)
var requestText = "";
var paramString = thing.join(",");
var firstPart = paramString.split("requestText=");

if (firstPart.length > 1) {
    firstPart = firstPart[1];
    var secondPart = firstPart.split("categoryId");
    requestText = secondPart[0];
    requestText = requestText.split(",").join(" ");
}

fs.appendFile(home + '/nodejs/log.txt', year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + requestText +"\n", function (err) {
    if (err) { console.log("error"); return console.log(err); }
});

queryObjectShared.init(thing);
var queryObject = queryObjectShared.value;

if (queryObject["command"] == "previewPrayer" && requestText) queryObject["requestText"] = requestText;

function log(message) {
    fs.writeFile(home + '/log.txt', message, function (err) {
	if (err) return console.log(err);
    });
}

var allCommands = {
    "previewPrayer": true,
    "passwordChange": true,
    "getPrayerCount": true,
    "deletePrayer": true,
    "getPrayer": true,
    "deleteRequest": true,
    "getRequest": true,
    "getMyRequests": true,
    "getNotifications": true,
    "getRequestFeed": true,
    "getUnassignedPrayers": true,
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
    "getRequestComments": true,
    "postComment": true,
    "createUser": true,
    "createRequest": true,
    "prayFor": true,
    "getAllPrayers": true,
    "getActiveAndInactivePrayers": true,
    "readPrayer": true,
    "getTemp": true,
    "updatePrayer": true,
    "createPrayer": true,
    "joinRosarySession": true,
    "leaveRosarySession": true,
    "getRosarySession": true,
    "logVisitor": true,
    "assignPrayer": true
};

if (!queryObject["command"]) {
    printAllCommands();
}

function printAllCommands() {
    for (var key in allCommands) {
	console.log(key);
    }
}

queryObjectShared.requireParam("command");

if (!allCommands[queryObject["command"]]) {
    printAllCommands();
}

var command = queryObject.command;
var tz = queryObject.tz;
var query = null;
var readFile = null;

if (command == "assignPrayer") {
    queryObjectShared.requireParam("request_id");
    queryObjectShared.requireParam("prayer_id");

    query = "UPDATE request SET fk_prayer_id = " + queryObject.prayer_id + ", ";
    query += "active = TRUE ";
    query += "WHERE request_id = " + queryObject.request_id + ";";

    query += "SELECT other_person,request_id,request_text FROM request WHERE request_id = " + queryObject.request_id + ";";

    query += "SELECT user.real_name, user.email ";
    query += "FROM user ";
    query += "WHERE user.user_id <> '" + queryObject.userId + "';";

    query += "SELECT user.real_name ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    const pool = queryObjectShared.createPool();
    module.exports = pool;
    pool.getConnection()
    	.then(conn => {
	    conn.query(query)
	    	.then((rows) => {
		    var obj = {};
		    // rows[0] is the status from UPDATE
		    var requestDetails = rows[1][0];
		    var users = rows[2];
		    var realName = rows[3][0].real_name;
		    var comma = "";
		    var emailList = "";
		    var emails = [];
		    var url = "https://pireifej.com/prayer/index.html?requestId=" + requestDetails.request_id;

		    
		    for (var i = 0; i < users.length; i++) {
			emailList += comma + users[i].email;
			emails.push(users[i].email);
			comma = ",";
		    }

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

			var otherPerson = requestDetails.otherPerson;

			data = data.replace("{{realName}}", realName);
			data = data.replace("{{realName}}", realName);
			
			if (otherPerson) {
			    data = data.replace("{{otherPerson}}", "(for " + otherPerson + ")");
			} else {
			    data = data.replace("{{otherPerson}}", "");
			}

			data = data.replace("{{prayerText}}", requestDetails.request_text);
			data = data.replace("{{requestLink}}", url);

			var mySubject = "Please pray for me!";

			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: 'pireifej@gmail.com',
			    bcc: emails,
			    subject: mySubject,
			    html: data
			};
		    
			transporter.sendMail(mailOptions, function(error, info) {
			    if (error) {
				var obj = {};
				obj["result"] = 'Error: ' + error;
				obj["query"] = query;
				console.log(JSON.stringify(obj));
				process.exit();
				return;
			    } else {
				var obj = {};
				obj["output"] = env;
				obj["result"] = 'Email sent: ' + info.response;
				obj["query"] = query;
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

if (command == "logVisitor") {
    queryObjectShared.requireParam("details");
    queryObjectShared.requireParam("page");

    query = "INSERT INTO visitors (page,visitor_details) VALUES (";
    query += "'" + queryObject.page + "',";
    query += "'" + queryObject.details + "')";
}

if (command == "getPrayerCount") {
    query = "SELECT COUNT(*) ";
    query += " FROM user_request ";
    query += " WHERE user_id = " + queryObject["userId"];
}

if (command == "getAllPrayers") {
    query = "SELECT * ";
    query += "FROM prayers ";
    query += "WHERE prayers.active = 1;";
}

if (command == "getActiveAndInactivePrayers") {
    query = "SELECT * ";
    query += "FROM prayers ";
}

if (command == "deletePrayer") {
    queryObjectShared.requireParam("prayerName");
    query = "DELETE FROM prayers WHERE prayer_file_name='" + queryObject.prayerName + "';";
}

if (command == "createPrayer") {
    queryObjectShared.requireParam("prayerText");
    queryObjectShared.requireParam("prayerTitle");

    query = "INSERT INTO prayers (prayer_title, prayer_text, prayer_file_name) VALUES (";
    query += "'" + queryObject.prayerTitle + "',";
    query += "'" + queryObject.prayerText + "',";
    query += "'newPrayer');";
}

if (command == "updatePrayer") {
    queryObjectShared.requireParam("prayerId");
    queryObjectShared.requireParam("prayerTitle");
    queryObjectShared.requireParam("prayerText");
    queryObjectShared.requireParam("prayerActive");

    var prayerText = queryObject["prayerText"];
    var prayerTags = queryObject["prayerTags"];
    var prayerTitle = queryObject["prayerTitle"];
    var prayerName = queryObject["prayerName"];
    var prayerId = queryObject["prayerId"];
    var prayerActive = queryObject["prayerActive"];
    var categoryId = queryObject["categoryId"];

    query = "UPDATE prayers ";
    query += "SET prayer_title = '" + prayerTitle + "' ";
    if (categoryId) query += ", fk_category_id = '" + categoryId + "' ";
    if (prayerTags) query += ", tags = '" + prayerTags + "' ";
    if (prayerText) query += ", prayer_text = '" + prayerText + "' ";
    if (prayerActive) query += ", active = " + prayerActive + " ";
    query += "WHERE prayer_id = '" + prayerId + "'";
}

if (command == "readPrayer") {
    queryObjectShared.requireParam("fileName");

    query = "SELECT prayer_text ";
    query += "FROM prayers ";
    query += "WHERE prayer_file_name='" + queryObject.fileName + "';";
}

if (command == "previewPrayer") {
    queryObjectShared.requireParam("userId");
    queryObjectShared.requireParam("requestText");

    query = "SELECT user.real_name,user.gender ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    query += "SELECT prayers.tags,prayers.prayer_file_name,prayers.prayer_title ";
    query += "FROM prayers; ";

    const pool = queryObjectShared.createPool();
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

		    var bestPrayerObj = getBestPrayer(prayers, requestText);
		    var bestPrayer = bestPrayerObj.result;
		    var scores = bestPrayerObj.scores;

		    fs.readFile(home + '/prayers/' + bestPrayer, 'utf8', function (err, data) {
			if (err) {
			    console.log("Error");
			    console.log(err);
			    return;
			}

			var customPrayer = generateCustomPrayer(data, realName, gender, otherPerson);
			obj["result"] = {prayer:customPrayer,scores:scores};
			obj["query"] = query;
//			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
//			process.exit();
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
    queryObjectShared.requireParam("requestId");

    var debug = (queryObject["debug"]) ? queryObject.debug : false;

    query = "SELECT user.real_name,user.gender,";
    query += "request.request_text,request.other_person,request.request_id,request.request_title,request.picture,request.fk_prayer_id,prayers.prayer_text,prayers.prayer_title,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request INNER JOIN user INNER JOIN prayers ";
    query += "WHERE user.user_id = request.user_id ";
    query += "AND prayers.prayer_id = request.fk_prayer_id ";
    query += "AND request.request_id = '" + queryObject.requestId + "';";

/*    query += "SELECT prayers.tags,prayers.prayer_file_name,prayers.prayer_title,prayers.prayer_id,prayer_text ";
    query += "FROM prayers ";
    query += "WHERE prayers.active = 1;";
*/
    const pool = queryObjectShared.createPool();
    module.exports = pool;
    pool.getConnection()
        .then(conn => {
            conn.query(query)
                .then((rows) => {
		    var requestText = "";
		    var realName = "";
		    var gender = "";
		    var otherPerson = "";
		    var prayerId = "";
		    var selectedPrayerFileName = "";

//		    var request = rows[0][0];
//		    var prayers = rows[1];
		    var request = rows[0];

		    if (request.length > 0) {
			requestText = request.request_text
			realName = request.real_name;
			gender = request.gender;
			otherPerson = request.other_person;
			prayerId = request.fk_prayer_id;

		/*	for (var i = 0; i < prayers.length; i++) {
			    if (prayers[i].prayer_id == prayerId) {
				selectedPrayerFileName = prayers[i].prayer_file_name;
			    }
			}
		*/
		    }

		    if (debug) {
			console.log("request text");
			console.log(requestText);
		    }
/*
		    const rake = require('node-rake');
		    const myKeywords = rake.generate(requestText);
		    const datamuse = require('datamuse');
		    if (debug) {
			console.log("keywords...");
			console.log(myKeywords);
		    }
*/
		    // https://www.npmjs.com/package/parts-of-speech
/*		    var chosen = myKeywords[0];
		    var pos = require('pos');
		    for (var i = 0; i < myKeywords.length; i++) {*/
			// phrase has priority
/*			if (myKeywords[i].split(" ").length > 1) {
			    chosen = myKeywords[i];
			    var phraseWords = chosen.split(" ");
			    for (var j = 0; j < phraseWords.length; j++) {
				var words = new pos.Lexer().lex(phraseWords[j].toLowerCase());
				var tagger = new pos.Tagger();
				var taggedWords = tagger.tag(words);
				for (k in taggedWords) {
				    var taggedWord = taggedWords[k];
				    var word = taggedWord[0];
				    var tag = taggedWord[1];
				    if (debug) console.log("got phrase:" + word + " /" + tag);
				    if (tag == "VB" || tag == "VBN") {
					chosen = word;
					break;
				    }
				    // adjective has priority
				    if (tag == "JJ") {
					chosen = word;
					break;
				    }
				}
			    }
			}
			var words = new pos.Lexer().lex(myKeywords[i].toLowerCase());
			var tagger = new pos.Tagger();
			var taggedWords = tagger.tag(words);
			for (j in taggedWords) {
			    var taggedWord = taggedWords[j];
			    var word = taggedWord[0];
			    var tag = taggedWord[1];
			    if (tag == "VB" || tag == "VBN") {
				chosen = word;
				break;
			    }
			    // adjective has priority
			    if (tag == "JJ") {
				chosen = word;
				break;
			    }
			    if (debug) console.log("regular:" + word + " /" + tag);
			}
		    }

		    if (debug) console.log("chosen word = " + chosen);
*/		    
/*		    datamuse.words({
			ml: "chosen"
		    })
			.then((json) => {
			    var keywords = {};
			    for (var i = 0; i < json.length; i++) {
				keywords[json[i].word] = true;
			    }
			    var score = {};
			    for (var key in categories) {
				score[key] = 0;
			    }
			    for (var key in categories) {
				for (var i = 0; i < categories[key].length; i++) {
				    if (keywords[categories[key][i]]) score[key]++;
				}
			    }
			    if (debug) console.log(score);

			    const max = Object.keys(score).reduce((a, v) => Math.max(a, score[v]), -Infinity);
			    const result = Object.keys(score).filter(v => score[v] === max);

		    	    var bestPrayerObj = { result: result[0]+"1", scores: score, title: "general" };
			    var bestPrayer = bestPrayerObj.result;
			    var scores = bestPrayerObj.scores;
			    scores["chosen"] = chosen;
			    var title = bestPrayerObj.name;
*/
			    // don't use logic to select best prayer, just select assigned prayer
//			    if (selectedPrayerFileName) {
//				bestPrayer = selectedPrayerFileName;
//				title = "Prayer Title";
//			    }

		    // if prayerId exists, pick that bestPrayer prayer name
		    var scores = {};
		    var otherPerson = request.other_person;
		    var realName = request.real_name;
		    
		    if (!request.prayer_text) {
			var obj = {};
			obj["result"] = {};
			obj["result"]["prayer_title"] = request.request_title;
			obj["result"]["prayer_text"] = "No prayer assigned yet";
			obj["result"]["request"] = request;
			obj["result"]["query"] = query;
			obj["result"]["scores"] = scores;
			console.log(JSON.stringify(obj));
			conn.release();
			conn.end();
			process.exit();
			return;
		    }

		    var customPrayer = generateCustomPrayer(request.prayer_text, realName, request.gender, otherPerson);

			    var obj = {};
			    obj["result"] = {};
			    obj["result"]["prayer_title"] = request.request_title;
			    obj["result"]["prayer_text"] = customPrayer;
			    obj["result"]["request"] = request;
			    obj["result"]["query"] = query;
			    obj["result"]["scores"] = scores;
			    console.log(JSON.stringify(obj));
			    conn.release();
			    conn.end();
			    process.exit();
			    return;
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
//	});
    return;
}

if (command == "deleteRequest") {
    query = "UPDATE request ";
    query += "SET active = FALSE ";
    query += "WHERE request_id = '" + queryObject.requestId + "'";
}

if (command == "joinRosarySession") {
    queryObjectShared.requireParam("userId");
    queryObjectShared.requireParam("sessionId");
    
    query = "INSERT INTO rosary (session_id, fk_user_id) VALUES(";
    query += "'" + queryObject.sessionId + "',";
    query += "'" + queryObject.userId + "');";
}

if (command == "leaveRosarySession") {
    queryObjectShared.requireParam("userId");
    queryObjectShared.requireParam("sessionId");
    
    query = "UPDATE rosary ";
    query += "SET session_id = NULL ";
    query += "WHERE fk_user_id = '" + queryObject.userId + "' ";
    query += "AND session_id = '" + queryObject.sessionId + "';";
}

if (command == "getRosarySession") {
    queryObjectShared.requireParam("sessionId");

    query = "SELECT user.real_name,rosary.fk_user_id,CONVERT_TZ(rosary.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM rosary ";
    query += "INNER JOIN user ON user.user_id = fk_user_id ";
    query += "WHERE session_id='" + queryObject.sessionId + "';";
}

if (command == "getUnassignedPrayers") {
    query = "SELECT request_id,request_text,picture,other_person ";
    query += "FROM request WHERE fk_prayer_id = 37;";
}

if (command == "getRequest") {
    queryObjectShared.requireParam("requestId");

    query = "SELECT request_id,request_text,request_title,request.picture as request_picture,category.category_name,user.user_name,user.picture,user.real_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request ";
    query += "INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request_id = '" + queryObject.requestId + "'; ";
}

if (command == "getMyRequests") {
    queryObjectShared.requireParam("userId");

    query = "SELECT request.request_id,request.user_id,request_text,request_title,picture as request_picture,category.category_name,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' and request.active is TRUE ";
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
    //query += "AND (request.user_id <> '" + queryObject.userId + "' OR request.other_person <> '') ";
    // you already prayed
    query += "AND request.request_id NOT IN ";
    query += "(SELECT request_id FROM user_request WHERE user_request.user_id = '" + queryObject.userId + "') ";
    query += "ORDER BY timestamp DESC";
}

if (command == "getCategories") {
    query = "SELECT category_id, category_name ";
    query += "FROM category ";
    query += "WHERE active is TRUE";
}

if (command == "login") {
    queryObjectShared.requireParam("password");
    
    query = "SELECT password,user_name,email,real_name,user_title,user_about,location,active,timestamp,user_id,picture ";
    if (queryObject["userName"]) {
	query += "FROM user WHERE user_name = '" + queryObject.userName + "' ";
    }
    if (queryObject["email"]) {
	query += "FROM user WHERE email = '" + queryObject.email + "' ";
    }
    query += "LIMIT 1;";

    const pool = queryObjectShared.createPool();
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
    query = "SELECT user_id,user_name,email,real_name,location,user_title,user_about,gender,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.userId + "' ";
    query += "OR user_name = '" + queryObject.userId + "';";
}

if (command == "getThisUser") {
    query = "SELECT user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.thisUserId + "';";
}

if (command == "getAllUsers") {
    query = "SELECT user_id,user_name,picture,real_name ";
    query += "FROM user";
}

if (command=="passwordChange") {
    queryObjectShared.requireParam("password");
    queryObjectShared.requireParam("userId");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;
   
    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "UPDATE user ";
	query += "SET password = '" + password + "' ";
	query += "WHERE user_id = '" + queryObject.userId + "';";

	const pool = queryObjectShared.createPool();
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

if (command == "getTemp") {
    var max = 10;
    var temp = (Math.random() * (99 - 97.9) + 97.9).toFixed(2);
    var obj = {};
    obj["result"] = temp;
    console.log(JSON.stringify(obj));
    process.exit();
}

if (command == "updateUser") {
    queryObjectShared.requireParam("userId");
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
    if (queryObject["gender"]) {
	queryParts.push("gender = '" + queryObject.gender + "'");
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
    // init tags hash
    var tags = {};
    var prayerNames = {};

    // store each prayer tag into 'fileName' --> 'tags list' hash
    for (var i = 0; i < prayers.length; i++) {
	var fileName = prayers[i].prayer_file_name;
	var prayerTags = prayers[i].tags;
	var prayerName = prayers[i].prayer_title;
	if (!prayerTags) continue;
	tags[fileName] = {};
	prayerNames[fileName] = prayerName;

	prayerTags = prayerTags.split(",");
	for (var j = 0; j < prayerTags.length; j++) {
	    tags[fileName][prayerTags[j].toLowerCase()] = true;
	}
    }

    // store each request word into hash
    var words = {};
    var requestWords = requestText.split(" ");

    const rake = require('node-rake');
    const myKeywords = rake.generate(requestText);

    const datamuse = require('datamuse');
    for (var i = 0; i < myKeywords.length; i++) {
	console.log(myKeywords[i]);
	getLikeWords(myKeywords[i]);
    }

    if (requestWords.length == 1) {
	requestWords = requestText.split("%20");
    }

    for (var i = 0; i < requestWords.length; i++) {
	words[requestWords[i].toLowerCase()] = true;
    }

    // perform scoring
    var scores = {};
    for (var prayerName in tags) {
	if (!scores[prayerName]) scores[prayerName] = 0;

	var myTags = tags[prayerName];
	for (var tag in myTags) {
	    if (words[tag]) {
		scores[prayerName]++;
	    }
	}
    }

    var allZeroes = true;
    for (var key in scores) {
	if (scores[key] > 0) {
	    allZeroes = false;
	}
    }

    var finalPrayer = "general1";
    if (!allZeroes) {
	const max = Object.keys(scores).reduce((a, v) => Math.max(a, scores[v]), -Infinity);
	const result = Object.keys(scores).filter(v => scores[v] === max);
	finalPrayer = result[0];
    }

    var prayerTitle = prayerNames[finalPrayer];
    return {result:finalPrayer,scores:scores,name:prayerTitle};
}

function getLikeWords(phrase) {
    const datamuse = require('datamuse');
    console.log("================="+phrase+"=====================");
     datamuse.words({
	ml: phrase
    })
	.then((json) => {
	    console.log(json);
	    //do it!
	});
}

function generateCustomPrayer(prayerText, realName,gender,otherPerson) {
//    const genderDetect = require('gender-detection');

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

    realName = (otherPerson !== "undefined") ? otherPerson : realName;

//    if (!gender) {
//	gender = genderDetect.detect(realName);
//    }

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
    queryObjectShared.requireParam("userId");
    
    query = "SELECT user.real_name,user.picture,request.request_title,request.request_text ";
    query += "FROM user_request INNER JOIN request ON request.request_id = user_request.request_id ";
    query += "INNER JOIN user on user.user_id = request.user_id ";
    query += "WHERE user_request.user_id=" + queryObject.userId;
}

if (command == "postComment") {
    queryObjectShared.requireParam("requestId");
    queryObjectShared.requireParam("comment");

    query = "INSERT INTO comments (request_id,user_id,comment) ";
    query += "VALUES (" + queryObject.requestId + ",";
    query += queryObject.userId + ",";
    query += "'" + queryObject.comment + "')";
}

if (command == "getRequestComments") {
    queryObjectShared.requireParam("requestId");

    query = "SELECT user.picture,user.real_name,comments.user_id,comments.request_id,comments.comment,CONVERT_TZ(comments.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM comments INNER JOIN user ";
    query += "ON user.user_id = comments.user_id ";
    query += "WHERE comments.request_id IN(" + queryObject.requestId + ")";
}

if (command == "getPeopleWhoPrayed") {
    queryObjectShared.requireParam("requestId");
    
    query = "SELECT user.picture,user.real_name,user.user_name,user_request.user_id,user_request.request_id,user_request.timestamp ";
    query += "FROM user_request INNER JOIN user ";
    query += "ON user.user_id = user_request.user_id ";
    query += "WHERE request_id IN (" + queryObject.requestId + ")";
}

if (command == "createUser") {
    queryObjectShared.requireParam("userName");
    queryObjectShared.requireParam("password");
    queryObjectShared.requireParam("email");
    queryObjectShared.requireParam("realName");
    queryObjectShared.requireParam("location");
    queryObjectShared.requireParam("title");
    queryObjectShared.requireParam("about");
    queryObjectShared.requireParam("picture");
    queryObjectShared.requireParam("gender");
    queryObjectShared.requireParam("phone");

    var mypassword = queryObject.password;
    var bcrypt = require('bcrypt');
    const saltRounds = 5;

    bcrypt.hash(mypassword, saltRounds, function(err, hash) {
	var password = hash;
	query = "INSERT INTO user (user_name, password, email, real_name, location, user_title, user_about, picture, gender, phone, active) VALUES (";
	query += "'" + queryObject.userName + "',";
	query += "'" + password + "',";
	query += "'" + queryObject.email + "',";
	query += "'" + queryObject.realName + "',";
	query += "'" + queryObject.location + "',";
	query += "'" + queryObject.title + "',";
	query += "'" + queryObject.about + "',";
	query += "'" + queryObject.picture + "',";
	query += "'" + queryObject.gender + "',";
	query += "'" + queryObject.phone + "',";
	query += "TRUE);";

	const pool = queryObjectShared.createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};

			if (mypassword == "facebook") {
			    obj["output"] = env;
			    obj["result"] = 'facebook user created';
			    obj["query"] = query;
			    console.log(JSON.stringify(obj));
			    process.exit();
			    conn.release();
			    conn.end();
			    return;
			}

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
    var createRequest = require("./createRequest");
    createRequest.query(queryObject)
	.then((data) => {
	    console.log(data);
	    process.exit();
	})
}

if (command == "prayFor") {
    queryObjectShared.requireParam("requestId");
    queryObjectShared.requireParam("userId");
    
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

    const pool = queryObjectShared.createPool();
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

const pool = queryObjectShared.createPool();
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
