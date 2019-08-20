let read = require('./read')

/**
 * arc.proxy.public
 *
 * @param config - object, for configuration
 * @param config.spa - boolean, forces index.html no matter the folder depth
 * @param config.plugins - object, configure proxy-plugin-* transforms per file extension
 * @param config.alias - object, map of root rel urls to map to fully qualified root rel urls
 *
 * @returns HTTPLambda - an HTTP Lambda function that proxies calls to S3
 */
module.exports = function proxyPublic(config) {
  return async function proxy(req) {

    let Bucket = process.env.ARC_STATIC_BUCKET
    let Key // resolved below

    if (config && config.spa) {
      // if spa force index.html
      let isFolder = req.path.split('/').pop().indexOf('.') === -1
      Key = isFolder? 'index.html' : req.path.substring(1)
    }
    else {
      // return index.html for root…otherwise passthru the path minus leading slash
      Key = req.path === '/'? 'index.html' : req.path.substring(1)
      // add index.html to any empty folder path
      let isFolder = Key != 'index.html' && req.path.lastIndexOf('/') === req.path.length - 1
      if (isFolder) {
        Key = Key + 'index.html'
      }
    }

    // allow alias override of Key
    let aliasing = config && config.alias && config.alias.hasOwnProperty(req.path)
    if (aliasing) {
      Key = config.alias[req.path].substring(1) // remove leading /
    }

    // allow bucket folder prefix
    if (process.env.ARC_STATIC_FOLDER) {
      Key = `${process.env.ARC_STATIC_FOLDER}/${Key}`
    }

    // strip staging/ and production/ from req urls
    if (Key.startsWith('staging/') || Key.startsWith('production/')) {
      Key = Key.replace('staging/', '').replace('production/')
    }

    // normalize if-none-match header to lower case; it differs between environments
    let find = k => k.toLowerCase() === 'if-none-match'
    let IfNoneMatch = req.headers && req.headers[Object.keys(req.headers).find(find)]

    return await read({Key, Bucket, IfNoneMatch, config})
  }
}
