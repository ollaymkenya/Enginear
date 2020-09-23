const path = require("path");

const express = require("express");

const app = express();

const siteRoutes = require('./routes/site.js');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');

//setting up where the views will be.
app.set("views", "./views");

//setting up the view engine.
app.set('view engine', 'ejs');

//getting static files
app.use(express.static(path.join(__dirname, "public")));

app.use(siteRoutes);
app.use(authRoutes);
app.use(adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})