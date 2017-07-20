var uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

module.exports = function UUID(v) {
  return uuid.test(v)? true : Error('invalid UUID')
}
