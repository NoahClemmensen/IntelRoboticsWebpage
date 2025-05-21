const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/DatabaseService');
const bcrypt = require('bcrypt');

router.post('/update/:id', async function (req, res, next) {

});

router.post('/create', async function (req, res, next) {
    const {username, password, location_id, role_id} = req.body;

    if (!username || !password || !location_id || !role_id) {
        return res.status(400).redirect(`/home?user_error=Username, password, location ID and role ID are required`);
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        await DatabaseService.createUser(username, hashedPassword, role_id, location_id);
        return res.status(200).redirect(`/user/${username}`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/home?user_error=${error.message}`);
    }
})

router.post('/delete/:id', async function (req, res, next) {

})

module.exports = router;
