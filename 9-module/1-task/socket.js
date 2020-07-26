const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token}).populate('user');

    if (!session) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    socket.session = session;

    next();
  });

  io.on('connection', (socket) => {
    socket.on('message', async (msg) => {
      const date = new Date();
      if (!msg) {
        return;
      }

      try {
        await Message.create({
          user: socket.session.user.displayName,
          chat: socket.session.user._id,
          text: msg,
          date,
        });
      } catch (error) {
        console.error(error);
      }
    });
  });

  return io;
}

module.exports = socket;
