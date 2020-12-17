let { http } = require('@architect/functions')
let redirect = require('./redirect')
let alias = { '/playground': '/playground.html' }

// redirect to new urls; otherwise render static assets in ./public
exports.handler = http.async(redirect, http.proxy.public({spa: false, alias }))
