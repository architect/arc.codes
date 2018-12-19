var arc = require('@architect/functions')
var render = require('@architect/shared/render')

function index(req, res) {
  res({
    html: render('index')
  })
}

exports.handler = arc.html.get(index)
