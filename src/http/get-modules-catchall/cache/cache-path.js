const { join } = require('path')

module.exports = function cachePath (filename) {
  return join(process.cwd(), 'node_modules', '@architect', 'views', 'modules', filename)
}
