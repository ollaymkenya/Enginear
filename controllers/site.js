exports.getIndex = (req, res, next) => {
    res.render('site/index', {
        title: 'Mechanical',
        path: '/'
    });
}

exports.getAbout = (req, res, next) => {
    res.render('site/about', {
        title: 'About Us',
        path: '/about'
    });
}