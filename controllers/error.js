const express = require('express');
const router = express.Router();

router.use(get404 = (req, res, next) => {
    res.status(404).render('errors/404.ejs');
})

router.get('/500', (req, res, next) => {
    res.status(500).render('errors/500.ejs');
})

module.exports = router