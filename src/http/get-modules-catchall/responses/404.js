module.exports = function notfound (file) {
  return {
    statusCode: 404,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `404 not found: /modules/${ file }`
  }
}
