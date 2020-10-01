const express = require('express');
const { body, check } = require('express-validator');

const router = express.Router();

const authControllers = require('../controllers/auth');
const User = require("../models/User");
const Auth = require('../middlewares/auth');

router.get("/login", Auth.alredayAuth, authControllers.getLogin);

router.post("/login", [
    check('email')
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),
    body('password', 'Your password should not be less than 3 characters')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authControllers.postLogin);

router.post("/signup", Auth.alredayAuth, [
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
    body('firstName', 'Your name should not be less than 3 characters')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('lastName', 'Your name should not be less than 3 characters')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('telephone', 'Your telephone number should not be less than 10 characters')
        .isLength({ min: 10 })
        .isAlphanumeric()
        .trim(),
    body('password', 'Your password should not be less than 3 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authControllers.postSignUp);

router.get("/configure/:userId", Auth.alredayAuth, authControllers.configure);

router.post("/configure", Auth.alredayAuth, authControllers.postConfigure);

router.post("/logout", Auth.isAuth, authControllers.postLogout);


module.exports = router;