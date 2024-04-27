// https://express-validator.github.io/docs
// npm install express-validator
// https://github.com/validatorjs/validator.js
// Здесь "Sanitizers", для дополнительной защиты данных
const { body } = require('express-validator');
const Administrator = require('../models/adminModel');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct email!')
        .custom(async (value, { req }) => {
            try {
                // value - это req.body.email
                const newadmin = await Administrator.findOne({ email: value });
                if (newadmin) {
                    return Promise.reject('This email already exists!');
                }
            } catch (error) {
                console.log(error);
            }
        }),
    // если адрес будет вводится кривым образом, то "Sanitizers" исправит адрес,
    // но тут проблема. normalizeEmail() - удаляет точки, т.е. искажает адрес, что не приемлемо.
    // .normalizeEmail(),
    body('password', 'Password must contein at least 6 characters.')
        .isLength({ min: 6 })
        .isAlphanumeric()
        // этот удаляет лишние пробелы ("Sanitizers")
        .trim(),
    // Здесь проверка совпадения паролей
    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password did not match!');
            }
            return true;
        })
        .trim(),
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must contein at least 3 characters')
        .trim(),
];

exports.courseValidators = [
    body('title')
        .isLength({ min: 3 })
        .withMessage('Name course must contein at least 3 characters')
        .trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct url picture').isURL(),
];
