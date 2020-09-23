const express = require('express');

const router = express.Router();

const adminControllers = require('../controllers/admin');

router.get("/home", adminControllers.getHome);

router.get("/chat", adminControllers.getChat);

router.get("/chat/:userId", adminControllers.getChatUser);

router.get("/favorites", adminControllers.getFavorites);

router.get("/profile", adminControllers.getProfile);

router.get("/profile/change-password", adminControllers.getChangePassword);

router.get("/profile/edit", adminControllers.editProfile);

module.exports = router;