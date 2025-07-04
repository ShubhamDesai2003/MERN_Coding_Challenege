const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  image: String,
  dateOfSale: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);