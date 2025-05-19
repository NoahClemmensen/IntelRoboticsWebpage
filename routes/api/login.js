const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
    // Check if the user is already logged in
    const isLoggedIn = req.cookies.isLoggedIn;
    if (req.path.startsWith('/web') && !isLoggedIn) {
        return res.redirect('/login');
    }
    next();
})

router.get('/', function(req, res, next) {
    const { username, password } = req.query;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    // Simulate a login check
    if (username === 'admin' && password === 'password') {
        // Generate a JWT token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Set the token as a cookie
        res.cookie('jwtToken', token, { maxAge: 900000, httpOnly: true });
        return res.status(200).redirect('/web');
    } else {
        return res.status(401).render('login', { title: 'Login', error: 'Invalid username or password' });
    }
});

module.exports = router;
