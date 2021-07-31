let { http } = require('@architect/functions')
let asap = require('@architect/asap')

// middleware to preserve old urls
let redirect = require('./redirect')

// middleware proxy s3 assets
let static = asap({
  spa: false,
  alias: {
    '/playground': '/playground.html'
  }
})

exports.handler = http.async(redirect, static)
