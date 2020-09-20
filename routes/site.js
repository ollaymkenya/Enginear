const express = require('express');

const router = express.Router();

const siteControllers = require('../controllers/site');

router.get("/", siteControllers.getIndex);

router.get("/about", siteControllers.getAbout);


module.exports = router;