const { Router } = require('express');
const { validationResult } = require('express-validator');
const { courseValidators } = require('../utils/validators');
const CourseModel = require('../models/courseModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

function isOwner(course, req) {
    return (
        course.administratorId.toString() === req.administrator._id.toString()
    );
}

// GET запрос на курсы
router.get('/', async (req, res) => {
    try {
        const courses = await CourseModel.find()
            .populate({
                path: 'administratorId',
                select: 'name email _id',
                options: { strictPopulate: false },
            })
            .select(
                'title price img annotation description lecture.items.img lecture.items.title'
            );
        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            administratorId: req.administrator
                ? req.administrator._id.toString()
                : null,
            courses,
        });
    } catch (error) {
        console.log(error);
    }
});
// Open course (из courses.hbs)
router.get('/:id', async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        // .populate({
        //     path: 'administratorId',
        //     select: 'name email _id',
        //     options: { strictPopulate: false },
        // })
        // .select('title price img annotation description lecture');
        res.render('course', {
            layout: 'empty',
            title: `Course "${course.title}"`,
            course,
        });
    } catch (error) {
        console.log(error);
    }
});
// Edit  course (из course.hbs)
router.get('/edit/:id', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    try {
        const course = await CourseModel.findById(req.params.id);
        // Защита от возможности не авторизованного пользователя зайти на астраницу
        // редактирования курса через браузер
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        // console.log(course);
        res.render('course-edit', {
            layout: 'empty',
            title: `Edit ${course.title}`,
            course,
        });
    } catch (error) {
        console.log(error);
    }
});
//  Save course after edit (из course-edit.hbs)
router.post('/edit', authMiddleware, courseValidators, async (req, res) => {
    const errors = validationResult(req);
    const { id } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit&allow=true`);
    }
    try {
        delete req.body.id;
        const course = await CourseModel.findById(id);
        // console.log(course);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        // Меняем значение у объекта
        Object.assign(course, req.body);
        // console.log(course);
        await course.save();
        res.redirect(`/courses/${id}`);
    } catch (error) {
        console.log(error);
    }
});
// Delete course (из courses.hbs)
router.post('/:id/remove', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    // console.log(req.params.id);
    // console.log(req.administrator._id.toString());
    try {
        await CourseModel.deleteOne({
            _id: req.params.id,
            administratorId: req.administrator._id.toString(),
        });
        res.redirect('/courses');
    } catch (error) {
        console.log(error);
    }
});

// Edit  lecture (из course.hbs)
router.get('/editLectures/:id', authMiddleware, async (req, res) => {
    try {
        // Получение лекций курса (id передается по умолчанию)
        const course = await CourseModel.findOne(
            {
                'lecture.items._id': req.params.id,
            },
            { lecture: 1 }
        );
        // Получениии данных по самой лекции
        let courseId = course._id.toString();
        let lectureTitle = '';
        let lectureImg = '';
        let lectureId = '';
        for (let i = 0; i < course.lecture.items.length; i++) {
            if (course.lecture.items[i]._id.toString() === req.params.id) {
                lectureTitle = course.lecture.items[i].title;
                lectureImg = course.lecture.items[i].img;
                lectureId = course.lecture.items[i]._id.toString();
            }
        }
        res.render('lecture-edit', {
            title: `Edit ${course.title}`,
            layout: 'empty',
            courseId,
            lectureTitle,
            lectureImg,
            lectureId,
        });
    } catch (error) {
        console.log(error);
    }
});
//  Save lecture after edit (из lecture-edit.hbs)
router.post('/editLectures/:id', async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        // console.log(req.query.idLecture);
        // console.log(course.lecture.items[0]._id.toString());
        for (let i = 0; i < course.lecture.items.length; i++) {
            if (
                course.lecture.items[i]._id.toString() === req.query.idLecture
            ) {
                course.lecture.items[i].title = req.body.title;
                course.lecture.items[i].img = req.body.img;
            }
        }
        await course.save();
        res.redirect(`/courses/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
});

// Delete lection id -  lections! (из course.hbs)
router.post('/deleteLection/:id', authMiddleware, async (req, res) => {
    try {
        const course = await CourseModel.findOne({
            'lecture.items._id': req.params.id,
        });
        if (course) {
            course.lecture.items.forEach((item, index) => {
                if (item._id.toString() === req.params.id) {
                    course.lecture.items.splice(index, 1);
                }
            });
            await course.save();
            res.redirect(`/courses/${course._id.toString()}`);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
