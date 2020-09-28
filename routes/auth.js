const express = require('express');

const router = express.Router();

const authControllers = require('../controllers/auth');

router.get("/login", authControllers.getLogin);

router.post("/login", authControllers.postLogin);

router.post("/signup", authControllers.postSignUp);

router.get("/configure/:userId", authControllers.configure);

router.post("/configure", authControllers.postConfigure);


module.exports = router;