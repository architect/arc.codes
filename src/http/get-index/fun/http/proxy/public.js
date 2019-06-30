let path = require('path')
let read = require('./read')
/**
 * arc.proxy.public
 *
 * @param config - object, for configuration
 * @param config.spa - boolean, forces index.html no matter the folder depth
 * @param config.ssr - path string for module to load or function to override `/index.html`
 * @param config.plugins - object, configure proxy-plugin-* transforms per file extension
 * @param config.alias - object, map of root rel urls to map to fully qualified root rel urls
 * @param config.bucket - object, {staging, production} override the s3 bucket names
 * @param config.bucket.staging - object, {staging, production} override the s3 bucket names
 * @param config.bucket.production - object, {staging, production} override the s3 bucket names
 * @param config.bucket.folder - string, bucket folder
 * @param config.cacheControl - string, set a custom Cache-Control max-age header value
 *
 * @returns HTTPLambda - an HTTP Lambda function that proxies calls to S3
 */
module.exports = function proxyPublic(config) {
  return async function proxy(req) {

    // first we need to determine the S3 Key
    let Key

    // root is a special case, pass this along later
    let isRoot = req.path === '/'

    if (config && config.spa) {
      // if spa force index.html
      let isFolder = req.path.split('/').pop().indexOf('.') === -1
      Key = isFolder? 'index.html' : req.path.substring(1)
    }
    else {
      // return index.html for root…otherwise passthru the path minus leading slash
      Key = isRoot ? 'index.html' : req.path.substring(1)
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

    // allow for ssr escape hatch
    let rendering = config && config.ssr && Key === 'index.html'
    if (rendering) {
      // abdicating to the ssr
      let ssr
      if (typeof config.ssr === 'string') {
        /* eslint global-require: 'off' */
        let local = config.ssr.startsWith('.')
        let mod = local? path.join(process.cwd(), config.ssr) : config.ssr
        ssr = require(mod)
      }
      if (typeof config.ssr === 'function')
        ssr = config.ssr
      if (!ssr)
        throw ReferenceError('config.ssr must be a valid module path or a function')
      // run the ssr function
      let result = await ssr(req, config)
      // only return if the result has headers and body
      if (result.headers && result.body)
        return result
      // this allows ssr to opt out of some urls
    }

    // pass along headers for ETag, etc.
    let reqHeaders
    if (req.headers) { reqHeaders = req.headers }

    // return the blob
    let params = {Key, config, reqHeaders, isRoot}
    return await read(params)
  }
}
