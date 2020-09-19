const express = require('express');

const router = express.Router();

const siteControllers = require('../controllers/site');

router.get("/", siteControllers.getIndex);

module.exports = router;