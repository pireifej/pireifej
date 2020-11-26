#!/usr/bin/env nodejs

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

const pool = createPool();
module.exports = pool;
pool.getConnection()
    .then(conn => {
	conn.query("select * from user")
	    .then((rows) => {
		console.log(JSON.stringify(rows));
		conn.release();
		return;
	    })
    });
