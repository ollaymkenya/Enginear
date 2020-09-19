exports.getIndex = (req, res, next) => {
    res.render('index', {
        title: 'Mechanical',
        path: '/'
    })
}