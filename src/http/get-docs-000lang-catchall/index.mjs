import { readFileSync } from 'fs'
import { join } from 'path'
import arc from '@architect/functions'
import render from 'arcdown'
import { redirect as redirectMiddleware } from '@architect/shared/redirect-map.mjs'
import notFoundResponse from '@architect/shared/not-found-response.mjs'
import algolia from '@architect/views/modules/components/algolia.mjs'
import Html from '@architect/views/modules/document/html.mjs'
import NotFound from '@architect/views/modules/components/not-found.mjs'
import toc from '@architect/views/docs/table-of-contents.mjs'
import classMap from './markdown-class-mappings.mjs'

const cache = {} // cheap warm cache

async function handler (req) {
  const { path, pathParameters } = req
  const { lang, proxy } = pathParameters
  const parts = proxy.split('/')
  const docName = parts.pop()

  if (docName === 'playground')
    return { statusCode: 303, headers: { location: '/playground' } }

  const doc = `${docName}.md`
  const activePath = join(
    'docs',
    lang,
    ...parts,
    docName
  )
  const active = `/${activePath}` // Add leading slash to match anchor href
  let editURL = 'https://github.com/architect/arc.codes/edit/main/src/views/docs/'
  editURL += join(lang, ...parts, doc)

  const filePath = join(
    new URL('.', import.meta.url).pathname,
    'node_modules',
    '@architect',
    'views',
    'docs',
    lang,
    ...parts,
    doc
  )

  try {
    let body

    if (cache[filePath]) {
      body = cache[filePath]
    }
    else {
      const file = readFileSync(filePath, 'utf8')
      const renderOptions = {
        hljs: { classString: 'hljs mb0 mb1-lg relative' },
        pluginOverrides: { markdownItClass: classMap },
      }
      const result = await render(file, renderOptions)
      body = cache[filePath] = Html({
        ...result,
        active,
        editURL,
        lang,
        path,
        scripts: [
          '/index.js',
          '/components/arc-viewer.js',
          '/components/arc-tab.js'
        ],
        thirdparty: algolia(lang),
        toc,
      })
    }

    return {
      statusCode: 200,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        'content-type': 'text/html; charset=utf8'
      },
      body
    }
  }
  catch (error) {
    // TODO: Load category "index" landing if available
    console.error(error)
    return {
      ...notFoundResponse,
      body: Html({
        active,
        html: NotFound({ term: docName, error }),
        lang,
        scripts: [ '/index.js' ],
        state: { notFoundTerm: docName },
        thirdparty: algolia(lang),
        toc
      })
    }
  }
}

const _handler = arc.http.async(redirectMiddleware, handler)
export { _handler as handler }
