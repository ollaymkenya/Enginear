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
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.getUserWithEmail(email);
    console.log(user);
    if(!user){
        return res.redirect('/login');
    }
    const authenticate = await bcrpyt.compare(password, user.rows[0].password);
    if(authenticate){
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
    try {
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
            emoji: emoji
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.postConfigure = async (req, res, next) => {
    const user = req.user.rows[0];
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
