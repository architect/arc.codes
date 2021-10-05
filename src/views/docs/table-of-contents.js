let Guides = [
  {
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
      'Using TypeScript',
    ],
    'Frontend': [
      'Static assets', // fingerprint, ignore, folder, link to cdn
      // TODO 'HTTP functions', //inc cors
      // TODO 'Sessions',
      // TODO 'Middleware',
      // TODO 'WebSockets functions',
    ],
    'Domains': [
      'Overview',
      {
        'Registrars': [
          'Route53',
          'Route53 & CloudFront',
          'Dreamhost',
          'GoDaddy',
          'Namecheap',
          'One'
        ]
      }
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
      // TODO 'Migrate legacy code', // @proxy, arc.http.express
      'Custom CloudFormation',
      'Plugins',
      // TODO 'Add a custom domain',
      // TODO 'Ejecting',
    ]
  },
  'Examples'
]

let Reference = [ {
  'Runtime': [
    'Node.js',
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
    'architecture',
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
  'Upgrade guide',
  'Playground',
]

module.exports = {
  Guides,
  Reference,
  About
}
