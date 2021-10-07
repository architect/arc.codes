let Guides = [
  {
    'Get started': [
      'Why Architect?',
      'Quickstart',
      'Project layout',
      'Detailed AWS setup',
    ],
    'Developer experience': [
      'Local development',
      'Dependency management',
      'Sharing code',
      'Custom source paths',
      'Deployment',
      'Logging & monitoring',
      'Using TypeScript',
    ],
    'Frontend': [
      'Static assets',
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
    'Extend': [
      'Custom CloudFormation',
      'Plugins',
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
    'Function config',
    'Local preferences',
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
