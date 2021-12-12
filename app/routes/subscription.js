const express = require('express');
const pool = require('../bin/db');
const dateFormatter = require('../bin/util');
const router = express.Router();

module.exports = router;

//REST APIs
//SUBSCRIBE 
router.post('/', async (req, res) => {
    //check if date valid
    try {
        var date = new Date(req.body.start_date);
        if (date == 'Invalid Date' || date <= new Date()) {
            res.json({ status: "FAILIURE", error: "INVALID DATE : " + req.body.start_date });
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({ status: "FAILIURE", error: "INVALID DATE : " + req.body.start_date });
        return;
    }
    var amount, validityInDays, planId;
    var selectQuery = 'SELECT * FROM SUBSCRIPTION_PLAN WHERE PLAN_NAME = ?';
    pool.query(selectQuery, [req.body.plan_id], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.json({ status: "FAILIURE", error: "ERROR WHILE FETCHING PLAN DETAILS : " + req.body.plan_id });
            return;
        }
        if (!result[0]) {
            res.json({ status: "FAILIURE", error: "NO PLAN FOUND WITH NAME : " + req.body.plan_id });
            return;
        }
        amount = result[0].COST_IN_USD;
        validityInDays = result[0].VALIDITY_IN_DAYS;
        planId = result[0].PLAN_ID;
        //CHECK IF VALID USER
        selectQuery = 'SELECT USER_ID FROM USER WHERE USER_NAME = ?';
        pool.query(selectQuery, [req.body.user_name.toUpperCase()], (error, userids, fields) => {
            if (error) {
                console.log(error);
                res.json({ status: "FAILIURE", error: "ERROR WHILE FETCHING USER DETAILS: " + req.body.plan_id });
                return;
            }
            if (!userids[0]) {
                res.json({ status: "FAILIURE", error: "NO USER FOUND WITH NAME : " + req.body.user_name });
                return;
            }

            //CHECK IF PLAN ALREADY ACTIVE 
            if (validityInDays > 0) {//paid plans
                selectQuery = 'SELECT * FROM USER_SUBSCRIPTION WHERE PLAN_ID_FK = ? AND USER_ID_FK = ?';
                pool.query(selectQuery, [planId, userids[0].USER_ID, req.body.start_date], (er, activeplans, fields) => {
                    if (er) {
                        console.log(er);
                        res.json({ status: "FAILIURE", error: "ERROR WHILE FETCHING USER DETAILS: " + req.body.plan_id });
                        return;
                    }
                    if (activeplans[0]) {
                        res.json({ status: "FAILIURE", error: "" + req.body.plan_id + " PLAN IS ALREADY ACTIVE FOR USER  " + req.body.user_name });
                        return;
                    }
                });
            } else {//free plans
                selectQuery = 'SELECT * FROM USER_SUBSCRIPTION WHERE PLAN_ID_FK = ? AND USER_ID_FK = ?';
                pool.query(selectQuery, [planId, userids[0].USER_ID], (er, activeplans, fields) => {
                    if (er) {
                        console.log(er);
                        res.json({ status: "FAILIURE", error: "ERROR WHILE FETCHING USER DETAILS: " + req.body.plan_id });
                        return;
                    }
                    if (activeplans[0]) {
                        res.json({ status: "FAILIURE", error: "" + req.body.plan_id + " PLAN IS ALREADY ACTIVE FOR USER  " + req.body.user_name });
                        return;
                    }
                });
            }

            var endDate = dateFormatter(new Date(req.body.start_date), validityInDays);
            const query = 'INSERT INTO USER_SUBSCRIPTION SET USER_ID_FK = (SELECT USER_ID FROM USER WHERE USER_NAME = ?) , PLAN_ID_FK = (SELECT PLAN_ID FROM SUBSCRIPTION_PLAN WHERE PLAN_NAME = ?), START_DATE = ?, VALID_TILL = ?';
            pool.query(query, [req.body.user_name.toUpperCase(), req.body.plan_id, req.body.start_date, endDate], (err, result, fields) => {
                if (err) {
                    res.json({ status: "FAILIURE", error: "USER SUBSCRIPTION FAILED" });
                    return;
                }
                res.json({ status: "SUCCESS", amount: "-" + amount });
            });
        });
    });
});




