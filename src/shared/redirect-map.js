// redirect known v6 arc urls to v8 and then to v9
const redirects = {
  // tmp until marketing landing page work done
  '/': '/docs/en/guides/get-started/quickstart',

  '/examples': '/docs/en/guides/examples',

  // Intro
  // round 1: Q1 2021
  '/intro/philosophy': '/docs/en/guides/get-started/why-architect',
  '/intro/limits': '/docs/en/guides/get-started/detailed-aws-setup',
  '/intro/community': '/docs/en/about/contribute',

  // Quickstart
  // round 1: Q1 2021
  '/quickstart': '/docs/en/guides/get-started/quickstart',
  '/quickstart/install': '/docs/en/guides/get-started/quickstart',
  '/quickstart/layout': '/docs/en/guides/get-started/project-layout',

  // Primitives
  // round 1: Q1 2021
  '/primitives/http': '/docs/en/reference/app.arc/http',
  '/primitives/ws': '/docs/en/reference/app.arc/ws',
  '/primitives/static': '/docs/en/reference/app.arc/static',
  '/primitives/cdn': '/docs/en/reference/app.arc/static',
  '/primitives/scheduled': '/docs/en/reference/app.arc/scheduled',
  '/primitives/events': '/docs/en/reference/app.arc/events',
  '/primitives/queues': '/docs/en/reference/app.arc/queues',
  '/primitives/tables': '/docs/en/reference/app.arc/tables',
  '/primitives/macros': '/docs/en/reference/app.arc/macros',

  // Guides
  // round 1: Q1 2021
  '/guides/upgrade': '/docs/en/about/upgrade',
  '/guides/testing': '/docs/en/guides/developer-experience/local-development',
  '/guides/project-manifest': '/docs/en/guides/get-started/project-layout',
  '/guides/share-code': '/docs/en/guides/developer-experience/sharing-code',
  '/guides/custom-file-paths': '/docs/en/guides/developer-experience/custom-source-paths',

  // Reference > Project Manifest
  // round 1: Q1 2021
  '/reference/arc/app': '/docs/en/reference/project-manifest/app',
  '/reference/arc/aws': '/docs/en/reference/project-manifest/aws',
  '/reference/arc/events': '/docs/en/reference/project-manifest/events',
  '/reference/arc/http': '/docs/en/reference/project-manifest/http',
  '/reference/arc/indexes': '/docs/en/reference/project-manifest/indexes',
  '/reference/arc/proxy': '/docs/en/reference/project-manifest/proxy',
  '/reference/arc/queues': '/docs/en/reference/project-manifest/queues',
  '/reference/arc/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/reference/arc/static': '/docs/en/reference/project-manifest/static',
  '/reference/arc/tables': '/docs/en/reference/project-manifest/tables',
  '/reference/arc/ws': '/docs/en/reference/project-manifest/ws',
  // round 2: Q4 2021
  '/docs/en/reference/app.arc/app': '/docs/en/reference/project-manifest/app',
  '/docs/en/reference/app.arc/aws': '/docs/en/reference/project-manifest/aws',
  '/docs/en/reference/app.arc/events': '/docs/en/reference/project-manifest/events',
  '/docs/en/reference/app.arc/http': '/docs/en/reference/project-manifest/http',
  '/docs/en/reference/app.arc/indexes': '/docs/en/reference/project-manifest/indexes',
  '/docs/en/reference/app.arc/proxy': '/docs/en/reference/project-manifest/proxy',
  '/docs/en/reference/app.arc/queues': '/docs/en/reference/project-manifest/queues',
  '/docs/en/reference/app.arc/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/docs/en/reference/app.arc/shared': '/docs/en/reference/project-manifest/shared',
  '/docs/en/reference/app.arc/static': '/docs/en/reference/project-manifest/static',
  '/docs/en/reference/app.arc/tables': '/docs/en/reference/project-manifest/tables',
  '/docs/en/reference/app.arc/views': '/docs/en/reference/project-manifest/views',
  '/docs/en/reference/app.arc/ws': '/docs/en/reference/project-manifest/ws',

  // Reference > Configuration > Function config
  // round 1: Q1 2021
  '/reference/arc-config/aws': '/docs/en/reference/configuration/function-config/aws',
  '/reference/arc-config/runtime': '/docs/en/reference/configuration/function-config/runtime',
  '/reference/arc-config/memory': '/docs/en/reference/configuration/function-config/memory',
  '/reference/arc-config/timeout': '/docs/en/reference/configuration/function-config/timeout',
  '/reference/arc-config/concurrency': '/docs/en/reference/configuration/function-config/concurrency',
  '/reference/arc-config/layers': '/docs/en/reference/configuration/function-config/layers',
  '/reference/arc-config/policies': '/docs/en/reference/configuration/function-config/policies',
  // round 2: Q4 2021
  '/docs/en/reference/config.arc/aws': '/docs/en/reference/configuration/function-config/aws',
  '/docs/en/reference/config.arc/runtime': '/docs/en/reference/configuration/function-config/runtime',
  '/docs/en/reference/config.arc/memory': '/docs/en/reference/configuration/function-config/memory',
  '/docs/en/reference/config.arc/timeout': '/docs/en/reference/configuration/function-config/timeout',
  '/docs/en/reference/config.arc/concurrency': '/docs/en/reference/configuration/function-config/concurrency',
  '/docs/en/reference/config.arc/layers': '/docs/en/reference/configuration/function-config/layers',
  '/docs/en/reference/config.arc/policies': '/docs/en/reference/configuration/function-config/policies',
  '/docs/en/reference/config.arc/architecture': '/docs/en/reference/configuration/function-config/architecture',

  // Reference > Configuration > Local preferences
  // round 1: Q1 2021
  '/reference/preferences#create': '/docs/en/reference/configuration/local-preferences/create',
  '/reference/preferences#env': '/docs/en/reference/configuration/local-preferences/env',
  '/reference/preferences#.env': '/docs/en/reference/configuration/local-preferences/.env',
  '/reference/preferences#sandbox': '/docs/en/reference/configuration/local-preferences/sandbox',
  // round 2: Q4 2021
  '/docs/en/reference/prefs.arc/create': '/docs/en/reference/configuration/local-preferences/create',
  '/docs/en/reference/prefs.arc/env': '/docs/en/reference/configuration/local-preferences/env',
  '/docs/en/reference/prefs.arc/.env': '/docs/en/reference/configuration/local-preferences/.env',
  '/docs/en/reference/prefs.arc/sandbox': '/docs/en/reference/configuration/local-preferences/sandbox',
  '/docs/en/reference/prefs.arc/sandbox-startup': '/docs/en/reference/configuration/local-preferences/sandbox-startup',

  // Reference > CLI
  // round 1: Q1 2021
  '/reference/cli/deploy': '/docs/en/reference/cli/deploy',
  '/reference/cli/package': '/docs/en/reference/cli/deploy',
  '/reference/cli/destroy': '/docs/en/reference/cli/destroy',
  '/reference/cli/env': '/docs/en/reference/cli/env',
  '/reference/cli/init': '/docs/en/reference/cli/init',
  '/reference/cli/logs': '/docs/en/reference/cli/logs',
  '/reference/cli/sandbox': '/docs/en/reference/cli/sandbox',
  '/reference/cli/hydrate': '/docs/en/reference/cli/sandbox',
  // round 2: Q4 2021 - no change

  // Reference > Runtime helpers
  // round 1: Q1 2021
  '/reference/functions/events': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/http': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/http/node/async': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/queues': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/static': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/tables': '/docs/en/reference/runtime-helpers/node.js',
  '/reference/functions/ws': '/docs/en/reference/runtime-helpers/node.js',
  // round 2: Q4 2021
  '/docs/en/reference/runtime/node': '/docs/en/reference/runtime-helpers/node.js',
  '/docs/en/reference/runtime/node.js': '/docs/en/reference/runtime-helpers/node.js',
  '/docs/en/reference/runtime/deno': '/docs/en/reference/runtime-helpers/deno',
  '/docs/en/reference/runtime/ruby': '/docs/en/reference/runtime-helpers/ruby',
  '/docs/en/reference/runtime/python': '/docs/en/reference/runtime-helpers/python',
}

module.exports = async function redirect (req) {
  const isGet = req.requestContext.http.method.toLowerCase() === 'get'
  const isPath = Object.keys(redirects).includes(req.requestContext.http.path)

  if (isGet && isPath) {
    return {
      statusCode: 301,
      headers: {
        location: redirects[req.requestContext.http.path]
      }
    }
  }
}
