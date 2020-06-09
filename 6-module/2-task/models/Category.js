const mongoose = require('mongoose');
const connection = require('../libs/connection');
const toJson = require('@meanie/mongoose-to-json');
mongoose.plugin(toJson);

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});
categorySchema.plugin(toJson);

module.exports = connection.model('Category', categorySchema);
