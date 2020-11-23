require = require('esm')(module) // eslint-disable-line
const path = require('path')
const util = require('util')
const fs = require('fs')
const Markdown = require('markdown-it')
const markdownClass = require('@toycode/markdown-it-class')
const frontmatterParser = require('markdown-it-front-matter')
const classMapping = require('./markdown-class-mappings')
const hljs = require('highlight.js')
const escapeHtml = Markdown().utils.escapeHtml
const highlight = require('./highlighter').bind(null, hljs, escapeHtml)
const readFile = util.promisify(fs.readFile)
const Html = require('@architect/views/modules/document/html.js').default
const toc = require('@architect/views/docs/table-of-contents')
const yaml = require('js-yaml') // REALLY???

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
  // Declare in outer scope for use later... sorry
  let frontmatter = ''
  const md = Markdown({ highlight, linkify: true })
    .use(markdownClass, classMapping)
    .use(frontmatterParser, function(str) {
      frontmatter = yaml.load(str)
    })
  const children = md.render(file)
  const { category, description, sections, title } = frontmatter

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: Html({
      lang,
      category,
      children,
      title,
      description,
      sections,
      toc
    })
  }
}
