// BASE SETUP
    // ==============================================

    var express = require('express');
    var app     = express();
    const hostname = '192.168.1.8';
    const port = process.env.PORT || 3000;
    const router = require('./routes/demo2.js')


    // apply the routes to our application
    app.use('/user',router);


    // sample route with a route the way we're used to seeing it
    // we dont use :sample, 
    app.get('/sample', function(req, res) {
        res.send(`this is a sampleeeeeee!`);
    });

    // ROUTES
    // ==============================================
    // Using app.route lets us define multiple actions on a single login route. 
    app.route('/login')

        // show the form (GET http://localhost:8080/login)
        .get(function(req, res) {
            console.log('inside login get');
            res.send('this is the login form');
        })

        // process the form (POST http://localhost:8080/login)
        .post(function(req, res) {
            console.log('inside login post');
            res.send('processing the login form!');
        });

    // we'll create our routes here

    // START THE SERVER
    app.listen(port, function () {
        console.log(`Listening at port: ${port}/...`);
    });