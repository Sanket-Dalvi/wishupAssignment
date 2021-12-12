//imports
const http = require('http');
const { createPool } = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

//express variable
var app = express();
app.use(bodyparser.json);

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

//create server
http.createServer(app).listen(3333, () => console.log("STARTED"));

//START SERVER
//const port = 3333;
//app.listen(port, () => console.log(`WISHUP SUBCRIPTION SERVICE IS ACTIVE AND RUNNING AT PORT ${port}`));

//routers
//user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

//subscription router
const subscriptionRouter = require('./routes/subscription');
app.use('/user', subscriptionRouter);

//for testing 
app.get('/hello', (req, res) => { console.log("hello") });
