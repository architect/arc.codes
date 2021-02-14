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
  'Frontend': [
    'Static assets', // fingerprint, ignore, folder, link to cdn
    // TODO 'HTTP functions', //inc cors
    // TODO 'Sessions',
    // TODO 'Middleware',
    // TODO 'WebSockets functions',
  ],
  'Domains': [
    'Start here',
    'Route 53',
    // 'Cloudflare',
    'Dreamhost',
    'Godaddy',
    'One',
    'Namecheap'
  ],
  /* TODO
  'Backend': [
    'Database tables & indexes',
    'Database stream functions',
    'Event functions',
    'Queue functions',
    'Scheduled functions',
  ],*/
  'Extend': [
    //TODO'Migrate legacy code',// @proxy, arc.http.express
    'Custom CloudFormation',
    //TODO'Add a custom domain',
    //TODO'Ejecting '
  ]
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
    '@sandbox',
    '@sandbox-startup'
  ]
} ]

let About = [
  'Mission',
  'Community',
  'Contribute',
  'Upgrade',
  'Playground',
]

module.exports = {
  Guides,
  Reference,
  About
}

