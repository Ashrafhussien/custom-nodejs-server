// nodejs_server/index.js
    
var express = require('express');
var bodyParser = require('body-parser');
var db = require("./db.js")
var app = express();
const fs = require("fs");
const path = require('path');

// bodyParser is a type of middleware
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const tableName = "users5";

// http status codes
const statusOK = 200;
const statusNotFound = 404;

const adminRouter = require('./routes/admin.js')
const userRouter = require('./routes/user.js')

// apply the routes to our application
app.use('/admin',adminRouter);
app.use('/user',userRouter);


app.listen(port, function () {
    console.log(`Listening at port: ${port}/...`);
});