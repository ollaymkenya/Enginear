const express = require('express');

const router = express.Router();

const authControllers = require('../controllers/auth');

router.get("/login", authControllers.getLogin);

router.post("/signup", authControllers.postSignUp);

router.get("/configure", authControllers.configure)

module.exports = router;