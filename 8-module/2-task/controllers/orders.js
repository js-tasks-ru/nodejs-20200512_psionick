const Product = require('../models/Product');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const product = await Product.findById(ctx.request.body.product);

  const order = await Order.create({
    user: ctx.user,
    product: product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order._id, product},
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });


  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user});
  ctx.body = {orders};
};
