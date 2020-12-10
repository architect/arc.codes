exports.handler = async function http (req) {
  let body = `
<section>
  <header>
    <h1>Rapidly build serverless web apps</h1>
    <h2>Deploy to your AWS account</h2>
  </header>      
  <p>Architect provides everything you need to build fast, modern, massively scalable cloud apps with low code, clear and terse config, and zero ceremony.</p>
  <pre><code>npm i -g @architect/architect</code></pre>
  <nav>
    <a href=/docs/en/guides/get-started/why-architect?>Why Architect?</a>
    <a href=/docs/en/guides/developer-experience/local-development>Developer experience</a>
    <a href=/docs/en/reference/cli/deploy>Reference</a>
  </nav>
</section>
  `
  return { 
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body 
  }

  return {
    statusCode: 302,
    headers: {
      location: '/docs/en/guides/get-started/quickstart'
    }
  }
}
