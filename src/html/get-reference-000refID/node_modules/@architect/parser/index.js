var removeComments = require('./_remove-comments')
var getSections = require('./_get-sections')
var parseSection = require('./_parse-section')

module.exports = function parseArcFile(text) {
  if (!text) throw Error('missing text')
  var clean = removeComments(text)
  var parts = getSections(clean).map(parseSection)
  return parts.reduce((a,b)=> Object.assign({}, a, b))
}
