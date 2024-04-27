module.exports = function (req, res, next) {
    res.locals.adminName = req.session.administrator;
    next();
};
