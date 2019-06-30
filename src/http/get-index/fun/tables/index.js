let old = require('./old')
let doc = require('./doc')
let readSSM = require('./read-ssm')
let readArc = require('./read-arc')
let factory = require('./factory')
let sandbox = require('./sandbox')
let db = require('./db')

// cheap client cache
let client = false


/**
 * // example usage:
 * let arc = require('architect/functions')
 *
 * exports.handler = async function http(req) {
 *  let data = await arc.tables()
 *  await data.tacos.put({taco: 'pollo'})
 *  return {statusCode: 200}
 * }
 */
function tables(callback) {
  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }
  if (process.env.NODE_ENV === 'testing') {
    readArc(function errback(err, arc) {
      if (err) callback(err)
      else callback(null, sandbox(arc))
    })
  }
  else {
    if (client) {
      callback(null, client)
    }
    else {
      readSSM(function done(err, tables) {
        if (err) callback(err)
        else {
          client = factory(tables)
          callback(null, client)
        }
      })
    }
  }
  return promise
}

// export for direct/fast use
tables.doc = doc
tables.db = db
tables.insert = old.insert
tables.modify = old.modify
tables.update = old.update
tables.remove = old.remove
tables.destroy = old.destroy
tables.all = old.all
tables.save = old.save
tables.change = old.change

module.exports = tables
