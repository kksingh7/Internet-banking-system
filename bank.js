const express = require('express');
const app = express();
const port = 9000;
const path = require('path');

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname + '\\homepage.html'));
    // res.end();
});
app.get('/aboutus', function (req, res) {
    res.sendFile(path.join(__dirname + '\\About Us.html'));
    // res.end();
});
app.get('/products', function (req, res) {
    res.sendFile(path.join(__dirname + '\\products.html'));
    // res.end();
});
app.get('/onlineservices', function (req, res) {
    res.sendFile(path.join(__dirname + '\\online services.html'));
    // res.end();
});
app.get('/payments', function (req, res) {
    res.sendFile(path.join(__dirname + '\\payment.html'));
    // res.end();
});
app.get('/signin', function (req, res) {
    res.sendFile(path.join(__dirname + '\\SignIn.html'));
    // res.end();
});
app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '\\signup.html'));
    // res.end();
});
app.get('/profile', function (req, res) {
    res.sendFile(path.join(__dirname + '\\userProfile.html'));
    // res.end();
});

app.listen(port, () => console.log("App started at port: " + port));