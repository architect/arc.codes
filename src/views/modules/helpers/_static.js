import manifest from '../../../shared/static.json'

export default function _static(asset, options = {}) {
  let key = asset[0] === '/' ? asset.substring(1) : asset
  let isIndex = asset === '/'
  let local = process.env.NODE_ENV === 'testing' || process.env.ARC_LOCAL
  let stagePath = options.stagePath && !local ? '/' + process.env.NODE_ENV : ''
  let path = `${stagePath}/_static`
  if (!local && exists && !isIndex) {
    let pkg = JSON.parse(read(manifest))
    let asset = pkg[key]
    if (!asset)
      throw ReferenceError(`Could not find asset in static.json (asset fingerprint manifest): ${key}`)
    return `${path}/${asset}`
  }
  return `${path}/${isIndex ? '' : key}`
}


