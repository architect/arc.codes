var lambda = require('@smallwins/lambda')
var insert = lambda.triggers.dynamo.insert
var update = lambda.triggers.dynamo.modify
var destroy = lambda.triggers.dynamo.remove

module.exports = {
  insert,
  update,
  destroy,
}
