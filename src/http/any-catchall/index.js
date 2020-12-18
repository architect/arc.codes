let { http } = require('@architect/functions')

// middleware to preserve old urls
let redirect = require('./redirect')

// middleware proxy s3 assets
let asap = http.proxy({
  spa: false,
  alias: {
    '/playground': '/playground.html'
  }
})

exports.handler = http.async(redirect, asap)
