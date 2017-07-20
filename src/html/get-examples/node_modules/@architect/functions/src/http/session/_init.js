var db = require('./_get-dynamo-instance')

module.exports = function _init(name, callback) {
  db.createTable({
    TableName: name,
    KeySchema: [{
      AttributeName: '_idx',
      KeyType: 'HASH'
    }],
    AttributeDefinitions: [{
      AttributeName: '_idx',
      AttributeType: 'S'
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }, callback)
}
