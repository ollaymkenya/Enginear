const dbAccess = require('./utils/db');

const path = require("path");

const express = require("express");
var bodyParser = require('body-parser')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

const siteRoutes = require('./routes/site.js');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');

//setting up where the views will be.
app.set("views", "./views");

//setting up the view engine.
app.set('view engine', 'ejs');

//getting static files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const sessionConfig = {
    store: new pgSession({
        pool: dbAccess,
        tableName: 'session'
    }),
    name: 'session',
    secret: 'myfunny_secret-made/mere@llylaugh',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: true,
        secure: false // ENABLE ONLY ON HTTPS
    }
}

app.use(session(sessionConfig));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    dbAccess
        .query("SELECT * FROM uzer WHERE user_uid = $1", [req.session.user.rows[0].user_uid])
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
})

app.use(siteRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})