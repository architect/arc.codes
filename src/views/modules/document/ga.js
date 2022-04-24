export default function GoogleAnalytics () {
  const env = process.env.ARC_ENV
  const production = 'production'
  const productionId = 'UA-74655805-3'
  const stagingId = 'G-22723SKNK4'

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
