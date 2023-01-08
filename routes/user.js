var express = require('express');
var userRouter = express.Router();


userRouter.post('/auth',function(req,res){
    var accountNumber = req.body.accountNumber;
    var enteredPassword = req.body.password;
    
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
});


userRouter.get('/accountInfo', function(req, res) {
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


userRouter.get('/verifyAccountName', function(req, res) {
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


userRouter.patch('/:patchType', function(req, res) {
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

module.exports = userRouter