const express = require('express');

const router = express.Router();

const siteControllers = require('../controllers/site');

router.get("/", siteControllers.getIndex);

router.get("/about", siteControllers.getAbout);

router.get("/login", siteControllers.getLogin);

module.exports = router;