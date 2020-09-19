exports.getIndex = (req, res, next) => {
    res.render('site/index', {
        title: 'Mechanical',
        path: '/'
    })
}