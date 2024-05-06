export const currentRoot = '/docs/en/get-started/quickstart'

// these are soft redirects, not forever/canonical
export const tempRedirects = {
  // Canonical pragma paths
  '/app': '/docs/en/reference/project-manifest/app',
  '/@app': '/docs/en/reference/project-manifest/app',
  '/aws': '/docs/en/reference/project-manifest/aws',
  '/@aws': '/docs/en/reference/project-manifest/aws',
  '/events': '/docs/en/reference/project-manifest/events',
  '/@events': '/docs/en/reference/project-manifest/events',
  '/http': '/docs/en/reference/project-manifest/http',
  '/@http': '/docs/en/reference/project-manifest/http',
  '/indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/@indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/macros': '/docs/en/reference/project-manifest/macros',
  '/@macros': '/docs/en/reference/project-manifest/macros',
  '/plugins': '/docs/en/reference/project-manifest/plugins',
  '/@plugins': '/docs/en/reference/project-manifest/plugins',
  '/proxy': '/docs/en/reference/project-manifest/proxy',
  '/@proxy': '/docs/en/reference/project-manifest/proxy',
  '/queues': '/docs/en/reference/project-manifest/queues',
  '/@queues': '/docs/en/reference/project-manifest/queues',
  '/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/@scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/shared': '/docs/en/reference/project-manifest/shared',
  '/@shared': '/docs/en/reference/project-manifest/shared',
  '/static': '/docs/en/reference/project-manifest/static',
  '/@static': '/docs/en/reference/project-manifest/static',
  '/tables': '/docs/en/reference/project-manifest/tables',
  '/@tables': '/docs/en/reference/project-manifest/tables',
  '/tables-indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/@tables-indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/tables-streams': '/docs/en/reference/project-manifest/tables-streams',
  '/@tables-streams': '/docs/en/reference/project-manifest/tables-streams',
  '/views': '/docs/en/reference/project-manifest/views',
  '/@views': '/docs/en/reference/project-manifest/views',
  '/ws': '/docs/en/reference/project-manifest/ws',
  '/@ws': '/docs/en/reference/project-manifest/ws',

  // Runtimes
  '/node': '/docs/en/reference/runtime-helpers/node.js',
  '/ruby': '/docs/en/reference/runtime-helpers/ruby',
  '/python': '/docs/en/reference/runtime-helpers/python',
  '/deno': '/docs/en/reference/runtime-helpers/deno',

  // Other aliases
  '/typescript': '/docs/en/guides/developer-experience/using-typescript',
  '/esm': '/docs/en/guides/developer-experience/using-esm',
  '/aws-sdk-versions': '/docs/en/get-started/detailed-aws-setup#aws-sdk',
}

