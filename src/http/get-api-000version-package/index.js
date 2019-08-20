let parse = require('@architect/parser')
let pkg = require('@architect/package')

/**
 * @param {String} req.query.arc
 * @returns {AWS::Serverless} sam.json
 */
exports.handler = async function http(req) {

  let statusCode
  let body

  try {
    statusCode = 200
    body = JSON.stringify(pkg(parse(req.queryStringParameters.arc)))
  }
  catch(e) {
    statusCode = 500
    body = JSON.stringify({
      name: e.name,
      stack: e.stack,
      message: e.message
    })
  }

  return {statusCode, body}
}
