const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const data = await Category.find({});
  ctx.status = 200;
  ctx.body = {categories: data};
};
