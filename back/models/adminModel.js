const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    email: {
        type: String,
        requared: true,
    },
    name: String,
    password: {
        type: String,
        requared: true,
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
});

//  Add course
adminSchema.methods.addCourse = function (course) {
    // Деструктурируем из схемы данные coursesAdmin.items
    const items = [...this.coursesAdmin.items];
    items.push({
        courseId: course._id,
        count: 1,
    });
    // Сохраняем в БД
    this.coursesAdmin = { items: items };
    return this.save(); //  Смысловой вариант const newCart = {items: items} this.cart = newCart
};
// Delete cart
adminSchema.methods.deleteCourses = function (id) {
    let items = [...this.coursesAdmin.items];
    const idx = items.findIndex((c) => c.courseId.toString() === id.toString());
    items = items.filter((c) => c.courseId.toString() !== id.toString());
    // Сохраняем в БД
    this.coursesAdmin = { items };
    return this.save();
};
// Clear all courses
adminSchema.methods.clearCourses = function () {
    this.coursesAdmin = { items: [] };
    return this.save();
};

module.exports = model('Administrator', adminSchema);
