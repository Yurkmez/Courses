module.exports = function (req, res, next) {
    res.locals.adminId = req.session.administrator;
    next();
};
