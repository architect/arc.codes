'use strict';

const Fs = require('fs');
const Path = require('path');
const Insync = require('insync');
const Yazl = require('yazl');


module.exports = function zip (options, callback) {
  const inputs = [].concat(options.input);
  const zip = new Yazl.ZipFile();
  const cwd = options.cwd || process.cwd();

  Insync.each(inputs, function inputIterator (input, next) {
    if (typeof input === 'string') {
      return addFile(Path.resolve(cwd, input), '', zip, next);
    }

    if (input !== null && typeof input === 'object') {
      const data = typeof input.data === 'string' ? Buffer.from(input.data) :
                                                    input.data;

      zip.addBuffer(data, input.name, {
        mtime: new Date(),
        mode: 0o100755
      });

      return next();
    }

    next(new TypeError(`input must be a string or object, but got ${input}`));
  }, function inputCb (err) {
    if (err) {
      return callback(err);
    }

    const chunks = [];
    let outputSize = 0;

    zip.outputStream.on('error', function onError (err) {
      callback(err);
    });

    zip.outputStream.on('data', function onData (chunk) {
      outputSize += chunk.length;
      chunks.push(chunk);
    });

    zip.outputStream.on('finish', function onFinish () {
      const output = Buffer.concat(chunks, outputSize);

      callback(null, output);
    });

    zip.end();
  });
};


function addFile (file, base, zip, callback) {
  Fs.stat(file, function statCb (err, stats) {
    if (err) {
      return callback(err);
    }

    const basename = Path.join(base, Path.basename(file));

    if (stats.isFile()) {
      zip.addFile(file, basename, { mtime: stats.mtime, mode: stats.mode });
      return callback();
    }

    if (stats.isDirectory()) {
      return Fs.readdir(file, function readdirCb (err, files) {
        if (err) {
          return callback(err);
        }

        zip.addEmptyDirectory(basename, {
          mtime: stats.mtime,
          mode: stats.mode
        });

        Insync.each(files, function dirIterator (dirEntry, cb) {
          addFile(Path.join(file, dirEntry), basename, zip, cb);
        }, callback);
      });
    }

    callback();
  });
}
