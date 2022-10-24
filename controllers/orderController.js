const Order = require('../models/Order');
const Product = require('../models/Product');

const ErrorHandler = require('../Util/errorHandler');

// 1. Create A New Order       -    /api/v1/order/new
// 2. Get Single Order         -    /api/v1/order/:id
// 3. Get logged in User order -    /api/v1/order/me 


// Admin
// 1. Get all Orders                -   /api/v1/admin/orders
// 2. Update / process user Order   -   /api/v1/admin/order/:id
// 3. Delete Order                  -   /api/v1/admin/order/:id



// 1. Create A New Order       -    /api/v1/order/new
const newOrder = async (req, res, next) => {
    try {

        const {
            orderItems,
            shippingInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
        } = req.body

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user._id
        })

    } catch (err) {

        res.status(200).send({
            success: true,
            data: order
        })

    }

}

// 2. Get Single Order         -    /api/v1/order/:id
const getSingleOrder = async (req, res, next) => {

    try {

        const order = await Order.findById(req.params.id).populate('user', 'name email')

        if (!order) {
            return next(new ErrorHandler('No order found with this ID', 404))
        }

        res.status(200).send({
            success: true,
            data: order
        })

    } catch (err) {

        res.status(404).send({
            success: false,
            message: 'Order not found'
        })
    }
}

// 3. Get logged in User order -    /api/v1/order/me 
const myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })

        res.status(200).send({
            success: true,
            data: orders
        })

    } catch (err) {

        res.status(404).send({
            success: false,
            message: 'No orders found'
        })
    }
}


module.exports = {
    newOrder,
    getSingleOrder,
    myOrders

}