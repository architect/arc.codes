require = require('esm')(module) // eslint-disable-line
const path = require('path')
const util = require('util')
const fs = require('fs')
const Marked = require('marked')
const readFile = util.promisify(fs.readFile)
const Html = require('@architect/views/modules/document/html.js').default
const toc = require('@architect/views/docs/table-of-contents')

exports.handler = async function http (req={}) {
  let { pathParameters } = req
  let { lang, cat, doc } = pathParameters
  let filePath = path.join(
    __dirname,
    'node_modules',
    '@architect',
    'views',
    'docs',
    lang,
    cat,
    `${doc}.md`
  )
  let file
  try {
    file = await readFile(filePath, 'utf8')
  }
  catch(err) {
    console.error(err)
    return {
      statusCode: 404,
      body: err.message
    }
  }

  let children = Marked(file)
  let title = doc

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: Html({
      lang,
      cat,
      children,
      title,
      toc
    })
  }
}