// redirect known v5/6 arc urls to v8 and then to v9
export const permanentRedirects = {
  '/examples': '/docs/en/guides/examples',

  // Intro
  // round 1: Q1 2021
  '/intro/philosophy': '/docs/en/get-started/why-architect',
  '/intro/limits': '/docs/en/get-started/detailed-aws-setup',
  '/intro/community': '/docs/en/about/contribute',

  // Quickstart
  // round 1: Q1 2021
  '/quickstart': '/docs/en/get-started/quickstart',
  '/quickstart/install': '/docs/en/get-started/quickstart',
  '/quickstart/layout': '/docs/en/get-started/project-manifest',
  '/quickstart/what-next': '/docs/en/get-started/quickstart',

  // Primitives
  // round 1: Q1 2021
  '/primitives/http': '/docs/en/reference/project-manifest/http',
  '/primitives/ws': '/docs/en/reference/project-manifest/ws',
  '/primitives/static': '/docs/en/reference/project-manifest/static',
  '/primitives/cdn': '/docs/en/reference/project-manifest/static',
  '/primitives/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/primitives/events': '/docs/en/reference/project-manifest/events',
  '/primitives/queues': '/docs/en/reference/project-manifest/queues',
  '/primitives/tables': '/docs/en/reference/project-manifest/tables',
  '/primitives/macros': '/docs/en/reference/project-manifest/macros',

  // Guides
  // round 1: Q1 2021
  '/guides/upgrade': '/docs/en/about/upgrade-guide',
  '/guides/testing': '/docs/en/guides/developer-experience/local-development',
  '/guides/project-manifest': '/docs/en/get-started/project-manifest',
  '/guides/share-code': '/docs/en/guides/developer-experience/sharing-code',
  '/guides/sharing-common-code': '/docs/en/guides/developer-experience/sharing-code',
  '/guides/custom-file-paths': '/docs/en/guides/developer-experience/custom-source-paths',
  // round 2: Q4 2021
  '/docs/en/guides/get-started/why-architect': '/docs/en/get-started/why-architect',
  '/docs/en/guides/get-started/quickstart': '/docs/en/get-started/quickstart',
  '/docs/en/guides/get-started/project-layout': '/docs/en/get-started/project-manifest',
  '/docs/en/guides/get-started/detailed-aws-setup': '/docs/en/get-started/detailed-aws-setup',
  '/docs/en/guides/extend/custom-cloudformation': '/docs/en/guides/developer-experience/custom-cloudformation',
  // mid-2022
  '/docs/en/guides/developer-experience/customizing-cloudformation': '/docs/en/guides/developer-experience/custom-cloudformation',

  // Reference > Project Manifest
  // round 1: Q1 2021
  '/reference/arc/app': '/docs/en/reference/project-manifest/app',
  '/reference/arc/aws': '/docs/en/reference/project-manifest/aws',
  '/reference/arc/events': '/docs/en/reference/project-manifest/events',
  '/reference/arc/http': '/docs/en/reference/project-manifest/http',
  '/reference/arc/indexes': '/docs/en/reference/project-manifest/tables-indexes',
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
  '/docs/en/reference/app.arc/indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/docs/en/reference/app.arc/proxy': '/docs/en/reference/project-manifest/proxy',
  '/docs/en/reference/app.arc/queues': '/docs/en/reference/project-manifest/queues',
  '/docs/en/reference/app.arc/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/docs/en/reference/app.arc/shared': '/docs/en/reference/project-manifest/shared',
  '/docs/en/reference/app.arc/static': '/docs/en/reference/project-manifest/static',
  '/docs/en/reference/app.arc/tables': '/docs/en/reference/project-manifest/tables',
  '/docs/en/reference/app.arc/views': '/docs/en/reference/project-manifest/views',
  '/docs/en/reference/app.arc/ws': '/docs/en/reference/project-manifest/ws',
  // rename @indexes => @tables-indexes
  '/docs/en/reference/project-manifest/indexes': '/docs/en/reference/project-manifest/tables-indexes',

  // Reference > Configuration > Function config
  // round 1: Q1 2021
  '/reference/arc-config/aws': '/docs/en/reference/configuration/function-config',
  '/reference/arc-config/runtime': '/docs/en/reference/configuration/function-config#runtime',
  '/reference/arc-config/memory': '/docs/en/reference/configuration/function-config#memory',
  '/reference/arc-config/timeout': '/docs/en/reference/configuration/function-config#timeout',
  '/reference/arc-config/concurrency': '/docs/en/reference/configuration/function-config#concurrency',
  '/reference/arc-config/layers': '/docs/en/reference/configuration/function-config#layers',
  '/reference/arc-config/policies': '/docs/en/reference/configuration/function-config#policies',
  // round 2: Q4 2021
  '/docs/en/reference/config.arc/aws': '/docs/en/reference/configuration/function-config',
  '/docs/en/reference/config.arc/runtime': '/docs/en/reference/configuration/function-config#runtime',
  '/docs/en/reference/config.arc/memory': '/docs/en/reference/configuration/function-config#memory',
  '/docs/en/reference/config.arc/timeout': '/docs/en/reference/configuration/function-config#timeout',
  '/docs/en/reference/config.arc/concurrency': '/docs/en/reference/configuration/function-config#concurrency',
  '/docs/en/reference/config.arc/layers': '/docs/en/reference/configuration/function-config#layers',
  '/docs/en/reference/config.arc/policies': '/docs/en/reference/configuration/function-config#policies',
  '/docs/en/reference/config.arc/architecture': '/docs/en/reference/configuration/function-config#architecture',

  // Reference > Configuration > Local preferences
  // round 1: Q1 2021
  '/reference/preferences#create': '/docs/en/reference/configuration/local-preferences#@create',
  '/reference/preferences#env': '/docs/en/reference/configuration/local-preferences#@env',
  '/reference/preferences#.env': '/docs/en/reference/configuration/local-preferences#@env',
  '/reference/preferences#sandbox': '/docs/en/reference/configuration/local-preferences#@sandbox',
  // round 2: Q4 2021
  '/docs/en/reference/prefs.arc/create': '/docs/en/reference/configuration/local-preferences#@create',
  '/docs/en/reference/prefs.arc/env': '/docs/en/reference/configuration/local-preferences#@env',
  '/docs/en/reference/prefs.arc/.env': '/docs/en/reference/configuration/local-preferences#@env',
  '/docs/en/reference/prefs.arc/sandbox': '/docs/en/reference/configuration/local-preferences#@sandbox',
  '/docs/en/reference/prefs.arc/sandbox-startup': '/docs/en/reference/configuration/local-preferences#@sandbox-start',

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

  // v5 and v6 archive
  // round 1 addendum
  // TODO: revisit these as new guides and tutorials are added
  '/guides/http': '/docs/en/reference/runtime-helpers/node.js#arc.http',
  '/guides/offline': '/docs/en/guides/developer-experience/local-development',
  '/guides/static-assets': '/docs/en/guides/frontend/static-assets',
  '/guides/spa': '/docs/en/reference/runtime-helpers/node.js#@architect/asap',
  '/guides/sessions': '/docs/en/reference/runtime-helpers/node.js#arc.http.session',
  '/guides/middleware': '/docs/en/reference/runtime-helpers/node.js#arc.http',
  '/guides/data': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/guides/background-tasks': '/docs/en/reference/runtime-helpers/node.js#arc.events',
  '/guides/cors': '/docs/en/reference/runtime-helpers/node.js#responses',
  '/guides/logging': '/docs/en/guides/developer-experience/logging-and-monitoring',
  '/guides/custom-dns': '/docs/en/guides/domains/overview',
  '/guides/ws': '/docs/en/reference/runtime-helpers/node.js#arc.ws',
  '/guides/documentdb': currentRoot,
  '/guides/multiple-aws-accounts': '/docs/en/get-started/detailed-aws-setup',
  '/guides/iam': '/docs/en/get-started/detailed-aws-setup',
  '/guides/yaml-and-json': '/docs/en/get-started/project-manifest',
  '/guides/deps': '/docs/en/guides/developer-experience/dependency-management',
  '/reference/arc-audit': currentRoot,
  '/reference/arc-config': currentRoot,
  '/reference/arc-create': '/docs/en/reference/cli/init',
  '/reference/arc-deploy': '/docs/en/reference/cli/deploy',
  '/reference/arc-dns': currentRoot,
  '/reference/arc-env': '/docs/en/reference/cli/env',
  '/reference/arc-hydrate': '/docs/en/reference/cli/hydrate',
  '/reference/arc-inventory': currentRoot,
  '/reference/arc-logs': '/docs/en/reference/cli/logs',
  '/reference/arc-repl': currentRoot,
  '/reference/arc-sandbox': '/docs/en/reference/cli/sandbox',
  '/reference/app': '/docs/en/reference/project-manifest/app',
  '/reference/aws': '/docs/en/reference/project-manifest/aws',
  '/reference/domain': currentRoot,
  '/reference/events': '/docs/en/reference/project-manifest/events',
  '/reference/http': '/docs/en/reference/project-manifest/http',
  '/reference/indexes': '/docs/en/reference/project-manifest/tables-indexes',
  '/reference/queues': '/docs/en/reference/project-manifest/queues',
  '/reference/scheduled': '/docs/en/reference/project-manifest/scheduled',
  '/reference/static': '/docs/en/reference/project-manifest/static',
  '/reference/tables': '/docs/en/reference/project-manifest/tables',
  '/reference/ws': '/docs/en/reference/project-manifest/ws',
  '/reference/events-publish': '/docs/en/reference/runtime-helpers/node.js#arc.events',
  '/reference/events-subscribe': '/docs/en/reference/runtime-helpers/node.js#arc.events',
  '/reference/http-functions': '/docs/en/reference/runtime-helpers/node.js#arc.http',
  '/reference/http-helpers': '/docs/en/reference/runtime-helpers/node.js#arc.http',
  '/reference/http-session': '/docs/en/reference/runtime-helpers/node.js#arc.http.session',
  '/reference/middleware': '/docs/en/reference/runtime-helpers/node.js#arc.http',
  '/reference/proxy-public': '/docs/en/reference/runtime-helpers/node.js#@architect/Fasap',
  '/reference/proxy-read': '/docs/en/reference/runtime-helpers/node.js#@architect/Fasap',
  '/reference/queues-publish': '/docs/en/reference/runtime-helpers/node.js#arc.queues',
  '/reference/queues-subscribe': '/docs/en/reference/runtime-helpers/node.js#arc.queues',
  '/reference/tables-destroy': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/tables-insert': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/tables-update': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/ws-functions': '/docs/en/reference/runtime-helpers/node.js#arc.ws',
  '/reference/data': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-name': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-db': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-doc': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-get': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-query': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-scan': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-put': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-update': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
  '/reference/data-delete': '/docs/en/reference/runtime-helpers/node.js#arc.tables',
}

export async function redirect (req) {
  const reqPath = req.requestContext.http.path
  const isGet = req.requestContext.http.method.toLowerCase() === 'get'

  if (isGet && (tempRedirects[reqPath] || permanentRedirects[reqPath])) {
    const env = process.env.ARC_ENV
    const url = (stage, path) => `https://${stage}arc.codes${path}`

    let location = tempRedirects[reqPath] || permanentRedirects[reqPath]
    if (env === 'staging') location = url('staging.', location)
    if (env === 'production') location = url('', location)

    return {
      statusCode: tempRedirects[reqPath] ? 302 : 301,
      headers: {
        location
      }
    }
  }
  return
}
