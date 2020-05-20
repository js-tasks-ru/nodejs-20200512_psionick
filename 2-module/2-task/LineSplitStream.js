const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.cacheLine = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkData = chunk.toString();
    const lines = chunkData.split(os.EOL);
    if (lines.length > 1) {
      for (let i = 0; i < lines.length - 1; i++) {
        if (this.cacheLine.length) {
          this.push(this.cacheLine + lines[i]);
          this.cacheLine = '';
        } else {
          this.push(lines[i]);
        }
      }
    }
    this.cacheLine += lines[lines.length - 1];
    callback(null);
  }

  _flush(callback) {
    if (this.cacheLine.length) {
      this.push(this.cacheLine);
      this.cacheLine = '';
    }
    callback();
  }
}

module.exports = LineSplitStream;
