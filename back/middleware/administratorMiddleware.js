// Работа через сеесию от mongoose
const Administrator = require('../models/adminModel');

module.exports = async function (req, res, next) {
    if (!req.session.administrator) {
        return next();
    }
    req.administrator = await Administrator.findById(
        req.session.administrator._id
    );
    next();
};
