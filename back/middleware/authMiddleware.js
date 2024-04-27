// Защита роутов от доступа к скрытым п.меню через ввод пути в браузере
module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('auth/login');
    }
    next();
};
