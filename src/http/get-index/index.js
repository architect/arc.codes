let arc = require('./fun')
let layout = require('./layout')

let alias = {
  '/':                                 '/index.md',
  '/intro/philosophy':                 '/intro/philosophy.md',
  '/intro/limits':                     '/intro/limits.md',
  '/intro/playground':                 '/intro/playground.md',
  '/intro/community':                  '/intro/community.md',
  '/quickstart':                       '/quickstart/index.md',
  '/quickstart/install':               '/quickstart/install.md',
  '/quickstart/layout':                '/quickstart/layout.md',
  '/primitives/http':                  '/primitives/http.md',
  '/primitives/static':                '/primitives/static.md',
  '/primitives/ws':                    '/primitives/ws.md',
  '/primitives/scheduled':             '/primitives/scheduled.md',
  '/primitives/events':                '/primitives/events.md',
  '/primitives/queues':                '/primitives/queues.md',
  '/primitives/tables':                '/primitives/tables.md',
  '/guides/testing':                   '/guides/testing.md',
  '/guides/upgrade':                   '/guides/upgrade.md',
  '/reference/cli/deploy':             '/reference/cli/deploy.md',
  '/reference/cli/env':                '/reference/cli/env.md',
  '/reference/cli/help':               '/reference/cli/help.md',
  '/reference/cli/hydrate':            '/reference/cli/hydrate.md',
  '/reference/cli/init':               '/reference/cli/init.md',
  '/reference/cli/logs':               '/reference/cli/logs.md',
  '/reference/cli/package':            '/reference/cli/package.md',
  '/reference/cli/sandbox':            '/reference/cli/sandbox.md',
  '/reference/cli/repl':               '/reference/cli/repl.md',
  '/reference/cli/version':            '/reference/cli/version.md',
  '/reference/functions/events':       '/reference/functions/events.md',
  '/reference/functions/http':         '/reference/functions/http.md',
  '/reference/functions/queues':       '/reference/functions/queues.md',
  '/reference/functions/static':       '/reference/functions/static.md',
  '/reference/functions/tables':       '/reference/functions/tables.md',
  '/reference/functions/ws':           '/reference/functions/ws.md',
  '/reference/arc/app':                '/reference/arc/app.md',
  '/reference/arc/aws':                '/reference/arc/aws.md',
  '/reference/arc/events':             '/reference/arc/events.md',
  '/reference/arc/http':               '/reference/arc/http.md',
  '/reference/arc/indexes':            '/reference/arc/indexes.md',
  '/reference/arc/queues':             '/reference/arc/queues.md',
  '/reference/arc/scheduled':          '/reference/arc/scheduled.md',
  '/reference/arc/static':             '/reference/arc/static.md',
  '/reference/arc/tables':             '/reference/arc/tables.md',
  '/reference/arc/ws':                 '/reference/arc/ws.md',
  '/reference/arc-config/aws':         '/reference/arc-config/aws.md',
  '/reference/arc-config/timeout':     '/reference/arc-config/timeout.md',
  '/reference/arc-config/memory':      '/reference/arc-config/memory.md',
  '/reference/arc-config/concurrency': '/reference/arc-config/concurrency.md',
  '/reference/arc-config/policies':    '/reference/arc-config/policies.md',
  '/reference/arc-config/layers':      '/reference/arc-config/layers.md',
}

let plugins = {
  md: [
    '@architect/proxy-plugin-md',
    layout,
    '@architect/proxy-plugin-html-urls',
  ]
}

exports.handler = arc.http.proxy.public({alias, plugins})
