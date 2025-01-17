const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
        res.redirect('/dev/member/index')
    } else {
        req.isAuthenticated = true;
    }
    next();
};

module.exports = {checkAuth};