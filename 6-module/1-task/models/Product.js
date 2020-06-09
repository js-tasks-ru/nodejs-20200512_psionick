const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [String],
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  subcategory: {type: Schema.Types.ObjectId, required: true},
});

module.exports = connection.model('Product', productSchema);
