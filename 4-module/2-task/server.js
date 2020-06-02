const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();

        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File exists');
        break;
      }

      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1e6});

      req.on('aborted', () => fs.unlink(filepath, (err) => {
      }));

      req.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too big');

          fs.unlink(filepath, (err) => {
          });
          return;
        }

        res.statusCode = 500;
        res.end('Internal server error');
        fs.unlink(filepath, (err) => {
        });
      });

      writeStream
        .on('error', (err) => {
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File exists');
            return;
          }

          res.statusCode = 500;
          res.end('Internal server error');
          fs.unlink(filepath, (err) => {
          });
        })
        .on('close', () => {
          res.statusCode = 201;
          res.end('File created');
        });

      res.on('close', () => {
        if (res.writableFinished) return;
        fs.unlink(filepath, (err) => {
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
