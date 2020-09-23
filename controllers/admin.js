exports.getHome = (req, res, next) => {
    res.render('admin/home', {
        title: 'Home',
        path: '/home'
    });
}

exports.getChat = (req, res, next) => {
    res.render('admin/chat', {
        title: 'Chat',
        path: '/chat'
    });
}

exports.getChatUser = (req, res, next) => {
    res.render('admin/chatUser', {
        title: 'Chat',
        path: '/chat'
    });
}

exports.getFavorites = (req, res, next) => {
    res.render('admin/favorite', {
        title: 'Favorites',
        path: '/favorite'
    });
}

exports.getProfile = (req, res, next) => {
    res.render('admin/profile', {
        title: 'Profile',
        path: '/profile'
    });
}

exports.getChangePassword = (req, res, next) => {
    res.render('admin/changePassword', {
        title: 'change password',
        path: 'admin/changePassword'
    });
}

exports.editProfile = (req, res, next) => {
    res.render('admin/editProfile', {
        title: 'change password',
        path: 'admin/editProfile'
    });
}