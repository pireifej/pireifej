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
var sendEmail = false;
var env = "prod";

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
    console.log("trying " + message);
    console.log(home + "/log.txt");
    fs.writeFile(home + '/log.txt', message, function (err) {
	if (err) return console.log(err);
    });
}

function requireParam(param) {
    if (param == "userId" && env == "test") {
	queryObject["userId"] = 35; // pireifej user
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

requireParam("command");

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

if (command == "getPrayer") {
    requireParam("requestId");

    query = "SELECT user.real_name,user.gender,request.request_text,prayers.tags,prayers.prayer_file_name,prayers.prayer_title ";
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
		    // determine best prayer to use
		    var prayers = rows;
		    var scores = {};
		    var requestText = "";
		    var realName = "";
		    var gender = "";
		    
		    if (prayers.length > 0) {
			requestText = prayers[0].request_text
			realName = prayers[0].real_name;
			gender = prayers[0].gender;
		    }

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
		    var fileNameToRead = result[0];

		    fs.readFile(home + '/prayers/' + fileNameToRead, 'utf8', function (err,data) {
			if (err) {
			    return;
			}

			var prayerText = data;
			const genderDetect = require('gender-detection');

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

			rows[0]["prayer_text"] = prayerText;
			
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

    query = "SELECT request_id,request_text,request_title,category.category_name,user.user_name,user.picture,user.real_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request ";
    query += "INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request_id = '" + queryObject.requestId + "'; ";
}

if (command == "getMyRequests") {
    requireParam("userId");

    query = "SELECT request.request_id,request.user_id,request_text,request_title,category.category_name,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp, ";
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
    query = "SELECT user.real_name, user_request.user_id, request.request_id, user.picture, CONVERT_TZ(user_request.timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM request INNER JOIN user_request ON user_request.request_id = request.request_id INNER JOIN user on user.user_id = user_request.user_id ";
    query += "WHERE request.user_id = '" + queryObject.userId + "' AND request.active = 1 ";
    query += "ORDER BY user_request.timestamp DESC ";
    query += "LIMIT 3;";
}

if (command == "getRequestFeed") {
    query = "SELECT request_id,request.user_id,request_text,request_title,category.category_name,CONVERT_TZ(request.timestamp,'GMT','" + queryObject.tz + "') as timestamp,user.real_name,user.picture, ";
    query += "(SELECT COUNT(*) FROM user_request WHERE user_request.request_id = request.request_id) as prayer_count ";
    query += "FROM request INNER JOIN category ON category.category_id = fk_category_id ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request.active IS TRUE ";
    query += "AND request.user_id <> '" + queryObject.userId + "' ";
    query += "AND request.request_id NOT IN ";
    query += "(SELECT request_id FROM user_request WHERE user_request.user_id = '" + queryObject.userId + "') ";
    query += "ORDER BY timestamp DESC";
}

if (command == "getCategories") {
    query = "SELECT category_id, category_name ";
    query += "FROM category ";
}

if (command == "login") {
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
    query = "SELECT user_name,email,real_name,location,user_title,user_about,picture,CONVERT_TZ(timestamp,'GMT','" + queryObject.tz + "') as timestamp ";
    query += "FROM user WHERE user_id = '" + queryObject.userId + "';";
}

if (command == "updateUser") {
/*    var pictureData = queryObject.picture;
    var imageBuffer = decodeBase64Image(pictureData);
    console.log(imageBuffer);
    var picturePath = "/var/www/html/prayer/img/users/" + queryObject.userName + "." + imageBuffer.type;
    var picturePathForDB = "img/users/" + queryObject.userName + "." + imageBuffer.type;
    require("fs").writeFile(picturePath, imageBuffer.data, 'base64', function(err) {
	var obj = {};
	if (err) {
	    obj["result"] = err;
	    obj["query"] = "No Query";
	    console.log(JSON.stringify(obj));
	    process.exit();
	    conn.release();
	    conn.end();
	    return;
	}
    });
  */  
    query = "UPDATE user ";
    query += "SET user_name = '" + queryObject.userName + "', ";
    query += "email = '" + queryObject.email + "', ";
    query += "real_name = '" + queryObject.realName + "', ";
    query += "location = '" + queryObject.location + "', ";
    query += "user_title = '" + queryObject.title + "', ";
    query += "user_about = '" + queryObject.about + "', ";
    query += "picture = '" + "uploads/" + queryObject.picture + "' ";
    query += "WHERE user_id = '" + queryObject.userId + "';";
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

/*    var pictureData = queryObject.picture;
    
    var imageBuffer = decodeBase64Image(pictureData);
*/
    //    var picturePath = "/home/pireifej/img/" + queryObject.userName + ".jpeg";
  //  var picturePath = "/var/www/html/prayer/img/users/" + queryObject.userName + "." + imageBuffer.type;
    //var picturePathForDB = "img/users/" + queryObject.userName + "." + imageBuffer.type;
    //    require("fs").writeFile("../img/users" + queryObject.userName + ".jpeg", base64Data, 'base64', function(err) {
    /*require("fs").writeFile(picturePath, imageBuffer.data, 'base64', function(err) {
	var obj = {};
	if (err) {
            obj["result"] = err;
            obj["query"] = "No Queryyyyy";
            console.log(JSON.stringify(obj));
            process.exit();
            conn.release();
            conn.end();
            return;
	}
    });*/
    
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
	query += "'" + "uploads/" + queryObject.picture + "',";
	query += "TRUE);";

	const pool = createPool();
	module.exports = pool;
	pool.getConnection()
	    .then(conn => {
		conn.query(query)
		    .then((rows) => {
			var obj = {};
//			obj["result"] = rows;
//			obj["query"] = query;
//			console.log(JSON.stringify(obj));

			var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
				user: 'pireifej@gmail.com',
				pass: 'bcvbfcsvklsnegqc'
                            }
			});

			var mailOptions = {
                            from: 'welcome@prayforus.com',
                            subject: "Welcome to Pray For Us!",
			    text: "Thanks for joining, " + queryObject.realName + "! Visit your profile to create requests and start praying.",
			    to: queryObject.email
			};

			//obj["result"] = mailOptions;
                        //obj["query"] = "IREIFEJ";
                        //console.log(JSON.stringify(obj));

			transporter.sendMail(mailOptions, function(error, info) {
			    var obj = {};
                            obj["result"] = 'Email sent: ' + info.response;
                            obj["query"] = "No Query";
                            console.log(JSON.stringify(obj));
                            process.exit();
			    conn.release();
			    conn.end();
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
		    });
	    });
    });
}

if (command == "createRequest") {
    requireParam("userId");
    requireParam("requestText");
    requireParam("requestTitle");
    requireParam("requestCategoryId");
    
    query = "INSERT INTO request (user_id, request_text, request_title, fk_category_id, active) VALUES (";
    query += "'" + queryObject.userId + "',";
    query += "'" + queryObject.requestText + "',";
    query += "'" + queryObject.requestTitle + "',";
    query += "'" + queryObject.requestCategoryId + "',";
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
		    var obj = {};
		    var requestId = rows[0].insertId;
		    var url = "https://pireifej.com/prayer/pray.html?requestId=" + requestId;
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

			data = data.replace("{{realName}}", realName);
			data = data.replace("{{realName}}", realName);
			data = data.replace("{{prayerText}}", queryObject.requestText);
			data = data.replace("{{requestLink}}", url);

			var mailOptions = {
			    from: 'pireifej@gmail.com',
			    to: 'pireifej@gmail.com',
			    bcc: emails,
			    subject: "Please pray for me!",
			    html: data,
//			text: "Hello,\n\n" + "Your friend, " + realName + " needs your prayer. Here are the details ... \n\n Subject: " + queryObject.requestTitle + "\n" + "Request: " + queryObject.requestText + "\n\nClick here to pray: \n" + url
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

    query += "SELECT user.real_name, user.email, request.request_title ";
    query += "FROM request ";
    query += "INNER JOIN user ON user.user_id = request.user_id ";
    query += "WHERE request.request_id = '" + queryObject.requestId + "'; ";

    query += "SELECT user.real_name, user.email ";
    query += "FROM user ";
    query += "WHERE user.user_id = '" + queryObject.userId + "';";

    sendEmail = true;
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
		}
		else if (sendEmail) {
		    var person1 = rows[1][0];
		    var person2 = rows[2][0];

		    var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			    user: 'pireifej@gmail.com',
			    pass: 'bcvbfcsvklsnegqc'
			}
		    });
    
		    var mailOptions = {
			from: 'welcome@prayforus.com',
			subject: person2.real_name + " prayed for you!",
			text: "Hello " + person1.real_name + "!\n\n" + person2.real_name + " just prayed for your request '" + person1.request_title + "'.\n\nHave a blessed day! Keep praying. Jesus loves you.",
		    };

		    mailOptions["to"] = person1.email;
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
			    obj["result"] = 'Email sent: ' + info.response;
			    obj["query"] = "No Query";
			    console.log(JSON.stringify(obj));
			    process.exit();
			    return;
			}
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
