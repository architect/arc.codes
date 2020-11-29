let _inventory = require('@architect/inventory')
let pkg = require('@architect/package')

/**
 * @param {String} req.query.arc
 * @returns {AWS::Serverless} sam.json
 */
exports.handler = async function http (req) {

  let statusCode
  let body

  try {
    statusCode = 200
    let rawArc = req.queryStringParameters.arc
    let inventory = await _inventory({ rawArc })
    let cfn = pkg(inventory)
    body = JSON.stringify(cfn)
  }
  catch (e) {
    statusCode = 500
    body = JSON.stringify({
      name: e.name,
      stack: e.stack,
      message: e.message
    })
  }

  return { statusCode, body }
}
