const { Schema, model } = require('mongoose');
const { findById } = require('./adminModel');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: String,
    annotation: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    lecture: {
        items: [
            {
                title: {
                    type: String,
                    required: true,
                },
                img: String,
            },
        ],
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    administratorId: {
        type: Schema.Types.ObjectId,
        ref: 'Administrator',
    },
});

//  Add lecture
courseSchema.methods.addLecture = function (course) {
    // const courseAddLecture = findById(course)
    // Деструктурируем из схемы данные lecture.items
    const items = [...this.lecture.items];
    items.push({
        title: course.items.title,
        img: course.items.img,
    });
    // Сохраняем в БД
    this.items = { items: items };
    return this.save(); //  Смысловой вариант const newItem = {items: items} this.cart = newItem
};

module.exports = model('Course', courseSchema);
