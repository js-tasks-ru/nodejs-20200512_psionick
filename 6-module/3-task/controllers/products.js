const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query && ctx.request.query.query;
  if (!query) {
    await next();
  } else {
    const products = await Product.find({$text: {$search: query}});
    ctx.statusCode = 200;
    ctx.body = {products};
  }
};
