import arc from '@architect/functions'
import asap from '@architect/asap'
import { redirect as redirectMiddleware } from '@architect/shared/redirect-map.js'
import notFoundResponse from '@architect/shared/not-found-response.js'
import toc from '@architect/views/docs/table-of-contents.js'
import Html from '@architect/views/modules/document/html.js'
import NotFound from '@architect/views/modules/components/not-found.js'
import algolia from '@architect/views/modules/components/algolia.js'

// middleware proxy s3 assets
const staticProxy = asap({
  alias: { '/playground': '/playground.html' },
  passthru: true,
  spa: false
})

async function robots (req) {
  if (req.path === '/robots.txt') {
    const headers = { 'content-type': 'text/plain; charset=utf8' }
    const allow = 'User-agent: *\nDisallow: '
    const disallow = 'User-agent: *\nDisallow: /'
    if (process.env.ARC_ENV === 'production') return { headers, body: allow }
    return { headers, body: disallow }
  }
}

async function notFound (req) {
  const term = req.path

  return {
    ...notFoundResponse,
    body: Html({
      active: term,
      html: NotFound({ term }),
      scripts: [ '/index.js' ],
      thirdparty: algolia,
      toc
    })
  }
}

export const handler = arc.http.async(redirectMiddleware, robots, staticProxy, notFound)
