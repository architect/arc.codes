var nut   = require('./nut')
var shell = require('./shell') //the shell surrounds the nut
var codec = require('levelup/lib/codec')
var merge = require('xtend')

var ReadStream = require('levelup/lib/read-stream')

var precodec = require('./codec/legacy')

module.exports = function (db, opts) {

  opts = merge(db.options, opts)

  return shell ( nut ( db, precodec, codec ), [], ReadStream, db.options)

}

