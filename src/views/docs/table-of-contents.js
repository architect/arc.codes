let Guides = [ {
  'Get started': [
    'Why Architect?',
    'Quickstart',
    'Project layout',
    'Detailed AWS setup',
  ],
  'Developer experience': [
    'Local development', // preview, debug and test
    'Dependency management',
    'Sharing code', // src/shared and src/views
    'Custom source paths',
    'Deployment',
    'Logging & monitoring', // cloudwatch
  ],
  /* TODO
  'Frontend': [
    'Static assets', // fingerprint, ignore, folder, link to cdn
    'HTTP functions', //
    'Sessions',
    'Middleware',
    'WebSockets functions',
  ],
  'Backend': [
    'Database tables & indexes',
    'Database stream functions',
    'Event functions',
    'Queue functions',
    'Scheduled functions',
  ],
  'Extend': [
    'Migrate legacy code',// @proxy, arc.http.express
    'Custom CloudFormation',
    'Add a custom domain',
    'Eject to SAM'
  ]*/
} ]

let Reference = [ {
  'Runtime': [
    'Node',
    'Deno',
    'Ruby',
    'Python'
  ],
  'CLI': [
    'deploy',
    'destroy',
    'env',
    'init',
    'logs',
    'sandbox',
  ],
  'app.arc': [
    '@app',
    '@aws',
    '@events',
    '@http',
    '@indexes',
    '@macros',
    '@proxy',
    '@queues',
    '@scheduled',
    '@shared',
    '@static',
    '@tables',
    '@views',
    '@ws'
  ],
  'config.arc': [
    '@aws',
    'runtime',
    'memory',
    'timeout',
    'concurrency',
    'layers',
    'policies',
  ],
  'prefs.arc': [
    '@create',
    '@env',
    '.env',
    '@sandbox'
  ]
} ]

let About = [
  'Mission',
  'Community',
  'Contribute',
  'Changelog',
  'Playground',
]

module.exports = {
  Guides,
  Reference,
  About
}

