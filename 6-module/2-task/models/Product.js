const mongoose = require('mongoose');
const connection = require('../libs/connection');
const toJson = require('@meanie/mongoose-to-json');
mongoose.plugin(toJson);

const productSchema = new mongoose.Schema({
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

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});
productSchema.plugin(toJson);
module.exports = connection.model('Product', productSchema);
