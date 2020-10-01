exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

exports.alredayAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/profile');
    }
    next();
}

exports.onlyEnginears = (req, res, next) => {
    if (req.user.rows[0].account_uid !== "4dbc4cb7-7ee6-4d04-a1ba-364ea6a5c949") {
        return res.redirect('/profile');
    }
    next();
}

exports.onlyClients = (req, res, next) => {
    console.log(req.user.rows[0].account_uid);
    if (req.user.rows[0].account_uid !== "fbb3f0eb-a8a3-4ecc-8e44-5a92d15e7b7e") {
        return res.redirect('/profile');
    }
    next();
}