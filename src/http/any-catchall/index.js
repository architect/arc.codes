let { http } = require('@architect/functions')

let redirects = {
  "/": "/docs/en/guides/get-started/quickstart",
  /*
  "/intro/philosophy",
  "/intro/limits",
  "/playground",
  "/intro/community",
  "/quickstart",
  "/quickstart/install",
  "/quickstart/layout",
  "/primitives/http",
  "/primitives/ws",
  "/primitives/static",
  "/primitives/cdn",
  "/primitives/scheduled",
  "/primitives/events",
  "/primitives/queues",
  "/primitives/tables",
  "/primitives/macros",
  "/guides/upgrade",
  "/guides/testing",
  "/guides/project-manifest",
  "/guides/share-code",
  "/guides/custom-file-paths",
  "/reference/cli/deploy",
  "/reference/cli/destroy",
  "/reference/cli/env",
  "/reference/cli/hydrate",
  "/reference/cli/init",
  "/reference/cli/logs",
  "/reference/cli/package",
  "/reference/cli/sandbox",
  "/reference/arc/app",
  "/reference/arc/aws",
  "/reference/arc/events",
  "/reference/arc/http",
  "/reference/arc/indexes",
  "/reference/arc/proxy",
  "/reference/arc/queues",
  "/reference/arc/scheduled",
  "/reference/arc/static",
  "/reference/arc/tables",
  "/reference/arc/ws",
  "/reference/arc-config/aws",
  "/reference/arc-config/runtime",
  "/reference/arc-config/memory",
  "/reference/arc-config/timeout",
  "/reference/arc-config/concurrency",
  "/reference/arc-config/layers",
  "/reference/arc-config/policies",
  "/reference/preferences#create",
  "/reference/preferences#env",
  "/reference/preferences#.env",
  "/reference/preferences#sandbox",
  "/reference/functions/events",
  "/reference/functions/http",
  "/reference/functions/http/node/async",
  "/reference/functions/queues",
  "/reference/functions/static",
  "/reference/functions/tables",
  "/reference/functions/ws",
  "/reference/arc/aws"
  */
}

async function redirect(req) {
  let isGet = req.requestContext.http.method.toLowerCase() === 'get'
  let isPath = Object.keys(redirects).includes(req.requestContext.http.path)
  if (isGet && isPath) {
    return {
      statusCode: 301,
      headers: { 
        location: redirects[req.requestContext.http.path] 
      }
    }
  }
}

// redirect to new urls; otherwise render static assets in ./public
exports.handler = http.async(redirect, http.proxy.public({spa: false}))
