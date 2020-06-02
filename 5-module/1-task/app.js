const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = {};
router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  const message = await new Promise((resolve) => {
    subscribers[id] = resolve;
    ctx.req.on('close', () => {
      delete subscribers[id];
    });
  });
  if (message) {
    ctx.status = 200;
    ctx.body = message;
  }
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  ctx.status = 200;
  if (message) {
    for (const subscriber in subscribers) {
      if ({}.hasOwnProperty.call(subscribers, subscriber)) {
        subscribers[subscriber](message);
      }
    }

    subscribers = Object.create(null);
  }
});

app.use(router.routes());

module.exports = app;
