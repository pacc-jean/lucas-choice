const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  total: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Mpesa', 'PayPal', 'Card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
