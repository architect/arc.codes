/**
 * transform reduces {headers, body} with given plugins
 *
 * @param args - arguments obj
 * @param args.Key - the origin S3 bucket Key requested
 * @param args.config - the entire arc.proxy.public config obj
 * @param args.defaults - the default {headers, body} in the transform pipeline
 */
module.exports = function transform({Key, config, defaults}) {
  let filetype = Key.split('.').pop()
  let plugins = config.plugins? config.plugins[filetype] || [] : []
  // early return if there's no processing to do
  if (plugins.length === 0)
    return defaults
  // otherwise walk the supplied plugins
  return plugins.reduce(function run(response, plugin) {
    /* eslint global-require: 'off' */
    let transformer = typeof plugin === 'function'? plugin: require(plugin)
    return transformer(Key, response, config)
  }, defaults)
}
