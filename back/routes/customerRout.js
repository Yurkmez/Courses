const { Router } = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Console } = require('console');
const { validationResult } = require('express-validator');
const Customer = require('../models/customerModel');
const Basket = require('../models/basketModel');
const Order = require('../models/orderModel.js');
const Course = require('../models/courseModel');

// Почта, восстановление пароля...
// const regEmail = require('../email/registration');
// const resetEmail = require('../email/reset');
// const nodemailer = require('nodemailer');
// const keys = require('../keys');

const router = Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    const { newEmail, newPassword, newName } = req.body;
    const candidate = await Customer.findOne({ email: newEmail });
    if (candidate) {
        res.send('This email has already been registered, please login.');
    } else {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        const newCustomer = new Customer({
            email: newEmail,
            name: newName,
            password: hashPassword,
            courseCustomer: { items: [] },
        });
        try {
            await newCustomer.save();
            res.send('You have successfully registered!');
        } catch (err) {
            res.send('Something went wrong... Please, try again');
        }
    }
});
// await transporter.sendMail(regEmail(email));

// Авторизация зарегистрированного пользователя
router.post('/login', async (req, res) => {
    try {
        const { newEmail, newPassword } = req.body;
        const candidate = await Customer.findOne({ email: newEmail });
        if (candidate) {
            const areSame =
                candidate &&
                (await bcrypt.compare(newPassword, candidate.password));
            if (areSame) {
                res.send('Login successful!');
            } else {
                res.send('Wrong password!');
            }
        } else {
            res.send('This email was not found!');
        }
    } catch (error) {
        console.log(error);
    }
});

// Запрос на получение id и name конкретного покупателя после авторизации (поиск по email)
router.get('/:email', async (req, res) => {
    try {
        const customer = await Customer.findOne(
            {
                email: req.params.email,
            },
            { _id: 1, name: 1 }
        );
        res.send(customer);
    } catch (error) {
        console.log(error);
    }
});
// Запрос всех курсов
router.get('/courses/all', async (req, res) => {
    try {
        const coursesResponse = await Course.find()
            .populate({
                path: 'administratorId',
                select: 'name email _id',
                options: { strictPopulate: false },
            })
            .select('title price img annotation description');
        res.send(coursesResponse);
    } catch (error) {
        console.log(error);
    }
});

// Запрос на просмотр конкретного курса по id
router.get('/course/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.send(course);
    } catch (error) {
        console.log(error);
    }
});

// Внесение курса в BASKET покупателя
router.post('/basket', async (req, res) => {
    const { idCourse, idCustomer, administratorId } = req.body;
    console.log(idCourse);
    console.log(idCustomer);
    try {
        const isCourseInBasket = await Basket.countDocuments({
            courseId: idCourse,
            customerId: idCustomer,
        });
        const isCourseInOrder = await Order.countDocuments({
            courseId: idCourse,
            customerId: idCustomer,
        });

        if (isCourseInBasket === 0 && isCourseInOrder === 0) {
            console.log('No this course in Basket and in Order');
            const addCourseInBasket = new Basket({
                courseId: idCourse,
                customerId: idCustomer,
                administratorId: administratorId,
            });
            await addCourseInBasket.save();
            res.send('Course added to basket!');
        } else {
            res.send('This course is already exists in your basket/order!');
        }
    } catch (error) {
        console.log(error);
    }
});

// Запрос BASKET конкретного пользователя по его id
router.get('/basket/:id', async (req, res) => {
    try {
        const basket = await Basket.find({
            customerId: req.params.id,
        })
            .populate({
                path: 'courseId',
                select: {
                    title: 1,
                    price: 1,
                    img: 1,
                    annotation: 1,
                },
                populate: {
                    path: 'administratorId',
                    select: { name: 1 },
                },
            })
            .then((basket) => {
                res.json(basket);
            });
        // res.json(basket);
    } catch (error) {
        console.log(error);
    }
});

// Удаление курса из BASKET
router.post('/remove/:id', async (req, res) => {
    try {
        await Basket.deleteOne({
            _id: req.params.id,
        });
        res.send('Course remove from basket');
    } catch (error) {
        console.log(error);
    }
});

// Покупка курса - внесение в ORDER
router.post('/order/:id', async (req, res) => {
    const { idCourse, idCustomer } = req.body;
    try {
        const isCourseInOrder = await Order.countDocuments({
            courseId: idCourse,
            customerId: idCustomer,
        });
        if (isCourseInOrder === 0) {
            const courseInBasket = await Basket.findById(req.params.id);
            const courseInOrder = new Order({
                courseId: courseInBasket.courseId,
                customerId: courseInBasket.customerId,
                administratorId: courseInBasket.administratorId,
            });
            await courseInOrder.save();
        }
        // удаление курса из корзины
        await Basket.deleteOne({
            _id: req.params.id,
        });
        res.send('Course added to order!');
    } catch (error) {
        console.log(error);
    }
});

// Запрос ORDER конкретного пользователя по его id
router.get('/order/:id', async (req, res) => {
    try {
        const orderList = await Order.find({
            customerId: req.params.id,
        })
            .populate({
                path: 'courseId',
                select: {
                    title: 1,
                    price: 1,
                    img: 1,
                    annotation: 1,
                },
                populate: {
                    path: 'administratorId',
                    select: { name: 1 },
                },
            })
            .then((orderList) => {
                res.json(orderList);
            });
    } catch (error) {
        console.log(error);
    }
});
// ___________________________________
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
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'Password recovery time has expired ');
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
