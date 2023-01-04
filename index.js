// nodejs_server/index.js
    
    var express = require('express');
    var bodyParser = require('body-parser');
    var db = require("./db.js")
    var app = express();
    const fs = require("fs");
    const path = require('path');
    // Defining new user
    let user = {
        name: "New User"
    };
    
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
    
    // Handle GET (all) request
    app.get('/', function(req, res) {
        var sql = "select * from " + tableName ;
        var params = [];
        db.all(sql, params, (err, rows) => {
            if (err) {
              console.log(err.message);
              res.status(400).json({"error":err.message});
              return;
            }
            res.send(rows);
          }
          
          );
    });
    app.get('/add', function(req, res) {
        var accountNum = req.query.num;
        var sql = "INSERT INTO " + tableName + " (name, userid, accountnum, password, money) VALUES (?,?,?,?,?)"
        var params = ["newUser","userid",accountNum,"user012",66000];
        db.all(sql, params, (err, rows) => {
            if (err) {
              console.log(err.message);
              res.status(400).json({"error":err.message});
              return;
            }
            res.send(rows);
          }
          
          );
    });
    app.get('/jsonr',function(req,res){
        // Read users.json file
        fs.readFile("tmp/temp.json", function(err, data) {
            // Check for errors
            if (err) throw err;
        
            // Converting to JSON
            var output = JSON.parse(data);
            
            console.log(output); // Print users 
            res.send(output);
    });
    });   
    const filePath = path.join("/tmp", "temp.json");
    console.log(filePath);
    app.get('/json',function(req,res){
        const temps = require("./tmp/temp");
        temps.push(user);
        fs.writeFile("tmp/temp.json", JSON.stringify(temps), err => {
     
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // Success
        });
        res.send("Done writing in json file");
        //res.end();
    });
    // Handle GET (one) request
    app.get('/newAccountNum', function(req, res) {
        var sql = "select MAX(accountnum) from " + tableName;
        var parameters = [];
        db.all(sql, parameters, (err, rows) => {
            if (err) {
                //res.status(400).json({"error":err.message});
                console.log('err is found');
                console.log(err.message);
                console.log('');
                res.statusCode = statusNotFound;
                res.send(`something is wrong`);
                return;
              }try {
                var maxAccountNum = rows[0]['MAX(accountnum)'];
                maxAccountNum = parseInt(maxAccountNum) +1;  
                res.send(maxAccountNum.toString());
              }catch(e){
                res.statusCode = statusNotFound;
                res.send(`Account Number is wrong`);
              }
        });
    });

    // Handle GET (one) request
    app.get('/verifyAccountName', function(req, res) {
        // http://127.0.0.1:3000/verifyAccountName?verify=300001
        var accountNumToVerify = req.query.verify;
        var sql = "select name from " + tableName + " WHERE accountnum=?";
        var parameters = [accountNumToVerify];
        db.all(sql, parameters, (err, rows) => {
            if (err) {
                //res.status(400).json({"error":err.message});
                console.log('err is found');
                console.log(err.message);
                console.log('');
                res.statusCode = statusNotFound;
                res.send(`something is wrong`);
                return;
                }try {
                var name = rows[0]['name'];
                res.send(name);
                }catch(e){
                res.statusCode = statusNotFound;
                res.send(`Account Number is wrong`);
                }
            });
        
    });

    app.get('/accountInfo', function(req, res) {
        // http://127.0.0.1:3000/accountInfo?verify=300001
        var accountNumToVerify = req.query.verify;
        var sql = "select name,money from " + tableName + " WHERE accountnum=?";
        var parameters = [accountNumToVerify];
        db.all(sql, parameters, (err, rows) => {
            if (err) {
                //res.status(400).json({"error":err.message});
                console.log('err is found');
                console.log(err.message);
                console.log('');
                res.statusCode = statusNotFound;
                res.send(`something is wrong`);
                return;
                }try {
                var result = rows[0];
                res.send(result);
                }catch(e){
                res.statusCode = statusNotFound;
                res.send(`Account Number is wrong`);
                }
            });
        
    });
    
    app.post('/:auth',function(req,res){
         // get data from request
        var authType = req.params.auth;
        if(authType=='adminAuth'){
            var adminName = req.body.adminName;
            var password = req.body.password;
            if(adminName=='ashraf' && password=='123321'){
                res.statusCode = statusOK;
                res.send(`admin is correct`);
            }else{
                res.statusCode = statusNotFound;
                res.send(`admin is wrong`);
            }
        }else if(authType=='userAuth'){
            var accountNumber = req.body.accountNumber;
            var enteredPassword = req.body.password;
            //todo
            var sql = "select * from " + tableName +" WHERE accountnum=?";
            var parameters = [accountNumber];
            db.all(sql, parameters, (err, rows) => {
                if (err) {
                    //res.status(400).json({"error":err.message});
                    console.log('err is found');
                    console.log(err.message);
                    console.log('');
                    res.statusCode = statusNotFound;
                    res.send(`something is wrong`);
                    return;
                  }try {
                var userPassword = rows[0]['password'];
                if(enteredPassword == userPassword){
                    res.statusCode = statusOK;
                    res.send(`user is correct`);
                }else{
                    res.statusCode = statusNotFound;
                    res.send(`password is wrong`);
                }
                  }catch(e){
                    res.statusCode = statusNotFound;
                    res.send(`Account Number is wrong`);
                  }

            });
        } 
    });
    // Handle POST request
    app.post('/', function(req, res) {
        var body = req.body;
        var sql = "INSERT INTO " + tableName + " (name, userid, accountnum, password, money) VALUES (?,?,?,?,?)"
        var parameters = [body.userName,body.userId,body.accountNum,body.password,body.money];
        db.run(sql,
        parameters,
        function (err, rows) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            req.statusCode = statusOK;
            res.send('Account created successfully ');
        });
    });
    
    // Handle PATCH request 
    app.patch('/:patchType', function(req, res) {
        var type = req.params.patchType;
        var body = req.body;
        if (type == 'addMoney'){
            var accountNumToAddMoney = body.accountNum;
            var moneyToAdd = body.money;
            var sql = "UPDATE " + tableName + " set  money=money+? WHERE accountnum=? "
            var parameters = [moneyToAdd,accountNumToAddMoney];
            db.run(sql,
            parameters,
            function (err, rows) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                req.statusCode = statusOK;
                res.send('money added successfuly');
            });
        }else if(type == 'transferMoney'){
            var senderAccountNum = body.senderAccountNum;
            var receiverAccountNum = body.receiverAccountNum;
            var moneyToTransfer = body.moneyToTransfer;
            var senderSql = "UPDATE " + tableName + " set  money=money-? WHERE accountnum=? "
            var senderParameters = [moneyToTransfer,senderAccountNum];
            var receiverSql = "UPDATE " + tableName + " set  money=money+? WHERE accountnum=? "
            var receiverParameters = [moneyToTransfer,receiverAccountNum];
            db.run(senderSql,
            senderParameters,
            function (err, rows) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                db.run(receiverSql,receiverParameters,function(error,resultrows){
                    if (error) {
                        res.status(400).json({ "error": error.message })
                        return;
                    }
                    res.statusCode = statusOK;
                    res.send('transaction complete');  
                });
            });
        }
       
    });
    
    // Handle DELETE request 
    app.delete('/:id', function(req, res) {
        // delete specified item
        var id = req.params.id;  // TODO validate id
        mockDatabase.splice(id, 1);
        // send response back
        res.statusCode = statusOK;
        res.send(`Item deleted at id ${id}`);
    });
    
    app.listen(port, function () {
        console.log(`Listening at port: ${port}/...`);
    });