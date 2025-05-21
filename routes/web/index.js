const express = require('express');
const router = express.Router();
const Database = require('../../services/DatabaseService');


/* GET home page. */
router.get('/', async function (req, res, next) {
    const robots = await Database.getRobotDetails();
    const locations = await Database.getLocations();
    const users = await Database.getUsers();
    const roles = await Database.getRoles();

    res.render('index', {
        title: "Control panel", robots: robots, locations: locations,
        staff: req.isStaff || req.isAdmin,
        admin: req.isAdmin,
        robot_error: req.query.robot_error,
        location_error: req.query.location_error,
        user_error: req.query.user_error,
        users: users,
        roles: roles,
    });
});

module.exports = router;
