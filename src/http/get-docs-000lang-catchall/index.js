require = require('esm')(module) // eslint-disable-line
const path = require('path')
const util = require('util')
const fs = require('fs')
const Markdown = require('markdown-it')
const markdownClass = require('@toycode/markdown-it-class')
const hljs = require('highlight.js')
const classMapping = require('./markdown-class-mappings')
const readFile = util.promisify(fs.readFile)
const Html = require('@architect/views/modules/document/html.js').default
const toc = require('@architect/views/docs/table-of-contents')
const highlight = require('./highlighter')

exports.handler = async function http (req) {
  let { pathParameters } = req
  let { lang, proxy } = pathParameters
  let parts = proxy.split('/')
  let docName = parts.pop()
  let doc = `${docName}.md`

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
    file = await readFile(filePath, 'utf8')
  }
  catch(err) {
    // TODO: Load next doc in section
    console.error(err)
    return {
      statusCode: 404,
      body: err.message
    }
  }


  const md = Markdown({
    highlight: highlight
      .bind(null, hljs, Markdown().utils.escapeHtml)
  })
    .use(markdownClass, classMapping)

  const children = md.render(file)
  const title = capitalize(docName.replace(/-/g, ' '))

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: Html({
      lang,
      children,
      title,
      toc
    })
  }
}

function capitalize(str='') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
