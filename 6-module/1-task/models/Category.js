const mongoose = require('mongoose');
const connection = require('../libs/connection');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
