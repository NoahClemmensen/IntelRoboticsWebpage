const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/databaseService');

router.get('/:sn', async function (req, res, next) {
    let robotData = await DatabaseService.getRobotDetailsBySerial(req.params.sn);
    robotData = robotData[0];

    const statuses = await DatabaseService.getStatuses();
    const locations = await DatabaseService.getLocations();

    const error = req.query.error;

    res.render('robot', {
        title: 'Robot: ' + robotData.serial_number,
        robot: robotData,
        locations: locations,
        statuses: statuses,
        staff: req.isStaff || req.isAdmin,
        error: error,
    });
});

module.exports = router;
