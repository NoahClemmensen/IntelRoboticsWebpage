var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const isLoggedIn = req.cookies.isLoggedIn;
    if (isLoggedIn) {
        return res.redirect('/web');
    }
    
    res.render('login', { title: 'Login' });
});

module.exports = router;
