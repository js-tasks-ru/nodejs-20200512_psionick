const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  if (!subcategory) {
    await next();
  } else {
    const data = await Product.find({subcategory});
    ctx.status = 200;
    ctx.body = {products: data};
  }
};

module.exports.productList = async function productList(ctx, next) {
  const data = await Product.find({});
  ctx.status = 200;
  ctx.body = {products: data};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'Id is invalid');
  }

  const product = await Product.findById(id);
  if (!product) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = {product: product};
};

