const express = require('express');
const pool = require('../bin/db');
const router = express.Router();

module.exports = router;

//REST APIs
//SAVE USER
router.put('/:username', async (req, res) => {
    if (!req.params.username.trim()) {
        res.json({ status: "FAILIURE", error: "USER NAME CAN NOT BE EMPTY" });
    } else {
        const selectQuery = 'SELECT USER_ID FROM USER WHERE USER_NAME = ?';
        pool.query(selectQuery, [req.params.username.toUpperCase()], (err, result, fields) => {
            if (err) {
                console.log(err);
                res.json({ status: "FAILIURE", error: "NO PLAN FOUND WITH NAME : " + req.body.plan_id });
                return;
            }
            if (result[0]) {
                res.json({ status: "FAILIURE", error: "USER NAME ALREADY EXISTS. PLEASE TRY SOME OTHER NAME" });
            } else {
                const query = 'INSERT INTO USER SET USER_NAME = ? , CREATED_AT = ?';
                var date_time = new Date();
                pool.query(query, [req.params.username.toUpperCase(), date_time], (err, result, fields) => {
                    if (err) {
                        res.json({ status: "FAILIURE", status: "USER REGISTRATION FAILED" });
                        return;
                    }
                    var userName = req.params.username.toUpperCase();
                    res.json({ status: "SUCCESS", user_name: userName, created_at: date_time });
                });

            }
        });
    }

});

