let parse = require('@architect/parser')
let init = require('@architect/init')
let pkg = require('@architect/package')

/**
 * @param {String} req.query.arc
 * @returns {AWS::Serverless} sam.json
 */
exports.handler = async function http(req) {

  // write the .arc file
  // run arc init
  // run arc package
  // zip the contents
  // send the result back

  return {statusCode, body}
}
