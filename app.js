const dbAccess = require('./utils/db');

const path = require("path");

const express = require("express");
var bodyParser = require('body-parser')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const multer = require("multer");
const csrf = require('csurf');

const fileStorage = multer.diskStorage({
    destination: (req, file, callb) => {
        callb(null, 'public/profile');
    },
    filename: (req, file, callb) => {
        callb(null, `${Date.parse(new Date())}-${file.originalname}`);
    }
})

const fileFilter = (req, file, callb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callb(null, true)
    }
    callb(null, false)
}

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Message = require('./models/Message');
const User = require("./models/User");

app.use(bodyParser.urlencoded({ extended: false }))
const csrfProtection = csrf();

const siteRoutes = require('./routes/site.js');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');
const errorRoutes = require('./controllers/error.js');

//setting up where the views will be.
app.set("views", "./views");

//setting up the view engine.
app.set('view engine', 'ejs');

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

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
app.use(csrfProtection);

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

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(siteRoutes);
app.use(authRoutes);
app.use(adminRoutes);

io.on('connection', (socket) => {
    socket.on('joinRoom', async (chatRoomInfo) => {
        socket.join(chatRoomInfo.chatRoom);
        const loggedUser = await User.getUser(chatRoomInfo.user);
        await User.changeOnline(loggedUser.rows[0].user_uid, true);
        const online = {online: 'online', id: loggedUser.rows[0].user_uid}
        io.to(chatRoomInfo.chatRoom).emit("onstatus", online);
        io.emit("onstatus", online);
        socket.on("userMessage", async (data) => {
            const newMessage = await new Message(data.from, data.to, data.message, data.chatRoom);
            const message = await newMessage.save();
            io.to(chatRoomInfo.chatRoom).emit("userMessage", message);
        })
        socket.on('disconnect', async () => {
            await User.changeOnline(loggedUser.rows[0].user_uid, false);
            console.log(`${loggedUser.rows[0].email} has logged out`);
            io.to(chatRoomInfo.chatRoom).emit("offstatus", 'offline');
            io.emit("offstatus", 'offline');
        });
    })
})

// catching 404 errors
app.use(errorRoutes);

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})