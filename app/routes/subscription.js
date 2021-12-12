const express = require('express');
const router = express.Router();

module.exports = router;

//REST APIs
//SAVE USER
router.post('/subscription', async (req, res) => {
    const query = 'INSERT INTO USER_SUBSCRIPTION SET USER_ID_FK = (SELECT USER_ID FROM USER WHERE USER_NAME = ?) , PLAN_ID_FK = ?, START_DATE = ?';
    var amount;
    pool.query(query, [req.body.user_name, req.body.plan_id, req.body.start_date], (err, result, fields) => {
        if (err) {
            res.json({ STATUS: "FAILIURE", ERROR: "USER SUBSCRIPTION FAILED" });
        }
        const selectQuery = 'SELECT COST_IN_USD FROM SUBSCRIPTION_PLAN PLAN_NAME = ?';
        pool.query(selectQuery, [req.body.plan_id], (errInnner, resultInner, fields) => {
            if (errInnner) {
                res.json({ STATUS: "FAILIURE", ERROR: "NO PLAN FOUND WITH NAME" + eq.body.plan_id });
            }
            amount = resultInner.COST_IN_USD;
        });
        res.json({ STATUS: "SUCCESS", amount: "-" + amount });
    });
});