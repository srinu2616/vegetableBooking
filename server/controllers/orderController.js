const Order = require('../models/Order');
const Vegetable = require('../models/Vegetable');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendOrderConfirmation = require('../utils/sendOrderEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        // Check stock and update
        // Create enhanced order items with fresh data from DB
        const enhancedOrderItems = [];

        for (const item of orderItems) {
            // item.vegetable is the ID from the frontend
            const vegetable = await Vegetable.findById(item.vegetable);
            if (!vegetable) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            // Calculate deduction: (Order Qty * Pack Size)
            // If unit is 'g', convert to kg (divide by 1000)
            const packSize = vegetable.packSize || 1; // Default to 1 if missing
            const unit = vegetable.unit ? vegetable.unit.toLowerCase().trim() : 'kg';

            let deduction = item.quantity * packSize;

            if (unit === 'g') {
                deduction = deduction / 1000;
            } else if (unit === 'pieces') {
                // For pieces, deduction is just count of pieces (Assuming stock is tracked in pieces)
                // If stock is separate, logic might differ, but usually 'pieces' stock is simple count.
                deduction = item.quantity * packSize;
            }
            // For 'kg', deduction is just quantity * packSize (e.g. 2 qty * 1 kg pack = 2 kg)

            if (vegetable.stock < deduction) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${vegetable.stock} kg, Required: ${deduction} kg` });
            }
            vegetable.stock -= deduction;
            await vegetable.save();

            // Use fresh unit AND image from DB
            const freshImage = (vegetable.images && vegetable.images.length > 0)
                ? vegetable.images[0]
                : (vegetable.image || item.image);

            enhancedOrderItems.push({
                ...item,
                unit: vegetable.unit, // Enforce DB unit
                image: freshImage,     // Enforce DB image (First Image)
                packSize: vegetable.packSize || 1 // Enforce DB packSize
            });
        }

        const order = new Order({
            items: enhancedOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        // Update User Address and Phone
        if (shippingAddress) {
            const user = await User.findById(req.user._id);
            if (user) {
                user.address = {
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country
                };
                if (shippingAddress.phone) {
                    user.phone = shippingAddress.phone;
                }
                await user.save();
            }
        }

        // If payment method is Razorpay, create a Razorpay order
        if (paymentMethod === 'Razorpay') {
            const options = {
                amount: Math.round(totalPrice * 100), // amount in paise
                currency: 'INR',
                receipt: `receipt_${order._id}`
            };

            try {
                const razorpayOrder = await razorpay.orders.create(options);
                order.razorpayOrderId = razorpayOrder.id;

                const createdOrder = await order.save();
                res.status(201).json({ order: createdOrder, razorpayOrder });
            } catch (error) {
                console.error('Razorpay Error:', error);
                res.status(500).json({ message: 'Razorpay Order Creation Failed' });
            }
        } else if (paymentMethod === 'COD') {
            // For COD, just save the order
            order.isPaid = false; // Will be paid on delivery
            order.paymentResult = { status: 'Pending COD' };
            const createdOrder = await order.save();

            // Send Email (Async, don't block response)
            sendOrderConfirmation(createdOrder, req.user);

            res.status(201).json({ order: createdOrder });
        } else {
            // Default fallback
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        order_id
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Update order status
        try {
            const order = await Order.findById(order_id);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'success',
                    update_time: Date.now().toString(),
                    email_address: req.user.email
                };
                order.orderStatus = 'Processing'; // Already default, but explicit

                await order.save();

                // Send Email
                sendOrderConfirmation(order, req.user);

                res.json({ message: 'Payment success', orderId: order_id });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    } else {
        res.status(400).json({ message: 'Invalid Signature' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Check if user is admin or order belongs to user
        if (req.user.role === 'admin' || order.user._id.equals(req.user._id)) {
            res.json(order);
        } else {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'Delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // Calculate Total Revenue from uncancelled orders
        const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });

        // Summing up totalPrice for all valid orders (paid/COD delivered/processing etc)
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Vegetable.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' }); // Ensure 'user' role exists, otherwise remove filter

        res.json({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalUsers
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Cancel order and restore stock
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Check authorization: Admin or Order Owner
            if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to cancel this order' });
            }

            // Only allow cancellation if Processing
            if (order.orderStatus !== 'Processing') {
                return res.status(400).json({ message: 'Cannot cancel order that is already shipped or delivered' });
            }

            // Restore Stock
            for (const item of order.items) {
                const vegetable = await Vegetable.findById(item.vegetable);
                if (vegetable) {
                    let addition = item.quantity;
                    const vegetableData = await Vegetable.findById(item.vegetable); // Need fresh data for packSize
                    const packSize = vegetableData ? (vegetableData.packSize || 1) : 1;
                    const unit = (item.unit || 'kg').toLowerCase().trim();

                    addition = item.quantity * packSize;
                    if (['g', 'gram', 'grams'].includes(unit)) addition = addition / 1000;

                    vegetable.stock += addition;
                    await vegetable.save();
                }
            }

            order.orderStatus = 'Cancelled';
            const updatedOrder = await order.save();

            res.json({ message: 'Order cancelled', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addOrderItems,
    verifyPayment,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    getDashboardStats,
    cancelOrder
};
