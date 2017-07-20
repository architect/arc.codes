var arc = require('@architect/functions')
var render = require('@architect/docs')

function index(req, res) {
  res({
    html: render('reference')
  })
}

exports.handler = arc.html.get(index)
