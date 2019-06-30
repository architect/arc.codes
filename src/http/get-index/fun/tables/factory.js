let _db = require('./db')
let _doc = require('./doc')
let promisify = require('./promisify-object')

/**
 * returns a data client
 */
module.exports = function reflectFactory(tables) {

  let data = Object.keys(tables).reduce((client, tablename)=> {
    client[tablename] = factory(tables[tablename])
    return client
  }, {})

  Object.defineProperty(data, '_db', {
    enumerable: false,
    value: _db
  })

  Object.defineProperty(data, '_doc', {
    enumerable: false,
    value: _doc
  })

  return data
}

function factory(TableName) {
  return promisify({
    delete(key, callback) {
      let params = {}
      params.TableName = TableName
      params.Key = key
      _doc.delete(params, callback)
    },
    get(key, callback) {
      let params = {}
      params.TableName = TableName
      params.Key = key
      _doc.get(params, function _get(err, result) {
        if (err) callback(err)
        else callback(null, result.Item)
      })
    },
    put(item, callback) {
      let params = {}
      params.TableName = TableName
      params.Item = item
      _doc.put(params, function _put(err) {
        if (err) callback(err)
        else callback(null, item)
      })
    },
    query(params, callback) {
      params.TableName = TableName
      _doc.query(params, callback)
    },
    scan(params, callback) {
      params.TableName = TableName
      _doc.scan(params, callback)
    },
    update(params, callback) {
      params.TableName = TableName
      _doc.update(params, callback)
    }
  })
}
