require = require('esm')(module) // eslint-disable-line
const path = require('path')
const util = require('util')
const fs = require('fs')
const prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const Marked = require('marked')
const readFile = util.promisify(fs.readFile)
const Html = require('@architect/views/modules/document/html.js').default
const toc = require('@architect/views/docs/table-of-contents')

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


  loadLanguages([
    'bash',
    'css',
    'html',
    'json',
    'javascript',
    'markdown',
    'powershell',
    'python',
    'ruby',
    'yaml'
  ])

  Marked.setOptions({
    highlight: function(code, lang) {
      if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang], lang)
      } else {
        return code
      }
    }
  })

  let children = Marked.parse(file)
  let title = capitalize(docName.replace(/-/g, ' '))

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
