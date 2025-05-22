const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/DatabaseService');

router.get('/:username', async function (req, res, next) {
    let userData = await DatabaseService.getUserDetailsByUsername(req.params.username);
    userData = userData[0];
    const locations = await DatabaseService.getLocations();
    const roles = await DatabaseService.getRoles();

    const error = req.query.error;

    res.render('user', {
        title: 'User: ' + userData.username,
        user: userData,
        staff: req.isStaff || req.isAdmin,
        error: error,
        locations: locations,
        roles: roles,
    });
});

module.exports = router;
