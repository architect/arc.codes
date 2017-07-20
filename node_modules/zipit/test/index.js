'use strict';

const Fs = require('fs');
const Path = require('path');
const Code = require('code');
const Lab = require('lab');
const StandIn = require('stand-in');
const Unzip = require('yauzl');
const Zip = require('yazl');
const Zipit = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

const fixturesDirectory = Path.join(__dirname, 'fixtures');


function unzip (buffer, callback) {
  const result = { files: {} };

  Unzip.fromBuffer(buffer, (err, zip) => {
    if (err) {
      return callback(err);
    }

    zip.on('error', function onError (err) {
      zip.close();
      callback(err);
    });

    zip.on('end', function onEnd () {
      zip.close();
    });

    if (zip.entryCount === 0) {
      return callback(null, result);
    }

    let processed = 0;

    zip.on('entry', function onEntry (entry) {
      zip.openReadStream(entry, (err, stream) => {
        if (err) {
          return callback(err);
        }

        const chunks = [];
        let outputSize = 0;

        stream.on('error', (err) => {
          callback(err);
        });

        stream.on('data', (chunk) => {
          outputSize += chunk.length;
          chunks.push(chunk);
        });

        stream.on('finish', () => {
          const output = Buffer.concat(chunks, outputSize);

          result.files[entry.fileName] = {
            entry,
            name: entry.fileName,
            mode: ((entry.externalFileAttributes >> 16) & 0xfff).toString(8),
            _asBuffer: output
          };

          processed++;

          if (processed >= zip.entryCount) {
            callback(null, result);
          }
        });
      });
    });
  });
}


