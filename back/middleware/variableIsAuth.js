module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;
    // res.locals.csrf = req.csrfToken();
    // res.locals.csrfProtection = csrf({ cookie: true });

    // После этого мы во всех запросах POST добавляем данный input
    // <input type="hidden" name="_csrf" value="{{csrf}}"/>
    next();
};
