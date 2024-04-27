const { Router } = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Console } = require('console');

const { validationResult } = require('express-validator');
const { registerValidators } = require('../utils/validatorsAdmin');

const Administrator = require('../models/adminModel');

const regEmail = require('../email/registration');
const resetEmail = require('../email/reset');
// const nodemailer = require('nodemailer');
// const keys = require('../keys');

const router = Router();

// Почта
// const transporter = nodemailer.createTransport({
//     port: 465,
//     host: 'smtp.gmail.com',
//     auth: {
//         user: keys.EMAIL_FROM,
//         pass: keys.API_GMAIL, // generated from the App Passwords
//     },
//     secure: true,
// });

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await Administrator.findOne({ email }).exec();
        const areSame =
            candidate && (await bcrypt.compare(password, candidate.password));
        if (areSame) {
            req.session.administrator = candidate;
            req.session.administrator.name = candidate.name;
            req.session.isAuthenticated = true;
            req.session.save((err) => {
                if (err) {
                    throw err;
                }

                return res.redirect('/courses');
            });
        } else {
            req.flash('loginPassError', 'Wrong login or password!');
            return res.redirect('/authadmin/login');
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/login', async (req, res) => {
    res.render('auth/loginAdmin', {
        title: 'Authorization',
        isLogin: true,
        // loginError: req.flash('loginPassError'),
        // registerError: req.flash('registerError'),
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        return res.redirect('/');
    });
});

router.get('/register', async (req, res) => {
    res.render('auth/registerAdmin', {
        title: 'registration',
        isRegistration: true,
        loginError: req.flash('loginPassError'),
        registerError: req.flash('registerError'),
    });
});
router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // const candidate = await User.findOne({ email });
        // Валидация email
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/authadmin/register');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Administrator({
            email: email,
            name: name,
            password: hashPassword,
        });
        await newAdmin.save();
        // await transporter.sendMail(regEmail(email));
        res.redirect('/authadmin/login');
    } catch (error) {
        console.log(error);
    }
});
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Foggot password?',
        error: req.flash('error'),
    });
});
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something go wrong, try again later');
                return res.redirect('auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({
                email: req.body.email,
            });
            if (candidate) {
                // Если такой пользователь (email) есть,
                //  то мы должны передать ему 2 поля:
                // токен, т.е. некий шифр,
                // время его жизни (1 час, в данном примере)

                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'There is no such email');
                res.redirect('/auth/reset');
            }
        });
    } catch (error) {
        console.log(error);
    }
});
router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            return res.render('auth/password', {
                title: 'Restore access',
                error: req.flash('error'),
                userID: user._id.toString(),
                token: req.params.token,
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userID,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() },
        });
        console.log(user);
        if (user) {
            console.log('User inner IF');
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            console.log('User inner else');
            req.flash('loginError', 'Password recovery time has expired ');
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
