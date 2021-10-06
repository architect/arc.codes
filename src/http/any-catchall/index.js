const { http } = require('@architect/functions')
const asap = require('@architect/asap')
const redirect = require('@architect/shared/redirect') // middleware to preserve old urls

// middleware proxy s3 assets
const staticProxy = asap({
  spa: false,
  alias: {
    '/playground': '/playground.html'
  }
})

exports.handler = http.async(redirect, staticProxy)
