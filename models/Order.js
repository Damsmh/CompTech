const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    ref: 'users',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  }],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('orders', orderSchema);