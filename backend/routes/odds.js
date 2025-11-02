const express = require('express');
const router = express.Router();
const oddsController = require('../controllers/oddsController');

router.get('/', oddsController.getOdds);

module.exports = router;
