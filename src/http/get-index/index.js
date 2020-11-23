exports.handler = async function http (req) {
  return {
    statusCode: 302,
    headers: {
      location: '/docs/en/guides/get-started/quickstart'
    }
  }
}
