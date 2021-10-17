var QueryObject = module.exports = {
    value: {},
    init: function(thing) {
	for (var i = 0; i < thing.length; i++) {
	    var param = thing[i];
	    var params = param.split("=");
	    QueryObject.value[params[0]] = params[1];
	}
    },
    requireParam: function(param) {
/*	if (param == "userId") {
	    QueryObject.value["userId"] = 105; // pireifej user
	    return;
	}
*/
	if (!QueryObject.value[param]) {
	    var obj = {};
	    obj["result"] = param + " is required";
	    console.log(JSON.stringify(obj));
	    process.exit();
	}
    },
    createPool: function() {
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
}
