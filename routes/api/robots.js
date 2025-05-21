const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/DatabaseService');

router.get('/', (req, res) => {
    res.status(200).json({message: 'Robot API is working'});
})

router.post('/update/:id', async function (req, res, next) {
    const {id} = req.params;
    const dbRobot = await DatabaseService.getRobotDetailsById(id);
    let {serial_number, status_id, location_id} = req.body;

    if (!serial_number) {
        serial_number = dbRobot.serial_number;
    }

    const permitted = req.isStaff || req.isAdmin;
    if (!status_id || !permitted) {
        status_id = dbRobot.status_id;
    }
    if (!location_id || !permitted) {
        location_id = dbRobot.location;
    }

    try {
        await DatabaseService.updateRobot(id, serial_number, status_id, location_id);
        return res.status(200).redirect(`/robot/${serial_number}`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/robot/${dbRobot.serial_number}?error=${error.message}`);
    }
});

router.post('/create', async function (req, res, next) {
    const {serial_number, location_id} = req.body;
    console.log(req.body);

    if (!serial_number || !location_id) {
        return res.status(400).redirect(`/home?robot_error=Serial number and location ID are required`);
    }

    try {
        await DatabaseService.createRobot(serial_number, location_id);
        return res.status(200).redirect(`/robot/${serial_number}`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/home?robot_error=${error.message}`);
    }
})

router.post('/delete/:id', async function (req, res, next) {
    const {id} = req.params;
    const dbRobot = await DatabaseService.getRobotDetailsById(id);

    if (!req.isStaff && !req.isAdmin) {
        return res.status(403).redirect(`/robot/${dbRobot.serial_number}?error=You do not have permission to delete this robot`);
    }

    try {
        await DatabaseService.deleteRobot(id);
        return res.status(200).redirect(`/home`);
    } catch (error) {
        console.error(error);
        return res.status(500).redirect(`/robot/${dbRobot.serial_number}?error=${error.message}`);
    }
})

module.exports = router;
