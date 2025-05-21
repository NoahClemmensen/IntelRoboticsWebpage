const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DatabaseService = require('../../services/DatabaseService');

router.use(function(req, res, next) {
    // Check if the user is already logged in
    const isLoggedIn = req.cookies.isLoggedIn;
    if (req.path.startsWith('/home') && !isLoggedIn) {
        return res.redirect('/login');
    }
    next();
})

router.get('/', async function (req, res, next) {
    const {username, password} = req.query;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'});
    }

    // FOR DEV PURPOSES ONLY //
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '15m'});
        res.cookie('jwtToken', token, {maxAge: 900000, httpOnly: true});
        return res.status(200).redirect('/home');
    }
    // FOR DEV PURPOSES ONLY //

    const usersWithName = await DatabaseService.getUserByUsername(username);
    if (usersWithName.length === 0) {
        return res.status(401).json({error: 'Invalid username or password'});
    }

    const compareResult = await bcrypt.compare(password, usersWithName[0].password);
    if (!compareResult) {
        return res.status(401).json({error: 'Invalid username or password'});
    }

    const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '15m'});
    res.cookie('jwtToken', token, {maxAge: 900000, httpOnly: true});

    return res.status(200).redirect('/home');
});

router.get('/logout', async function (req, res, next) {
    res.clearCookie('jwtToken');
    res.clearCookie('isLoggedIn');
    return res.status(200).redirect('/login');
});


// FOR DEV PURPOSES ONLY
router.post('/newUser', function (req, res, next) {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'});
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    DatabaseService.createUser(username, hashedPassword);

    return res.status(200).json({message: 'User created successfully'});
});
// FOR DEV PURPOSES ONLY //

module.exports = router;
