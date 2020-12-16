let asap = require('@architect/asap')

exports.handler = catchall

async function catchall (req) {
  // intercept requests to the app apex and redirect to the quickstart for now
  let index = req.requestContext.http.method.toLowerCase() === 'get' && req.requestContext.http.path === '/'
  if (index) {
    return {
      statusCode: 303,
      headers: {
        location: '/docs/en/guides/get-started/quickstart'
      }
    }
  }
  else {
    // otherwise proxy s3
    return asap.handler(req)
  }
}
