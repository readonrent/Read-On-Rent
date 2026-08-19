// src/controllers/adminController.js
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Rental = require('../models/Rental');
const { asyncHandler } = require('../middleware/errorHandler');
const generatedBooks = require('../seeders/booksData');

// GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/admin/books
exports.getAllBooksAdmin = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json({ success: true, data: books });
});

// POST /api/admin/books
exports.createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
});

// PUT /api/admin/books/:id
exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  res.json({ success: true, data: book });
});

// DELETE /api/admin/books/:id
// Soft delete - keeps historical order/rental references valid
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  res.json({ success: true, message: 'Book deactivated', data: book });
});

// GET /api/admin/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .populate('items.book', 'title author')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/admin/orders/:id
exports.getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.book', 'title author coverImage')
    .populate('statusHistory.updatedBy', 'name');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// PUT /api/admin/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, estimatedDeliveryDate } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Prevent invalid status transitions for completed terminal states
  if (['delivered', 'cancelled', 'returned'].includes(order.status) && order.status !== status) {
    return res.status(400).json({
      success: false,
      message: `Order is already ${order.status} and cannot move to ${status}`,
    });
  }

  const previousStatus = order.status;
  order.status = status;
  order.statusHistory.push({ status, note: note || undefined, updatedBy: req.user._id });

  if (estimatedDeliveryDate) {
    order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
  }
  if (status === 'delivered' && !order.deliveredDate) {
    order.deliveredDate = new Date();
  }
  if (status === 'returned' && !order.returnDate) {
    order.returnDate = new Date();
  }

  // Handle inventory restoration & refund logic on cancel or return
  if (['cancelled', 'returned'].includes(status) && !['cancelled', 'returned'].includes(previousStatus)) {
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, { $inc: { availableCopies: item.quantity } });
    }
    if (status === 'cancelled' && order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
    }
    await Rental.updateMany({ order: order._id }, { status: 'returned', returnedDate: new Date() });
  }

  await order.save();
  await order.populate('user', 'name email');
  await order.populate('items.book', 'title author');

  res.json({ success: true, data: order });
});

// GET /api/admin/reports
exports.getReports = asyncHandler(async (req, res) => {
  const [totalUsers, totalBooks, totalOrders, revenueAgg, statusBreakdown, topBooks] =
    await Promise.all([
      User.countDocuments(),
      Book.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Book.find({ isActive: true }).sort({ rating: -1, numReviews: -1 }).limit(5).select('title author rating numReviews'),
    ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalBooks,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      ordersByStatus: statusBreakdown.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      topRatedBooks: topBooks,
    },
  });
});

// POST /api/admin/seed/books
exports.seedBooksEndpoint = asyncHandler(async (req, res) => {
  await Book.deleteMany({});
  const inserted = await Book.insertMany(generatedBooks);
  res.json({ success: true, message: `Seeded ${inserted.length} books`, count: inserted.length });
});