//GET SUBSCRIPTION BY USERNAME 
router.get('/:username', async (req, res) => {
    var uid, userName = req.params.username.toUpperCase();
    const selectQuery = 'SELECT USER_ID FROM USER WHERE USER_NAME = ?';
    pool.query(selectQuery, [userName], (err, userids, fields) => {
        if (err) {
            console.log(err);
            res.json({ status: "FAILIURE", error: "ERROR WHILE FETCHING USER DETAILS: " + req.body.plan_id });
            return;
        }
        if (!userids[0]) {
            res.json({ status: "FAILIURE", error: "NO USER FOUND WITH NAME : " + req.params.username });
            return;
        }

        uid = userids[0].USER_ID;
        const query = 'SELECT USER_NAME,PLAN_NAME,VALIDITY_IN_DAYS,START_DATE FROM USER_SUBSCRIPTION US join USER U ON US.USER_ID_FK = U.USER_ID JOIN SUBSCRIPTION_PLAN SP ON SP.PLAN_ID = US.PLAN_ID_FK WHERE US.USER_ID_FK = ?';
        pool.query(query, [uid], (err, result, fields) => {
            if (err) {
                res.json({ status: "FAILIURE", error: "COULD NOT FETCH DATA" });
                return;
            }
            if (!result[0]) {
                res.json({ status: "FAILIURE", error: "NO SUBSCRIPTION HISTORY FOUND" });
                return;
            }
            var data = [], obj = {};
            result.forEach(row => {
                var date = new Date(row.START_DATE);
                var startDate = dateFormatter(new Date(date), 0);
                var endDate;
                if (row.VALIDITY_IN_DAYS === -1) {
                    endDate = "Infinite";
                } else {
                    endDate = dateFormatter(new Date(date), row.VALIDITY_IN_DAYS);
                }

                obj.plan_id = row.PLAN_NAME;
                obj.start_date = startDate;
                obj.valid_till = endDate;
                data.push(obj);
            });
            res.json(data);
        });
    });
});


//GET SUBSCRIPTION BY USERNAME & START DATE
router.get('/:username/:startdate', async (req, res) => {
    //check if date valid
    try {
        var date = new Date(req.params.startdate);
        if (date == 'Invalid Date' || date <= new Date()) {
            res.json({ status: "FAILIURE", error: "INVALID DATE : " + req.params.startdate });
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({ status: "FAILIURE", error: "INVALID DATE : " + req.params.startdate });
        return;
    }
    var uid;
    const selectQuery = 'SELECT USER_ID FROM USER WHERE USER_NAME = ?';
    pool.query(selectQuery, [req.params.username.toUpperCase()], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.json({ status: "FAILIURE", error: "NO PLAN FOUND WITH NAME : " + req.body.plan_id });
            return;
        }
        if (!result[0]) {
            res.json({ status: "FAILIURE", error: "NO USER FOUND WITH NAME : " + req.params.username });
            return;
        }

        uid = result[0].USER_ID;
        const query = 'SELECT USER_NAME,PLAN_NAME,VALIDITY_IN_DAYS,START_DATE FROM USER_SUBSCRIPTION US join USER U ON US.USER_ID_FK = U.USER_ID JOIN SUBSCRIPTION_PLAN SP ON SP.PLAN_ID = US.PLAN_ID_FK WHERE US.USER_ID_FK = ? AND US.START_DATE <= ? AND US.VALID_TILL >= ?';
        pool.query(query, [uid, req.params.startdate, req.params.startdate], (err, result, fields) => {
            if (err) {
                res.json({ status: "FAILIURE", error: "COULD NOT FETCH DATA" });
                return;
            }
            if (!result[0]) {
                res.json({ status: "FAILIURE", error: "NO SUBSCRIPTION HISTORY FOUND" });
                return;
            }
            var data = [], obj = {};
            result.forEach(row => {
                var date = new Date(row.START_DATE);
                var endDate = dateFormatter(new Date(date), row.VALIDITY_IN_DAYS);
                var timeDiff = Math.abs(new Date().getTime() - new Date(endDate).getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                obj.plan_id = row.PLAN_NAME;
                if (new Date().getTime() > new Date(endDate).getTime()) {
                    obj.days_left = "expired on " + endDate;
                } else {
                    obj.days_left = diffDays;
                }
                data.push(obj);
            });
            res.json(data);
        });
    });
});