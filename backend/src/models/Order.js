// src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        rentalDuration: Number,
        rentalPrice: Number,
        securityDeposit: Number,
        quantity: Number,
        dueDate: Date,
      },
    ],

    // Pricing
    subtotal: Number,
    securityDeposit: Number,
    tax: Number,
    rewardPointsRedeemed: { type: Number, default: 0 },
    rewardDiscount: { type: Number, default: 0 },
    total: Number,

    // Delivery
    deliveryAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'],
      default: 'pending',
    },

    // Full audit trail of every status change — powers live order tracking
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'],
          required: true,
        },
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Dates
    orderDate: { type: Date, default: Date.now },
    estimatedDeliveryDate: Date,
    deliveredDate: Date,
    returnDate: Date,

    // Payment
    paymentMethod: String,
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ROR-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 1000
    )}`;
  }
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status || 'pending', note: 'Order placed' });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);