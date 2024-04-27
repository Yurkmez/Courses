const { Router } = require('express');
const Basket = require('../models/basketModel');
// const auth = require('../middleware/authMiddleware');

const router = Router();

// Запрос данных в карзине
router.get('/:id', async (req, res) => {
    try {
        const basket = await Basket.find({
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
        let isBasket = false;
        if (typeof basket != 'undefined') {
            isBasket = true;
        }
        res.render('basket', {
            title: 'Basket',
            layout: 'empty',
            isBasket,
            basket,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
