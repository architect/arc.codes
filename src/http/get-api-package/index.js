const inventory = require('@architect/inventory')
const pkg = require('@architect/package')

exports.handler = async function http(req) {
  
  let statusCode = 200
  let body

  try {

    console.log(req)

    let rawArc = Buffer.from(req.queryStringParameters.arc, 'base64').toString()
    body = JSON.stringify(pkg(await inventory({ rawArc })))
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
