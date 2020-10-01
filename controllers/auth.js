const { validationResult } = require("express-validator");

const User = require("../models/User");
const CarType = require("../models/CarType");
const CarBrand = require("../models/CarBrand");
const UserTypes = require("../models/UserTypes");
const UserBrands = require("../models/UserBrands");

const emoji = require('node-emoji');

const pool = require("../utils/db");
const bcrpyt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.getLogin = async (req, res, next) => {
    const addresses = await pool.query("SELECT * FROM address");
    const accounts = await pool.query("SELECT * FROM account");
    res.render("auth/login", {
        title: "Login SignUp",
        path: "/login",
        addresses: addresses.rows,
        accounts: accounts.rows,
        oldinput: {
            email: '',
            password: '',
            telephone: '',
            first_name: '',
            last_name: '',
            account: '',
            location: '',
        },
        errorMessage: ''
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.getUserWithEmail(email);
    const errors = validationResult(req);
    const addresses = await pool.query("SELECT * FROM address");
    const accounts = await pool.query("SELECT * FROM account");
    if (!errors.isEmpty()) {
        return res
            .render("auth/login", {
                title: "Login SignUp",
                path: "/login",
                addresses: addresses.rows,
                accounts: accounts.rows,
                oldinput: {
                    email: email,
                    password: password,
                    telephone: '',
                },
                errorMessage: errors.array()[0].msg
            });
    }
    if (!user) {
        return res.redirect('/login');
    }
    const authenticate = await bcrpyt.compare(password, user.rows[0].password);
    if (authenticate) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return res.redirect("/home");
    }
};

exports.postSignUp = async (req, res, next) => {
    const account = req.body.account;
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;
    const telephone = req.body.telephone;
    const location = req.body.location;
    const password = await bcrpyt.hash(req.body.password, 12);
    const addresses = await pool.query("SELECT * FROM address");
    const accounts = await pool.query("SELECT * FROM account");
    const errors = validationResult(req);
    if (!req.body.account) {
        return res
            .render("auth/login", {
                title: "Login SignUp",
                path: "/login",
                addresses: addresses.rows,
                accounts: accounts.rows,
                oldinput: {
                    email: email,
                    password: password,
                    telephone: telephone,
                    first_name: first_name,
                    last_name: last_name
                },
                errorMessage: 'Choose whether you are a client or an enginear'
            });
    }

    if (!errors.isEmpty()) {
        return res
            .render("auth/login", {
                title: "Login SignUp",
                path: "/login",
                addresses: addresses.rows,
                accounts: accounts.rows,
                oldinput: {
                    email: email,
                    password: password,
                    telephone: telephone,
                    first_name: first_name,
                    last_name: last_name,
                    validationErrors: errors.array()
                },
                errorMessage: errors.array()[0].msg
            });
    }
    try {
        console.log(req.body);
        const user = new User(first_name, last_name, email, telephone, account, location, password);
        const newUser = await user.save();
        req.session.isLoggedIn = true;
        req.session.user = await User.getUser(newUser.rows[0].user_uid);
        res.redirect(`/configure/${newUser.rows[0].user_uid}`);
    }
    catch (err) {
        console.log(err);
    }
};

exports.configure = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.getUser(userId);
        const carTypes = await CarType.getCarTypes();
        const carBrands = await CarBrand.getCarBrands();
        res.render("auth/configure", {
            title: "Configure",
            path: "/configure",
            user: user.rows[0],
            carTypes: carTypes,
            carBrands: carBrands,
            emoji: emoji,
            errorMessage: ''
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.postConfigure = async (req, res, next) => {
    const user = req.user.rows[0];
    const carTypes = await CarType.getCarTypes();
    const carBrands = await CarBrand.getCarBrands();
    if (Object.keys(req.body).length === 0) {
        return res.render("auth/configure", {
            title: "Configure",
            path: "/configure",
            user: user,
            carTypes: carTypes,
            carBrands: carBrands,
            emoji: emoji,
            errorMessage: 'Please choose a car type and a car brand'
        });
    }
    console.log(req.body);
    const brandTypes = Object.entries(req.body);
    for (let i = 0; i < brandTypes.length; i++) {
        if (brandTypes[i][0] === "car" || brandTypes[i][0] === "minibus" || brandTypes[i][0] === "truck") {
            const userType = new UserTypes(user.user_uid, brandTypes[i][1]);
            userType.save();
        } else {
            const userBrand = new UserBrands(user.user_uid, brandTypes[i][1]);
            userBrand.save();
        }
    }
    res.redirect("/home");
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect("/login");
        }
        return res.redirect("/login");
    });
};