const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    administratorId: {
        type: Schema.Types.ObjectId,
        ref: 'Administrator',
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Order', orderSchema);
