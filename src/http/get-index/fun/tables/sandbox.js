let db = require('./db')
let doc = require('./doc')
let promisify = require('./promisify-object')

/**
 * returns a data client
 */
module.exports = function sandbox(arc) {

  let appname = arc.app[0]
  let reduce = (a, b)=> Object.assign({}, a, b)
  let tables = arc.tables.map(t=> Object.keys(t)[0]) //(t=> name(Object.keys(t)[0]))
  let data = tables.map(client(appname)).reduce(reduce, {})

  Object.defineProperty(data, '_db', {
    enumerable: false,
    value: db
  })

  Object.defineProperty(data, '_doc', {
    enumerable: false,
    value: doc
  })

  return data
}

function client(appname) {
  return function(tablename) {
    let name = nom=> `${appname}-staging-${nom}`
    let TableName = name(tablename)
    let client = {
      delete(key, callback) {
        let params = {}
        params.TableName = TableName
        params.Key = key
        doc.delete(params, callback)
      },
      get(key, callback) {
        let params = {}
        params.TableName = TableName
        params.Key = key
        doc.get(params, function _get(err, result) {
          if (err) callback(err)
          else callback(null, result.Item)
        })
      },
      put(item, callback) {
        let params = {}
        params.TableName = TableName
        params.Item = item
        doc.put(params, function _put(err) {
          if (err) callback(err)
          else callback(null, item)
        })
      },
      query(params, callback) {
        params.TableName = TableName
        doc.query(params, callback)
      },
      scan(params, callback) {
        params.TableName = TableName
        doc.scan(params, callback)
      },
      update(params, callback) {
        params.TableName = TableName
        doc.update(params, callback)
      }
    }
    let result = {}
    result[tablename] = promisify(client)
    return result
  }
}
