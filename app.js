const express = require("express");

const app = express();

const siteRoutes = require('./routes/site.js');

//setting up where the views will be.
app.set("views", "./views");

//setting up the view engine.
app.set('view engine', 'ejs');

app.use(siteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})