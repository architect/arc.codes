module.exports = function removeComments(text) {
  return text.trim().replace(/\#.*/g, '').trim()
}
