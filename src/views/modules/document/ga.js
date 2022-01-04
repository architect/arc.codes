export default function GoogleAnalytics () {
  let env = process.env.NODE_ENV
  let production = 'production'
  let productionId = 'UA-74655805-3'
  let stagingId = 'G-22723SKNK4'

  function snippet (env) {
    return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${env}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${env}');
    </script>
        `
  }

  return snippet(env == production ? productionId : stagingId)

}
