var mysql = require('mysql');

//mysql db connection pool details
const pool = mysql.createPool(
    {
        host: "database-1.cwo8qpqj2avt.us-east-2.rds.amazonaws.com",
        user: "wishup",
        password: "1stAssignment@wishup",
        database: "WISHUP",
        connectionLimit: 10
    }
);

module.exports = pool;