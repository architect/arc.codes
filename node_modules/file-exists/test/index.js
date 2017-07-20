const fileExists = require('../')
const test = require('tape')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const async = require('async')

test('async', t => {
  mkdirp.sync('.tmp')
  fs.writeFileSync('.tmp/index.html', 'test', 'utf8')

  async.parallel([
    done => {
      fileExists('.tmp/index.html', (err, exists) => {
        t.ok(exists, 'file does exist')
        done()
      })
    },
    done => {
      fileExists('/index.html', {root: '.tmp'}, (err, exists) => {
        t.ok(exists, 'file exists in given root directory')
        done()
      })
    },
    done => {
      fileExists('.tmp', (err, exists) => {
        t.notOk(exists, 'directory is not a file')
        done()
      })
    },
    done => {
      fileExists('not.here', (err, exists) => {
        t.notOk(err, 'non-existing file doesn\'t throw')
        t.notOk(exists, 'non-existing file doesn\'t exist')
        done()
      })
    }
  ], err => {
    rmdir('.tmp', () => t.end())
  })
})

test('sync', t => {
  mkdirp.sync('.tmp')
  fs.writeFileSync('.tmp/index.html', 'test', 'utf8')

  t.ok(fileExists.sync('.tmp/index.html'), 'file does exist')
  t.ok(fileExists.sync('/index.html', {root: '.tmp'}), 'file exists in given root directory')
  t.notOk(fileExists.sync('.tmp'), 'directory is not a file')
  t.notOk(fileExists.sync('not.here'), 'non-existing file doesn\'t exist')

  rmdir('.tmp', () => t.end())
})
