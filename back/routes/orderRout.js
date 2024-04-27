const { Router } = require('express');
const Order = require('../models/orderModel');
// const auth = require('../middleware/authMiddleware');

const router = Router();

// Запрос данных в order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.find({
            administratorId: req.params.id,
        })
            .populate({
                path: 'courseId',
                select: 'title',
                options: { strictPopulate: false },
            })
            .populate({
                path: 'administratorId',
                select: 'name',
                options: { strictPopulate: false },
            })
            .populate({
                path: 'customerId',
                select: 'name',
                options: { strictPopulate: false },
            })
            .select('date');
        let isOrder = false;
        if (typeof order != 'undefined') {
            isOrder = true;
        }
        res.render('orders', {
            title: 'Orders',
            layout: 'empty',
            isOrder,
            order,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
