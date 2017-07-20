var fs = require('fs')
var md = require('marked')
var read = fs.readFileSync
var exists = fs.existsSync
var join = require('path').join
var ledger = {}

module.exports = function render(filename) {

  var cached = ledger.hasOwnProperty(filename)
  if (!cached) {
    // TODO figure out lang and platform switcher logic
    var path = join(__dirname, 'en', 'aws', `${filename}.md`)

    if (exists(path)) {

      var title = 'arc'
      var style = read(join(__dirname, 'style.css')).toString()
      var nav = read(join(__dirname, 'en', 'aws', '_nav.md')).toString()
      var body = read(path).toString()

      ledger[filename] = `
        <html>
        <head>
          <title>${title}</title>
          <meta name=viewport content=width=device-width,initial-scale=1>
          <style type=text/css>${style}</style>
        </head>
        <body>
        <section>
          <header>
            <nav>${md(nav)}</nav>
          </header>
          <section class=content>${md(body)}</section>
          <footer></footer>
        </section>
        <script src=https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js></script>
        </body>
        </html>
      `
    }
    else {
      ledger[filename] = '' // TODO empty str means 404
    }
  }
  return ledger[filename] 
}
