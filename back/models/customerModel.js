const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
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

//  *********** Add course **************
customerSchema.methods.addToCart = function (course) {
    // Деструктурируем из схемы данные cart.items
    const items = [...this.courseCustomer.items];
    const idx = items.findIndex((c) => {
        return c.courseId.toString() === course._id.toString();
    });
    // Если курс уже есть, увеличиваем количество
    if (idx >= 0) {
        items[idx].count += 1;
    } else {
        // нет, курс добавляем
        items.push({
            courseId: course._id,
            count: 1,
        });
    }
    // Сохраняем в БД
    this.courseCustomer = { items: items };
    return this.save(); //  Смысловой вариант const newCart = {items: items}  this.cart = newCart
};
// ************** Delete cart ************************
customerSchema.methods.removeFromCart = function (id) {
    let items = [...this.courseCustomer.items];
    const idx = items.findIndex((c) => c.courseId.toString() === id.toString());
    if (items[idx].count === 1) {
        items = items.filter((c) => c.courseId.toString() !== id.toString());
    } else {
        items[idx].count--;
        // Сохранение отфильтрованного списка курсов в БД
        this.courseCustomer = { items };
        return this.save();
    }
};

customerSchema.methods.clearCart = function () {
    this.courseCustomer = { items: [] };
    return this.save();
};
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
