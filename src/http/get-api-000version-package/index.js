const inventory = require('@architect/inventory')
const package = require('@architect/package')

exports.handler = async function http(req) {
  let raw = req.queryStringParameters.arc
  let statusCode = 200
  let body

  try {
    body = JSON.stringify(package(await inventory({ raw })))
  } catch (e) {
    statusCode = 500
    body = JSON.stringify({
      name: e.name,
      message: e.message,
      stack: e.stack
    })
  }

  return {
    statusCode,
    body
  }
}
