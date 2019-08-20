let mime = require('mime-types')
let path = require('path')
let fs = require('fs')
let util = require('util')
let readFile = util.promisify(fs.readFile)
let transform = require('./transform')

module.exports = async function sandbox({Key, config}) {
  try {
    // Lookup the blob in ./public
    // assuming we're running from a lambda in src/**/*
    let filePath = path.join(process.cwd(), '..', '..', '..', 'public', Key)
    if (!fs.existsSync(filePath))
      throw ReferenceError(`${filePath} not found`)

    // read the file
    let body = await readFile(filePath, {encoding: 'utf8'})
    let type = mime.contentType(path.extname(Key))
    return transform({
      Key,
      config,
      defaults: {
        headers: {'content-type': type},
        body
      }
    })
  }
  catch(e) {
    //look for public/404.html
    let headers = {'content-type': 'text/html; charset=utf8;'}
    let http404 = path.join(process.cwd(), '..', '..', '..', 'public', '404.html')
    let exists = fs.existsSync(http404)
    if (exists) {
      let body = await readFile(http404, {encoding: 'utf8'})
      return {headers, statusCode:404, body}
    }
    let err = `
      <h1>${e.name}</h1>
      <pre>${e.code}</pre>
      <p>${e.message}</p>
      <pre>${e.stack}</pre>
    `
    return {headers, body:err}
  }
}
