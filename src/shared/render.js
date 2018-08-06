var fs = require('fs')
var md = require('marked')
var read = fs.readFileSync
var exists = fs.existsSync
var join = require('path').join
var ledger = {}

/**
 * slowest possible impl
 *   but it was still fast enough
 *     caching helped too
 *       think the next version should be arc middleware
 */
module.exports = function render (filename) {
  var cached = ledger.hasOwnProperty(filename)
  if (!cached) {
    // TODO figure out lang and platform switcher logic
    var path = join(__dirname, 'en', 'aws', `${filename}.md`)

    if (exists(path)) {
      var title = 'arc'
      var style = read(join(__dirname, 'style.css')).toString()
      var nav = read(join(__dirname, 'en', 'aws', '_nav.md')).toString()
      var body = read(path).toString()

      // Logos
      var github = read(join(__dirname, 'images/github.svg')).toString()
      var pink = read(join(__dirname, 'images/logo-black.svg')).toString()
      var green = read(join(__dirname, 'images/logo-white-green.svg')).toString()
      var logo = ''//(filename === 'index') ? `<h2 class=logo>${pink}</h2>` : ''
      var classes = (!logo) ? '' : 'home'
      ledger[filename] = `
        <html>
        <head>
          <title>${title}</title>
          <meta charset=UTF-8>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" type="text/css">
          <link rel="icon" type="image/png" sizes="32x32" href="https://s3-us-west-2.amazonaws.com/arc.codes/favicon-32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="https://s3-us-west-2.amazonaws.com/arc.codes/favicon-16.png">
          <link rel="icon" type="image/png" sizes="64x64" href="https://s3-us-west-2.amazonaws.com/arc.codes/favicon-64.png">
          <style type=text/css>${style}</style>
        </head>
        <body class="${classes}">
        <section class=main>
        <section class="nav">
          <h1 id=nav-logo-main class=logo><a href="/">${green}</a></h1>
          <button class=nav-toggle><span class="ir">Toggle Navigation</span></button>
          <nav>${md(nav)}</nav>
        </section>
          <section class=content><div class=inner>${logo}${md(body)}</div></section>
          <footer class=footer></footer>
        </section>
        <script src=https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js></script>
        <a href="https://github.com/arc-repos" class="github-corner" aria-label="View source on Github">${github}</a>
        <style type="text/css">.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
        <script type="text/javascript">
          (function() {
            var body = document.querySelector('body');
            var toggle = document.querySelector('.nav-toggle');
            toggle.addEventListener('click', function () {
              console.log('hello', body.className.indexOf('nav-open'));
              if (body.className.indexOf('nav-open') >= 0) {
                body.classList.remove('nav-open');
              } else {
                body.classList.add('nav-open');
              }
            });

            // cheesy selected nav hack
            document.querySelector(\`li a[href="\${location.pathname}"]\`).style.color = '#00ff63'
            document.querySelector(\`li a[href="\${location.pathname}"] code\`).style.color = '#00ff63'
          })();
        </script>
        <script type="text/javascript">
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-74655805-3', 'auto');ga('send', 'pageview');
        </script>
        </body>
        </html>
      `
    } else {
      ledger[filename] = '' // TODO empty str means 404
    }
  }
  return ledger[filename]
}
