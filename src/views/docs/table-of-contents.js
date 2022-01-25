let GetStarted = [
  'Why Architect',
  'Quickstart',
  'Project manifest',
  // 'Project files & folders',
  'Detailed AWS setup',
]

let Guides = [
  {
    'Developer experience': [
      'Local development',
      'Dependency management',
      'Sharing code',
      'Custom source paths',
      'Deployment',
      'Logging & monitoring',
      'Using ESM',
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
          'One',
        ]
      }
    ],
    'Extend': [
      'Custom CloudFormation',
      'Plugins',
    ]
  },
  'Examples',
]

let Reference = [ {
  'Project manifest': [
    '@app',
    '@aws',
    '@events',
    '@http',
    '@macros',
    '@proxy',
    '@queues',
    '@scheduled',
    '@shared',
    '@static',
    '@tables',
    '@tables-indexes',
    '@tables-streams',
    '@views',
    '@ws',
  ],
  'Configuration': [
    'Function config',
    'Local preferences',
  ],
  'CLI': [
    'deploy',
    'destroy',
    'env',
    'hydrate',
    'init',
    'logs',
    'sandbox',
  ],
  'Runtime helpers': [
    'Node.js',
    'Ruby',
    'Python',
    'Deno',
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
  'Get Started': GetStarted,
  Guides,
  Reference,
  About,
}
