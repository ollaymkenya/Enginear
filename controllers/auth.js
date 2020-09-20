exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        title: 'Login SignUp',
        path: '/login'
    });
}

exports.postSignUp = (req, res, next) => {
    res.redirect('/configure');
}

exports.configure = (req, res, next) => {
    res.render('auth/configure', {
        title: 'Configure',
        path: '/configure'
    });
}