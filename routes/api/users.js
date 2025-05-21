const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/DatabaseService');
const bcrypt = require('bcrypt');

router.post('/update/:id', async function (req, res, next) {
    let {username, password, location_id, role_id} = req.body;
    let dbUser = await DatabaseService.getUserDetailsById(req.params.id);
    dbUser = dbUser[0];

    if (!username) {
        username = dbUser.username;
    }
    if (!location_id) {
        location_id = dbUser.location_id;
    }
    if (!role_id) {
        role_id = dbUser.role_id;
    }
    if (!password) {
        password = dbUser.password;
    } else {
        password = bcrypt.hashSync(password, 10);
    }

    try {
        await DatabaseService.updateUser(req.params.id, username, password, role_id, location_id);
        return res.status(200).redirect(`/user/${username}`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/user/${dbUser.username}?error=${error.message}`);
    }
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
    const {id} = req.params;

    if (!id) {
        return res.status(400).redirect(`/home?user_error=User ID is required`);
    }

    console.log(id)
    try {
        await DatabaseService.deleteUser(id);
        return res.status(200).redirect(`/home`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/home?user_error=${error.message}`);
    }
})

module.exports = router;
