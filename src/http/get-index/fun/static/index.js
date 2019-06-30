let fs = require('fs')
let path = require('path')
let parse = require('@architect/parser')
let arcFile = path.join(process.cwd(), 'node_modules', '@architect', 'shared', '.arc')
let url = require('url').format
let arc

/**
 * Architect static asset helper
 * - Returns the live asset filename
 */
module.exports = function static(assetPath, options) {
  let env = process.env.NODE_ENV
  let folder = process.env.ARC_STATIC_FOLDER ? '/' + process.env.ARC_STATIC_FOLDER : ''
  let region = process.env.AWS_REGION
  let S3domain = bucket => `https://${bucket}.s3.${region}.amazonaws.com${folder}/`

  // TODO add options
  // - fingerprinted filename only (nice for proxy uses)
  // - force serving from /_static
  // - CDN / alternate domain prefix

  // Only load the arc file once (if possible)
  if (!arc || options && options.reload) {
    arc = parse(fs.readFileSync(arcFile).toString())
  }

  // Normalize to no leading slash
  if (assetPath[0] === '/') assetPath = assetPath.substring(1)

  // Just pass through request if not in staging or production
  let runningLocally = !env || env === 'testing'
  if (runningLocally) {
    return `/_static/${assetPath}`
  }
  else {
    // Check fingerprint status
    let fingerprint = false
    let staticManifest
    if (arc.static && arc.static.some(s => {
      if (!s[0]) return false
      if (s.includes('fingerprint') && (s.includes(true) || s.includes('enabled') || s.includes('on'))) return true
      return false
    })) {
      try {
        fingerprint = true
        let file = path.join(process.cwd(), 'node_modules', '@architect', 'shared', 'static.json')
        staticManifest = JSON.parse(fs.readFileSync(file))
      }
      catch(e) {
        // It's possible the static file is missing or hasn't been written yet
        fingerprint = false
      }
    }

    // Rewrite the file path with the fingerprinted filename
    if (fingerprint && staticManifest) {
      assetPath = staticManifest[assetPath]
    }

    // Static env var takes precedence if present
    if (process.env.ARC_STATIC_BUCKET) {
      let raw = S3domain(process.env.ARC_STATIC_BUCKET) + assetPath
      return url(raw)
    }
    else {
      let bucket = getBucket(arc.static)
      let raw = S3domain(bucket) + assetPath
      return url(raw)
    }
  }
}

// Helper returns the @static value for the current NODE_ENV
function getBucket(static) {
  let staging
  let production
  static.forEach(thing=> {
    if (thing[0] === 'staging') {
      staging = thing[1]
    }
    if (thing[0] === 'production') {
      production = thing[1]
    }
  })
  if (process.env.NODE_ENV === 'staging')
    return staging
  if (process.env.NODE_ENV === 'production')
    return production
}
