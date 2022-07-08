const mysql = require('mysql');

const dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SecUrel0Gs543!!ksh##',
    database: 'bloom_db'
})

dbcon.connect(function (err, res) {
    if (err) throw (err)
    console.log('database connected');
})

module.exports = dbcon;