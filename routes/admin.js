const express = require('express');
const { body, check } = require('express-validator');

const router = express.Router();

const adminControllers = require('../controllers/admin');
const Auth = require('../middlewares/auth');

const User = require("../models/User");

router.get("/home", Auth.isAuth, Auth.onlyClients, adminControllers.getHome);

router.post("/home/:likeId", Auth.isAuth, adminControllers.postLike);

router.post("/home/removeFav/:unlikeId", Auth.isAuth, adminControllers.postUnlike);

router.get("/chat", Auth.isAuth, adminControllers.getChat);

router.post("/chat", Auth.isAuth, adminControllers.postChat);

router.get("/chat/:chatRoomId", Auth.isAuth, adminControllers.getChatUser);

router.get("/favorites", Auth.isAuth, adminControllers.getFavorites);

router.get("/profile", Auth.isAuth, adminControllers.getProfile);

router.get("/profile/:userId", Auth.isAuth, Auth.onlyClients, adminControllers.getUserProfile);

router.get("/profile/change-password", Auth.isAuth, adminControllers.getChangePassword);

router.get("/myprofile/edit", Auth.isAuth, adminControllers.editProfile);

router.post("/profile/edit", Auth.isAuth, [
    check('email')
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.getUserWithEmail(value)
                .then((userDoc) => {
                    if (userDoc.rows[0]) {
                        return Promise.reject('User email exists already exists. Please pick a different one.')
                    }
                })
        }),
    body('site')
        .isString()
        .trim(),
    body('telephone', 'Your telephone number should not be less than 10 characters')
        .isLength({ min: 10 })
        .isAlphanumeric()
        .trim()
], adminControllers.postEditProfile);

router.post("/job/:enginearId", Auth.isAuth, adminControllers.postJob);

router.post("/review/:jobId", Auth.isAuth, adminControllers.postReview);

router.post("/feedback/:jobId", Auth.isAuth, adminControllers.postFeedback);

module.exports = router;