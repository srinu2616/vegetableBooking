const express = require('express');
const router = express.Router();
const { addOrderItems, verifyPayment, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, getDashboardStats, cancelOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/verify-payment').post(protect, verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
