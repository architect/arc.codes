module.exports = function Email(v) {
  var exp = new RegExp(/.+\@.+\..+/)
  return exp.test(v)? true : Error('invalid email address')
}
