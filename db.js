var sqlite3 = require('sqlite3').verbose()

const DATASOURCE = "sample.sqlite"
console.log("Inside db.js")

let db = new sqlite3.Database(DATASOURCE, (err) => {
    
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the sample database.')
        db.run('CREATE TABLE users5 ( \
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            name text, \
            userid text , \
            accountnum text , \
            password text , \
            money INTEGER DEFAULT 10000 \
            )',(err) => {
            if (err) {
                console.log("Table already exists.");
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO users5 (name, userid, accountnum, password, money) VALUES (?,?,?,?,?)';
                db.run(insert, ["John Smith","john01","300001","john001",10000]);
                db.run(insert, ["Mary Jones","mary02","300002","mary002",20000]);
            }
        });  
    }
});


module.exports = db