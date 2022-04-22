// eslint-disable-next-line
require = require('esm')(module)

const { readFile } = require('fs/promises')
const { join } = require('path')
const { http } = require('@architect/functions')
const render = require('@architect/arc-plugin-render-md')
const classMapping = require('./markdown-class-mappings')
const { redirect: redirectMiddleware } = require('@architect/shared/redirect-map')
const algolia = require('@architect/views/modules/components/algolia.js').default
const Html = require('@architect/views/modules/document/html.js').default
const NotFound = require('@architect/views/modules/components/not-found.js').default
const notFoundResponse = require('@architect/shared/not-found-response')
const toc = require('@architect/views/docs/table-of-contents')

const cache = {} // cheap warm cache

async function handler (req) {
  let { path, pathParameters } = req
  let { lang, proxy } = pathParameters
  let parts = proxy.split('/')
  let docName = parts.pop()

  if (docName === 'playground')
    return { statusCode: 303, headers: { location: '/playground' } }

  let doc = `${docName}.md`
  let activePath = join(
    'docs',
    lang,
    ...parts,
    docName
  )
  let active = `/${activePath}` // Add leading slash to match anchor href
  let editURL = 'https://github.com/architect/arc.codes/edit/main/src/views/docs/'
  editURL += join(lang, ...parts, doc)

  let filePath = join(
    __dirname,
    'node_modules',
    '@architect',
    'views',
    'docs',
    lang,
    ...parts,
    doc
  )

  try {
    let body, file
    if (cache[filePath]) {
      body = cache[filePath]
    }
    else {
      file = await readFile(filePath, 'utf8')
      body = cache[filePath] = Html({
        ...render(file, classMapping),
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
        children: NotFound({ term: docName, error }),
        lang,
        scripts: [ '/index.js' ],
        state: { notFoundTerm: docName },
        thirdparty: algolia(lang),
        toc
      })
    }
  }
}

exports.handler = http.async(redirectMiddleware, handler)
