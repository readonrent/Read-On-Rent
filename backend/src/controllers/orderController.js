// src/controllers/orderController.js
const Order = require('../models/Order');
const Rental = require('../models/Rental');
const Book = require('../models/Book');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/orders (auth required)
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.book', 'title author coverImage')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// GET /api/orders/:id (auth required)
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate(
    'items.book',
    'title author coverImage'
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders/:id/track (auth required)
exports.trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate(
    'items.book',
    'title author coverImage'
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const STEP_LABELS = {
    pending: 'Order Placed',
    confirmed: 'Order Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    returned: 'Returned',
    cancelled: 'Cancelled',
  };

  const history = (order.statusHistory || [])
    .slice()
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((entry) => ({
      status: entry.status,
      label: STEP_LABELS[entry.status] || entry.status,
      note: entry.note,
      timestamp: entry.timestamp,
    }));

  const FORWARD_FLOW = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentIndex = FORWARD_FLOW.indexOf(order.status);
  const upcoming =
    currentIndex === -1
      ? []
      : FORWARD_FLOW.slice(currentIndex + 1).map((status) => ({
          status,
          label: STEP_LABELS[status],
        }));

  res.json({
    success: true,
    data: {
      currentStatus: order.status,
      orderNumber: order.orderNumber,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      deliveredDate: order.deliveredDate,
      returnDate: order.returnDate,
      history,
      upcoming,
    },
  });
});

// POST /api/orders/:id/cancel (auth required)
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  if (['delivered', 'cancelled', 'returned'].includes(order.status)) {
    return res.status(400).json({ success: false, message: `Cannot cancel a ${order.status} order` });
  }

  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
  order.paymentStatus = order.paymentStatus === 'completed' ? 'refunded' : order.paymentStatus;
  await order.save();

  for (const item of order.items) {
    await Book.findByIdAndUpdate(item.book, { $inc: { availableCopies: item.quantity } });
  }
  await Rental.updateMany({ order: order._id }, { status: 'returned', returnedDate: new Date() });

  res.json({ success: true, data: order });
});

// POST /api/orders/:id/return (auth required)
exports.returnRequest = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = 'returned';
  order.statusHistory.push({ status: 'returned', note: 'Return requested by customer' });
  order.returnDate = new Date();
  await order.save();

  await Rental.updateMany(
    { order: order._id },
    { status: 'return_scheduled', returnScheduledDate: new Date() }
  );

  res.json({ success: true, data: order, message: 'Return request submitted' });
});