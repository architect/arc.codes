module.exports = function DateRange(v) {
  // expects a string 'YYYY/MM/DD-YYYY/MM/DD'
  var exp = /(\d+\/\d{2}\/\d{2})-(\d+\/\d{2}\/\d{2})/

  // implement min and max on the type
  DateRange.min = function min(min, actual) {
    var matches = actual.match(exp)
    var start = matches[1] // get the first date
    min = new Date(min)
    start = new Date(start)
    return min <= start
  }

  DateRange.max = function max(max, actual) {
    var matches = actual.match(exp)
    var end = matches[2] // get the second date
    max = new Date(max)
    end = new Date(end)
    return max >= end
  }

  return exp.test(v)? true : Error('invalid DateRange')
}