describe('Zipit', () => {
  it('creates a zip from a single filename', (done) => {
    const input = Path.join(fixturesDirectory, 'file.js');

    Zipit({
      input,
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip) => {
        expect(err).to.not.exist();

        const file = zip.files['file.js'];

        expect(Object.keys(zip.files).length).to.equal(1);
        expect(file).to.be.an.object();
        expect(file.name).to.equal('file.js');
        expect(file._asBuffer).to.equal(Fs.readFileSync(input));
        done();
      });
    });
  });

  it('creates a zip from a directory name', (done) => {
    Zipit({
      input: Path.join(fixturesDirectory, 'directory'),
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip, data) => {
        expect(err).to.not.exist();

        const dir = zip.files['directory/'];
        const subdir = zip.files['directory/subdirectory/'];
        const dirFile = zip.files['directory/dir-file.js'];
        const subdirFile = zip.files['directory/subdirectory/subdir-file.js'];

        expect(Object.keys(zip.files).length).to.equal(4);

        expect(dir).to.be.an.object();
        expect(dir.name).to.equal('directory/');

        expect(subdir).to.be.an.object();
        expect(subdir.name).to.equal('directory/subdirectory/');

        expect(dirFile).to.be.an.object();
        expect(dirFile.name).to.equal('directory/dir-file.js');
        expect(dirFile._asBuffer).to.equal(Fs.readFileSync(
          Path.join(fixturesDirectory, 'directory', 'dir-file.js'))
        );

        expect(subdirFile).to.be.an.object();
        expect(subdirFile.name).to.equal('directory/subdirectory/subdir-file.js');
        expect(subdirFile._asBuffer).to.equal(Fs.readFileSync(
          Path.join(fixturesDirectory, 'directory', 'subdirectory', 'subdir-file.js'))
        );

        done();
      });
    });
  });

  it('creates a zip from a file and directory', (done) => {
    Zipit({
      input: [
        Path.join(fixturesDirectory, 'file.js'),
        Path.join(fixturesDirectory, 'directory')
      ],
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip, data) => {
        expect(err).to.not.exist();

        const file = zip.files['file.js'];
        const dir = zip.files['directory/'];
        const subdir = zip.files['directory/subdirectory/'];
        const dirFile = zip.files['directory/dir-file.js'];
        const subdirFile = zip.files['directory/subdirectory/subdir-file.js'];

        expect(Object.keys(zip.files).length).to.equal(5);

        expect(file).to.be.an.object();
        expect(file.name).to.equal('file.js');
        expect(file._asBuffer).to.equal(Fs.readFileSync(
          Path.join(fixturesDirectory, 'file.js')
        ));

        expect(dir).to.be.an.object();
        expect(dir.name).to.equal('directory/');

        expect(subdir).to.be.an.object();
        expect(subdir.name).to.equal('directory/subdirectory/');

        expect(dirFile).to.be.an.object();
        expect(dirFile.name).to.equal('directory/dir-file.js');
        expect(dirFile._asBuffer).to.equal(Fs.readFileSync(
          Path.join(fixturesDirectory, 'directory', 'dir-file.js'))
        );

        expect(subdirFile).to.be.an.object();
        expect(subdirFile.name).to.equal('directory/subdirectory/subdir-file.js');
        expect(subdirFile._asBuffer).to.equal(Fs.readFileSync(
          Path.join(fixturesDirectory, 'directory', 'subdirectory', 'subdir-file.js'))
        );
        done();
      });
    });
  });

  it('creates a zip from inline data', (done) => {
    Zipit({
      input: [
        { name: 'abc.ini', data: Buffer.from('foo-bar-baz') },
        { name: 'xyz.txt', data: 'blah-blah-blah' }
      ]
    }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip, data) => {
        expect(err).to.not.exist();

        expect(Object.keys(zip.files).length).to.equal(2);

        const file1 = zip.files['abc.ini'];
        const file2 = zip.files['xyz.txt'];

        expect(file1).to.be.an.object();
        expect(file1.name).to.equal('abc.ini');
        expect(file1._asBuffer).to.equal(Buffer.from('foo-bar-baz'));
        expect(file1.mode).to.equal('755');

        expect(file2).to.be.an.object();
        expect(file2.name).to.equal('xyz.txt');
        expect(file2._asBuffer).to.equal(Buffer.from('blah-blah-blah'));
        expect(file2.mode).to.equal('755');
        done();
      });
    });
  });

  it('handles errors during zip creation', (done) => {
    const input = Path.join(fixturesDirectory, 'file.js');

    StandIn.replace(Zip.ZipFile.prototype, 'end', function end () {
      this.outputStream.emit('error', new Error('foo'));
    }, { stopAfter: 1 });

    Zipit({
      input,
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.be.an.error('foo');
      expect(buffer).to.not.exist();
      done();
    });
  });

  it('handles fs.stat() errors', (done) => {
    const input = Path.join(fixturesDirectory, 'file.js');

    StandIn.replace(Fs, 'stat', (stand, file, callback) => {
      callback(new Error('foo'));
    }, { stopAfter: 1 });

    Zipit({
      input,
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.be.an.error('foo');
      expect(buffer).to.not.exist();
      done();
    });
  });

  it('ignores things that are not files or directories', (done) => {
    const input = Path.join(fixturesDirectory, 'file.js');

    StandIn.replace(Fs, 'stat', (stand, file, callback) => {
      callback(null, {
        isFile () { return false; },
        isDirectory () { return false; }
      });
    }, { stopAfter: 1 });

    Zipit({
      input,
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip, data) => {
        expect(err).to.not.exist();
        expect(Object.keys(zip.files).length).to.equal(0);
        done();
      });
    });
  });

  it('handles fs.readdir() errors', (done) => {
    const input = Path.join(fixturesDirectory, 'directory');

    StandIn.replace(Fs, 'readdir', (stand, dir, callback) => {
      callback(new Error('foo'));
    }, { stopAfter: 1 });

    Zipit({
      input,
      cwd: fixturesDirectory
    }, (err, buffer) => {
      expect(err).to.be.an.error('foo');
      expect(buffer).to.not.exist();
      done();
    });
  });

  it('calls back with an error on invalid input', (done) => {
    function fail (input, callback) {
      Zipit({ input }, (err, buffer) => {
        expect(err).to.be.an.error(TypeError, /input must be a string or object, but got/);
        expect(buffer).to.not.exist();
        callback();
      });
    }

    fail(undefined, () => {
      fail(null, () => {
        fail(123, () => {
          fail(true, done);
        });
      });
    });
  });

  it('works with relative paths', (done) => {
    const input = './test/fixtures/file.js';

    Zipit({ input }, (err, buffer) => {
      expect(err).to.not.exist();
      expect(buffer).to.be.an.instanceOf(Buffer);

      unzip(buffer, (err, zip, data) => {
        expect(err).to.not.exist();

        const file = zip.files['file.js'];

        expect(Object.keys(zip.files).length).to.equal(1);
        expect(file).to.be.an.object();
        expect(file.name).to.equal('file.js');
        expect(file._asBuffer).to.equal(Fs.readFileSync(input));
        done();
      });
    });
  });
});
