const express = require('express');

const router = express.Router();

const adminControllers = require('../controllers/admin');

router.get("/home", adminControllers.getHome);

router.post("/home/:likeId", adminControllers.postLike);

router.post("/home/removeFav/:unlikeId", adminControllers.postUnlike);

router.get("/chat", adminControllers.getChat);

router.post("/chat", adminControllers.postChat);

router.get("/chat/:chatRoomId", adminControllers.getChatUser);

router.get("/favorites", adminControllers.getFavorites);

router.get("/profile", adminControllers.getProfile);

router.get("/profile/change-password", adminControllers.getChangePassword);

router.get("/profile/edit", adminControllers.editProfile);

router.post("/profile/edit", adminControllers.postEditProfile);

router.post("/job/:enginearId", adminControllers.postJob);

router.post("/review/:jobId", adminControllers.postReview);

router.post("/feedback/:jobId", adminControllers.postFeedback);

module.exports = router;