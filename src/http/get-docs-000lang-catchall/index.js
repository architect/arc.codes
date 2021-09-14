require = require('esm')(module) // eslint-disable-line
const path = require('path')
const util = require('util')
const fs = require('fs')
const Markdown = require('markdown-it')
const markdownClass = require('@toycode/markdown-it-class')
const markdownAnchor = require('markdown-it-anchor')
const frontmatterParser = require('markdown-it-front-matter')
const classMapping = require('./markdown-class-mappings')
const highlighter = require('./highlighter')
const createGroupIndex = require('./group-index')
const readFile = util.promisify(fs.readFile)
const Html = require('@architect/views/modules/document/html.js').default
const toc = require('@architect/views/docs/table-of-contents')
const yaml = require('js-yaml')
const EDIT_DOCS = `edit/main/src/views/docs/`
const cache = {} // cheap warm cache

exports.handler = async function http (req) {
  let { pathParameters } = req
  let { lang, proxy } = pathParameters
  let parts = proxy.replace(/\/$/, '').split('/')
  let docName = parts.pop()

  const headers = {
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    'content-type': 'text/html; charset=utf8'
  }
  const scripts = [
    '/index.js',
    '/components/arc-viewer.js',
    '/components/arc-tab.js'
  ]

  if (docName === 'playground')
    return { statusCode: 303, headers: { location: '/playground' } }

  let doc = `${docName}.md`
  let activePath = path.join(
    'docs',
    lang,
    ...parts,
    docName
  )
  let editURL = 'https://github.com/architect/arc.codes/'
  editURL += path.join(
    EDIT_DOCS,
    lang,
    ...parts,
    doc
  )
  // Add leading slash to match anchor href
  let active = `/${activePath}`

  let filePath = path.join(
    __dirname,
    'node_modules',
    '@architect',
    'views',
    'docs',
    lang,
    ...parts,
    doc
  )
  let file
  try {
    if (!cache[filePath])
      cache[filePath] = await readFile(filePath, 'utf8')
    file = cache[filePath]
  }
  catch (err) {
    const pathParts = [ ...parts, docName ]
    const groupIndex = createGroupIndex(pathParts, toc)

    if (groupIndex) {
      return {
        statusCode: 200,
        headers,
        body: Html({
          ...groupIndex,
          active,
          lang,
          scripts,
          toc
        })
      }
    }
    else {
      console.error(err)

      return {
        statusCode: 404,
        // TODO: send a friendly error page with message
        body: err.message
      }
    }
  }

  let frontmatter = {}
  const markdown = new Markdown({
    linkify: true,
    html: true,
    typographer: true,
    highlight: await highlighter.forMarkdown()
  })
    .use(markdownClass, classMapping)
    .use(markdownAnchor, {
      permalinkSymbol: ' '
    })
    .use(frontmatterParser, function (str) {
      frontmatter = yaml.load(str)
    })
  const children = markdown.render(file)
  const { category, description, sections, title } = frontmatter

  return {
    statusCode: 200,
    headers,
    body: Html({
      active,
      category,
      children,
      description,
      editURL,
      lang,
      sections,
      scripts,
      title,
      toc
    })
  }
}
