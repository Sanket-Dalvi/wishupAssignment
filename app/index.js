//imports
const { createPool } = require('mysql');

//mysql db connection pool details
const pool = createPool(
    {
        host: "database-1.cwo8qpqj2avt.us-east-2.rds.amazonaws.com",
        user: "wishup",
        password: "1stAssignment@wishup",
        database: "WISHUP",
        connectionLimit: 10
    }
);

pool.query('SELECT * FROM SUBSCRIPTION_PLAN', (err, data, fields) => {
    if (err) {
        return console.log(err);
    }
    return console.log(data);
});