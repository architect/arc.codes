module.exports = function getSections(text) {
  if (!text.startsWith('@')) {
    throw Error('arc file must have at least one opening section')
  }
  var sections = text.split('@').filter(Boolean)
  return sections.map(c=> c.split('\n').filter(Boolean).map(s=>s.trimRight()))
}
