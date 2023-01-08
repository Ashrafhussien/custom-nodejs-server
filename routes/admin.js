var express = require('express');
var adminRouter = express.Router();
var db = require("./../db.js");
const tableName = "users5";


// http status codes
const statusOK = 200;
const statusNotFound = 404;

adminRouter.post('/auth',function(req,res){
    var adminName = req.body.adminName;
    var password = req.body.password;
    if(adminName=='ashraf' && password=='123321'){
        res.statusCode = statusOK;
        res.send(`admin is correct`);
    }else{
        res.statusCode = statusNotFound;
        res.send(`admin name or password is wrong`);
    }
});

adminRouter.get('/', function(req, res) {
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

adminRouter.get('/newAccountNum', function(req, res) {
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


adminRouter.get('/verifyAccountName', function(req, res) {
    // http://127.0.0.1:3000/admin/verifyAccountName?verify=300001
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

// Handle POST request
adminRouter.post('/', function(req, res) {
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


// Handle PATCH request for add money
adminRouter.patch('/addMoney', function(req, res) {
    var body = req.body;
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
});

function verifySenderMoney(res,senderAccountNum,moneyToTransfer){
    console.log('inside function');
    var sql = "select money from " + tableName + " WHERE accountnum=?";
    var parameters = [senderAccountNum];
    db.all(sql, parameters, (err, rows) => {
        if (err) {
            //res.status(400).json({"error":err.message});
            console.log('err is found');
            console.log(err.message);
            console.log('');
            res.statusCode = 502;
            res.send(err.message);
            return false;
            }try {
            console.log('inside try');
            var money = rows[0]['money'];
            if(money>=moneyToTransfer){
                console.log('inside money is great');
                return true;
            } else {
                res.statusCode = 500;
                res.send('The money in sender account is less than money to transfer.');
                return false;}
            }catch(e){
                res.statusCode = 501;
                res.send(e.message);
                return false;
            }
        });
}

adminRouter.patch('/transferMoney', function(req, res) {
    
    var body = req.body;
    var senderAccountNum = body.senderAccountNum;
    var receiverAccountNum = body.receiverAccountNum;
    var moneyToTransfer = body.moneyToTransfer;
    var confirmation = verifySenderMoney(res,senderAccountNum,moneyToTransfer);
    if(!confirmation){
        console.log('inside conformation');
        return;
    }
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
});

module.exports = adminRouter