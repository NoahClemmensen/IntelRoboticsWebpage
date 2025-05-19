const express = require('express');
const router = express.Router();
const Database = require('../../services/DatabaseService');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const robots = await Database.getRobotDetails();
  const locations = await Database.getLocations();
  res.render('index', {title: "Control panel", robots: robots, locations: locations });
});

module.exports = router;
