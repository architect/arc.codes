import { readFileSync } from 'fs'
import { join } from 'path'
import arc from '@architect/functions'
import render from 'arcdown'
import { redirect as redirectMiddleware } from '@architect/shared/redirect-map.mjs'
import algolia from '@architect/views/modules/components/algolia.mjs'
import classMap from '@architect/views/markdown-class-mappings.mjs'
import Html from '@architect/views/modules/document/html.mjs'
import NotFound from '@architect/views/modules/components/not-found.mjs'
import toc from '@architect/views/docs/table-of-contents.mjs'
import notFoundResponse from '@architect/shared/not-found-response.mjs'

async function handler (request) {
  const { path, pathParameters } = request
  const { lang } = pathParameters
  const docName = path.split('/').pop()

  // ? use `new URL()`
  const filePath = join(
    new URL('.', import.meta.url).pathname,
    'node_modules',
    '@architect',
    'views',
    `${path}.md`,
  )

  try {
    const docCache = (await arc.tables()).docs
    const cachedDoc = await docCache.get({ path })
    let body

    if (cachedDoc) {
      console.log('cached', path, cachedDoc.expires)
      body = cachedDoc.body
    }
    else {
      const file = readFileSync(filePath, 'utf8')
      const renderOptions = {
        hljs: { classString: 'hljs mb0 mb1-lg relative' },
        pluginOverrides: { markdownItClass: classMap },
      }
      const result = await render(file, renderOptions)
      body = Html({
        ...result,
        active: path,
        lang,
        path,
        scripts: [
          '/index.js',
          '/components/arc-viewer.js',
          '/components/arc-tab.js',
        ],
        thirdparty: algolia(lang),
        toc,
      })
      await docCache.put({ path, body, expires: Date.now() + (1000 * 60 * 60) })
    }

    return {
      statusCode: 200,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        'content-type': 'text/html; charset=utf8',
      },
      body,
    }
  }
  catch (error) {
    // TODO: Load category "index" landing if available
    console.error(error)
    return {
      ...notFoundResponse,
      body: Html({
        active: path,
        html: NotFound({ term: docName, error }),
        lang,
        scripts: [ '/index.js' ],
        state: { notFoundTerm: docName },
        thirdparty: algolia(lang),
        toc,
      })
    }
  }
}

const _handler = arc.http.async(redirectMiddleware, handler)
export { _handler as handler }
