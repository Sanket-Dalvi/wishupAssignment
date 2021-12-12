const express = require('express');
const router = express.Router();

module.exports = router;

//REST APIs
//SAVE USER
router.put('/:username', async(req, res) => {
    const query = 'INSERT INTO USER SET USER_NAME = ? , CREATED_AT = ?';
    var date_time = new Date();
    pool.query(query, [req.params.username, date_time], (err, result, fields) => {
        if (err) {
            res.json({ STATUS: "FAILIURE", ERROR: "USER REGISTRATION FAILED" });
        }
        res.json({ STATUS: "SUCCESS", user_name: req.params.username, created_at: date_time });
    });
});