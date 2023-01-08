var express = require('express');

// ROUTES
// ==============================================

 // get an instance of router
 var router = express.Router();

 // route middleware that will happen on every request (called loockup function)
 // This could be things like checking if a user is authenticated
 router.use(function(req, res, next) {

     // log each request to the console
     console.log(`inside route middleware: ${req.method, req.url}`);

     // continue doing what we were doing and go to the route
     next();
 });

 // ######### Route Middleware for Parameters ###########
 // Route middleware for parameters can be used to validate 
 // data coming to your application. If you have created a 
 // RESTful API also, you can validate a token and make sure 
 // the user is able to access your information.
 // route middleware to validate :name
 router.param('name', function(req, res, next, name) {
     // do validation on name here
     // blah blah validation
     // log something so we know its working
     console.log('doing name validations on ' + name + ' using router.param');

     // once validation is done save the new item in the req
     req.name = name;
     // go to the next thing
     next();
 });

 function lookupUser(req,res,next){
     // do validation on name here
     // blah blah validation
     // log something so we know its working
     console.log('doing name validations on ' + req.params.name + ' using lookupUser');

     // once validation is done save the new item in the req
     req.name = req.params.name;
     // go to the next thing
     next();
 }
 // route with parameters (http://localhost:8080/hello/:name)
 router.get('/hello/:name',lookupUser ,function(req, res) {
     console.log('hello ' + req.name + '!');
     res.send('hello ' + req.name + '!');
 });

 // home page route (http://localhost:8080)
 router.get('/', function(req, res) {
     console.log(`inside get: ${req.method, req.url}`);
     res.send('im the home page!');
 });

 // about page route (http://localhost:8080/about)
 router.get('/about/:name', function(req, res) {
     console.log('inside get/about');
     res.send('in the about page!');
 });


 module.exports = router