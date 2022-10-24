const express = require('express');

const router = express.Router()

const { newOrder, getSingleOrder, myOrders} = require('../controllers/orderController')

const { AuthMiddleware, AuthorizeRoles} = require('../middleware/AuthMiddleware')


router.post('/order/new', AuthMiddleware, newOrder)

router.get('/order/:id', AuthMiddleware, getSingleOrder)

router.get('/orders/me', AuthMiddleware, myOrders)
