// eslint-disable-next-line
require = require('esm')(module)

const { http } = require('@architect/functions')
const asap = require('@architect/asap')
const { redirect: redirectMiddleware } = require('@architect/shared/redirect-map')
const notFoundResponse = require('@architect/shared/not-found-response')
const toc = require('@architect/views/docs/table-of-contents')
const Html = require('@architect/views/modules/document/html.js').default
const NotFound = require('@architect/views/modules/components/not-found.js').default
const algolia = require('@architect/views/modules/components/algolia.js').default

// middleware proxy s3 assets
const staticProxy = asap({
  alias: { '/playground': '/playground.html' },
  passthru: true,
  spa: false
})

async function notFound (req) {
  const term = req.path

  return {
    ...notFoundResponse,
    body: Html({
      active: term,
      children: NotFound({ term }),
      scripts: [ '/index.js' ],
      thirdparty: algolia,
      toc
    })
  }
}

exports.handler = http.async(redirectMiddleware, staticProxy, notFound)
