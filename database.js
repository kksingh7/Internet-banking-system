var MongoClient = require('mongodb').MongoClient;
const port = 9000;
const path = require('path');
const os = require('os');
const fs = require('fs');

var http = require('http');

var userDB = "E_banking";
var usersDBurl = "mongodb://localhost:27017/" + userDB;
var sign_up_server_port = 8081;
var transfer_server_port = 8082;


var http = require('http');

function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


/*http.createServer(function (request, response) {

  // To Read a Cookie
  var cookies = parseCookies(request);

  // To Write a Cookie
  response.writeHead(200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
  response.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');*/

http.createServer(function (request, response) {

    request.on('data', function (message) {

        response.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

        //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var messageString = message.toString().split(" ");
        var requestType = messageString[0];

        if (requestType.toLowerCase() == "su") {
            var email = messageString[1];
            var password = messageString[2];
            var userName = messageString[3];

            MongoClient.connect(usersDBurl, function (err, client) {
                var db = client.db("mongodb");
                if (err) {
                    throw err
                };

                var accountno = Date.now();
                var user = {
                    id: accountno,
                    name: userName,
                    email: email,
                    password: password,
                    amount: 5000.00,
                    login_state: true
                }

                db.collection("users").find({ email: email }).toArray(function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    if (result.length <= 0) {
                        db.collection("users").insertOne(user, function (error, result) {
                            if (error) {
                                response.write(error.toString());
                                response.end();
                            } else {
                                response.write("successful " + user.id + " " + user.name + " " + user.amount);
                                response.end();
                            }
                        });
                    } else {
                        response.write("duplicate");
                        response.end();
                    }
                });
            });
        } else if (requestType.toLowerCase() == "si") {
            var email = messageString[2];
            var password = messageString[1];

            MongoClient.connect(usersDBurl, function (err, client) {
                var db = client.db("mongodb");
                if (err) {
                    throw err
                };

                db.collection("users").find({ email: email }).toArray(function (err, result) {
                    if (err || result.length <= 0) {
                        response.write("unsuccessful");

                        console.log("Failed")
                        response.end();
                    } else {

                        db.collection("users").updateOne({ email: result[0].email }, {
                            $set: { login_state: true },
                        }, function (err, res) {
                            if (err) {
                                response.write(unsuccessful);
                                response.end();
                            }

                            response.write("successful " + result[0].id + " " + result[0].name + " " + result[0].amount);
                            response.end();

                        });

                    }
                });
            });
        }
    });
}).listen(sign_up_server_port);


http.createServer(function (request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

    //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")


    request.on('data', function (message) {
        var messageString = message.toString().split(" ");
        var requestType = messageString[0];

        if (requestType.toLowerCase() == "tr") {
            var account1 = messageString[1];
            var account2 = messageString[2];
            var amount = messageString[3];

            MongoClient.connect(usersDBurl, function (err, client) {
                var db = client.db("mongodb");
                if (err) {
                    throw err
                };
                console.log("1");
                db.collection("users").find({ id: parseInt(account1) }).toArray(function (err, result) {
                    if (err || result.length <= 0) {
                        response.write("unsuccessful");
                        console.log("Failed");
                        response.end();
                    }
                    console.log("0");

                    if (result[0].amount > parseFloat(amount)) {
                        db.collection("users").updateOne({ id: parseInt(account1) }, {
                            $set: { amount: result[0].amount - parseFloat(amount) }
                        }, function (err, res) {
                            console.log("3");
                            if (err) {
                                response.write("unsuccessful");
                                console.log("2");
                                console.log(err.toString());
                                response.end();
                            }
                            db.collection("users").find({ id: parseInt(account2) }).toArray(function (err, result1) {
                                if (err || result1.length <= 0) {
                                    response.write("unsuccessful");
                                    console.log("Failed");
                                    response.end();
                                }
                                console.log("0");
                                db.collection("users").updateOne({ id: parseInt(account2) }, {
                                    $set: { amount: result1[0].amount + parseFloat(amount) }
                                }, function (err, res) {
                                    console.log("3");
                                    if (err) {
                                        response.write("unsuccessful");
                                        console.log("4");
                                        console.log(err.toString());
                                        response.end();
                                    }

                                    response.write("successful" + " " + (result[0].amount - parseFloat(amount)));
                                    response.end();
                                });
                            });
                        });
                    } else {
                        response.write("less");
                        response.end();
                    }
                });
            });
        }
    });
}).listen(transfer_server_port);

