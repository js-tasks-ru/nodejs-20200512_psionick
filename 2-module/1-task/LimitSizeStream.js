const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalByteLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalByteLength += Buffer.byteLength(chunk);
    if (this.totalByteLength > this.limit) {
      callback(new LimitExceededError(), null);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
