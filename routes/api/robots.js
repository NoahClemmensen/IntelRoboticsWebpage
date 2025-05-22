const express = require('express');
const router = express.Router();
const DatabaseService = require('../../services/DatabaseService');
const MqttService = require('../../services/MQTTService');

MqttService.subscribeToTopic("robot/status_updated", async (message) => {
    const {serial_number, status, reason} = message;
    const robot = await DatabaseService.getRobotDetailsBySerial(serial_number);
    if (robot) {
        try {
            await DatabaseService.updateRobotStatus(robot.robot_id, status);
            await DatabaseService.logAction(status, serial_number, reason);
        } catch (e) {
            console.error('Error updating robot status:', e);
            throw new Error('Failed to update robot status');
        }
        console.log(`Robot ${serial_number} status updated to ${status}`);
    } else {
        console.error(`Robot with serial number ${serial_number} not found`);
    }
});

MqttService.subscribeToTopic("robot/register_response", async (message) => {
    const serial_number = message.serial_number;
    const robot = await DatabaseService.getRobotDetailsBySerial(serial_number);
    if (robot) {
        try {
            MqttService.publishToTopic("system/update_info", JSON.stringify({
                serial_number: robot.serial_number,
                status: robot.status_id,
                location: robot.location
            }));
            console.log(`Robot ${serial_number} registered and updated`);
        } catch (e) {
            console.error('Error updating robot:', e);
            throw new Error('Failed to update robot');
        }
    } else {
        console.error(`Robot with serial number ${serial_number} not found`);
    }
});

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
        MqttService.publishToTopic("system/update_info", JSON.stringify({
            serial_number: dbRobot.serial_number,
            new_serial_number: serial_number,
            status: status_id,
            location: location_id
        }));
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
        MqttService.publishToTopic("system/register", JSON.stringify({
            serial_number: serial_number
        }));

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
