var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
});

module.exports = router;
