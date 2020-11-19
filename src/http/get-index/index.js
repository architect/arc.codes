let arc = require('@architect/functions')
let layout = require('./layout')

let alias = {
  '/': '/index.md',

  // Intro
  '/intro/philosophy': '/intro/philosophy.md',
  '/intro/limits':     '/intro/limits.md',
  '/intro/community':  '/intro/community.md',

  // Quickstart
  '/quickstart':         '/quickstart/index.md',
  '/quickstart/install': '/quickstart/install.md',
  '/quickstart/layout':  '/quickstart/layout.md',

  // Primitives
  '/primitives/static':    '/primitives/static.md',
  '/primitives/cdn':       '/primitives/cdn.md',
  '/primitives/http':      '/primitives/http.md',
  '/primitives/ws':        '/primitives/ws.md',
  '/primitives/scheduled': '/primitives/scheduled.md',
  '/primitives/events':    '/primitives/events.md',
  '/primitives/queues':    '/primitives/queues.md',
  '/primitives/tables':    '/primitives/tables.md',
  '/primitives/macros':    '/primitives/macros.md',

  // Guides
  '/guides/testing': '/guides/testing.md',
  '/guides/upgrade': '/guides/upgrade.md',
  '/guides/project-manifest': '/guides/project-manifest.md',
  '/guides/share-code': '/guides/share-code.md',

  // Reference
  '/reference/cli/deploy':  '/reference/cli/deploy.md',
  '/reference/cli/env':     '/reference/cli/env.md',
  '/reference/cli/help':    '/reference/cli/help.md',
  '/reference/cli/hydrate': '/reference/cli/hydrate.md',
  '/reference/cli/init':    '/reference/cli/init.md',
  '/reference/cli/logs':    '/reference/cli/logs.md',
  '/reference/cli/package': '/reference/cli/package.md',
  '/reference/cli/sandbox': '/reference/cli/sandbox.md',
  '/reference/cli/version': '/reference/cli/version.md',

  // Runtime helpers
  '/reference/functions/events':               '/reference/functions/events.md',
  '/reference/functions/http':                 '/reference/functions/http/index.md',
  '/reference/functions/http/node/classic':    '/reference/functions/http/node/classic.md',
  '/reference/functions/http/node/helpers':    '/reference/functions/http/node/helpers.md',
  '/reference/functions/http/node/async':      '/reference/functions/http/node/async.md',
  '/reference/functions/http/node/proxy':      '/reference/functions/http/node/proxy.md',
  '/reference/functions/http/node/session':    '/reference/functions/http/node/session.md',
  '/reference/functions/http/ruby/session':    '/reference/functions/http/ruby/session.md',
  '/reference/functions/http/python/session':  '/reference/functions/http/python/session.md',
  '/reference/functions/queues':               '/reference/functions/queues.md',
  '/reference/functions/static':               '/reference/functions/static.md',
  '/reference/functions/tables':               '/reference/functions/tables/index.md',
  '/reference/functions/tables/node':          '/reference/functions/tables/node.md',
  '/reference/functions/tables/ruby':          '/reference/functions/tables/ruby.md',
  '/reference/functions/tables/python':        '/reference/functions/tables/python.md',
  '/reference/functions/ws':                   '/reference/functions/ws.md',

  // app.arc
  '/reference/arc/app':       '/reference/arc/app.md',
  '/reference/arc/aws':       '/reference/arc/aws.md',
  '/reference/arc/events':    '/reference/arc/events.md',
  '/reference/arc/http':      '/reference/arc/http.md',
  '/reference/arc/indexes':   '/reference/arc/indexes.md',
  '/reference/arc/proxy':   '/reference/arc/proxy.md',
  '/reference/arc/queues':    '/reference/arc/queues.md',
  '/reference/arc/scheduled': '/reference/arc/scheduled.md',
  '/reference/arc/static':    '/reference/arc/static.md',
  '/reference/arc/tables':    '/reference/arc/tables.md',
  '/reference/arc/ws':        '/reference/arc/ws.md',

  // .arc-config
  '/reference/arc-config/aws':         '/reference/arc-config/index.md',
  '/reference/arc-config/runtime':     '/reference/arc-config/index.md',
  '/reference/arc-config/memory':      '/reference/arc-config/index.md',
  '/reference/arc-config/timeout':     '/reference/arc-config/index.md',
  '/reference/arc-config/concurrency': '/reference/arc-config/index.md',
  '/reference/arc-config/layers':      '/reference/arc-config/index.md',
  '/reference/arc-config/policies':    '/reference/arc-config/index.md',
  '/reference/pref-arc/testing':        '/reference/pref-arc/index.md',
  '/reference/pref-arc/staging':        '/reference/pref-arc/index.md',
  '/reference/pref-arc/production':     '/reference/pref-arc/index.md',
}

let plugins = {
  md: [
    '@architect/proxy-plugin-md',
    layout
  ]
}

exports.handler = arc.http.proxy.public({ alias, plugins })
