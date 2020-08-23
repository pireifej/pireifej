#!/usr/bin/env nodejs

var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: 'localhost',
        user:'pireifej',
        password: 'Armani2362!',
        database: 'god',
        connectionLimit: 5
    });

    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * from user")
                .then((rows) => {
                    //response.end("end response");
                    console.log(rows);
                    response.end('Hello World! Node.js is working correctly!\n');
                })
                .then((res) => {
                    response.end("res");
                    conn.end();
                })
                .catch(err => {
                    console.log("error");
                    response.end("error");
                    console.log(err);
                    conn.end();
                })
        }).catch(err => {
            console.log("Error again");
            response.end("Error again");
            conn.end();
        });
}).listen(8080);
console.log('Server running at http://198.12.248.83:8080/');
