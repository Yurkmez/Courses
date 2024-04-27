const { Router } = require('express');
const { validationResult } = require('express-validator');
const CourseModel = require('../models/courseModel');
const authMiddleware = require('../middleware/authMiddleware');
const { courseValidators } = require('../utils/validators');
// authMiddleware - Защита роутов от доступа к скрытым п.меню через ввод пути в браузере
// courseValidators - валидация ввода данных: название курса не менее 3-х символов, верный url изображения, цена - численное значение

const router = Router();

// Запрос/переход к форме ввода данных по новому курсу
router.get('/', authMiddleware, (req, res) => {
    res.render('course_add', {
        title: 'Add courses',
        layout: 'empty',
        isAdd: true,
    });
});
// Добавление/сохранение нового курса
router.post('/', authMiddleware, courseValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('course_add', {
            title: 'Add course',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                annotation: req.body.annotation,
                description: req.body.description,
            },
        });
    }
    const course = new CourseModel({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        annotation: req.body.annotation,
        description: req.body.description,
        administratorId: req.administrator,
    });
    try {
        await course.save();
        res.redirect('/courses');
    } catch (error) {
        console.log(error);
    }
});
// Запрос/переход к форме ввода данных по новой лекции (course.id)
router.get('/lecture_add/:id', async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        res.render('lecture_add', {
            title: `Add lecture to ${course.title}`,
            layout: 'empty',
            course,
        });
    } catch (error) {
        console.log(error);
    }
});
// Сохранение новой лекции (id - курса)
router.post('/lecture_add/:id', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    try {
        const courseCandidate = await CourseModel.findById(req.params.id);
        if (courseCandidate) {
            courseCandidate.lecture.items.push({
                title: req.body.title,
                img: req.body.img,
            });
            // const items = [...courseCandidate.lecture.items];
            // items.push({
            //     title: req.body.title,
            //     img: req.body.img,
            // });
            courseCandidate.save();
            res.redirect(`/courses/${req.params.id}`);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
