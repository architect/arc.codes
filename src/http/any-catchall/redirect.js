let redirects = {
  // tmp until marketing landing page work done
  "/": "/docs/en/guides/get-started/quickstart",

  // Intro
  "/intro/philosophy": "/docs/en/guides/get-started/why-architect",
  "/intro/limits": "/docs/en/guides/get-started/detailed-aws-setup",
  "/intro/community": "/docs/en/about/contribute",

  // Quickstart
  "/quickstart": "/docs/en/guides/get-started/quickstart",
  "/quickstart/install": "/docs/en/guides/get-started/quickstart",
  "/quickstart/layout": "/docs/en/guides/get-started/project-layout",

  // Primitives
  "/primitives/http": "/docs/en/reference/app.arc/http",
  "/primitives/ws": "/docs/en/reference/app.arc/ws",
  "/primitives/static": "/docs/en/reference/app.arc/static",
  "/primitives/cdn": "/docs/en/reference/app.arc/static",
  "/primitives/scheduled": "/docs/en/reference/app.arc/scheduled",
  "/primitives/events": "/docs/en/reference/app.arc/events",
  "/primitives/queues": "/docs/en/reference/app.arc/queues",
  "/primitives/tables": "/docs/en/reference/app.arc/tables",
  "/primitives/macros": "/docs/en/reference/app.arc/macros",

  // Guides
  "/guides/upgrade": "/docs/en/about/changelog",
  "/guides/testing": "/docs/en/guides/developer-experience/local-development",
  "/guides/project-manifest": "/docs/en/guides/get-started/project-layout",
  "/guides/share-code": "/docs/en/guides/developer-experience/sharing-code",
  "/guides/custom-file-paths": "/docs/en/guides/developer-experience/custom-source-paths",

  // CLI
  "/reference/cli/deploy": "/docs/en/reference/cli/deploy",
  "/reference/cli/destroy": "/docs/en/reference/cli/destroy",
  "/reference/cli/env": "/docs/en/reference/cli/env",
  "/reference/cli/hydrate": "/docs/en/reference/cli/sandbox",
  "/reference/cli/init": "/docs/en/reference/cli/init",
  "/reference/cli/logs": "/docs/en/reference/cli/logs",
  "/reference/cli/package": "/docs/en/reference/cli/deploy",
  "/reference/cli/sandbox": "/docs/en/reference/cli/sandbox",

  "/reference/arc/app": "/docs/en/reference/app.arc/app",
  "/reference/arc/aws": "/docs/en/reference/app.arc/aws",
  "/reference/arc/events": "/docs/en/reference/app.arc/events",
  "/reference/arc/http": "/docs/en/reference/app.arc/http",
  "/reference/arc/indexes": "/docs/en/reference/app.arc/indexes",
  "/reference/arc/proxy": "/docs/en/reference/app.arc/proxy",
  "/reference/arc/queues": "/docs/en/reference/app.arc/queues",
  "/reference/arc/scheduled": "/docs/en/reference/app.arc/scheduled",
  "/reference/arc/static": "/docs/en/reference/app.arc/static",
  "/reference/arc/tables": "/docs/en/reference/app.arc/tables",
  "/reference/arc/ws": "/docs/en/reference/app.arc/ws",

  "/reference/arc-config/aws": "/docs/en/reference/config.arc/aws",
  "/reference/arc-config/runtime": "/docs/en/reference/config.arc/runtime",
  "/reference/arc-config/memory": "/docs/en/reference/config.arc/memory",
  "/reference/arc-config/timeout": "/docs/en/reference/config.arc/timeout",
  "/reference/arc-config/concurrency": "/docs/en/reference/config.arc/concurrency",
  "/reference/arc-config/layers": "/docs/en/reference/config.arc/layers",
  "/reference/arc-config/policies": "/docs/en/reference/config.arc/policies",

  "/reference/preferences#create": "/docs/en/reference/prefs.arc/create",
  "/reference/preferences#env": "/docs/en/reference/prefs.arc/env",
  "/reference/preferences#.env": "/docs/en/reference/prefs.arc/.env",
  "/reference/preferences#sandbox": "/docs/en/reference/prefs.arc/sandbox",

  "/reference/functions/events": "/docs/en/reference/runtime/node",
  "/reference/functions/http": "/docs/en/reference/runtime/node",
  "/reference/functions/http/node/async": "/docs/en/reference/runtime/node",
  "/reference/functions/queues": "/docs/en/reference/runtime/node",
  "/reference/functions/static": "/docs/en/reference/runtime/node",
  "/reference/functions/tables": "/docs/en/reference/runtime/node",
  "/reference/functions/ws": "/docs/en/reference/runtime/node",
}

module.exports = async function redirect(req) {
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
