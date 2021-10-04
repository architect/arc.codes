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
  'Project manifest': [
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
  'Configuration': [
    {
      'Function config': [
        '@aws',
        'runtime',
        'memory',
        'timeout',
        'concurrency',
        'layers',
        'policies',
        'architecture',
      ]
    },
    {
      'Local Preferences': [
        '@create',
        '@env',
        '.env',
        '@sandbox',
        '@sandbox-startup'
      ]
    }
  ],
  'CLI': [
    'deploy',
    'destroy',
    'env',
    'init',
    'logs',
    'sandbox',
  ],
  'Runtime helpers': [
    'Node.js',
    'Deno',
    'Ruby',
    'Python'
  ],
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
