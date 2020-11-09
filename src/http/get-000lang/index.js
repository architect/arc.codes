require = require('esm')(module) // eslint-disable-line
const Html = require('@architect/views/modules/document/html.js').default
const Main = require('@architect/views/modules/pages/main.js').default

exports.handler = async function http(req) {
  let { pathParameters } = req
  let { lang } = pathParameters
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: Html({
      children: Main({}),
      lang,
      title: 'Welcome!'
    })
  }
}
