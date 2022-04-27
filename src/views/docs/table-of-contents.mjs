const GetStarted = [
  'Why Architect',
  'Quickstart',
  'Project manifest',
  // 'Project files & folders',
  'Detailed AWS setup',
]

const Guides = [
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
      'Customizing CloudFormation',
      {
        'Continuous integration': [
          'GitHub Actions',
          'AWS EC2',
        ]
      }
    ],
    'Frontend': [
      'Sessions',
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
      },
    ],
    'Plugins': [
      'Overview',
      'deploy',
      'sandbox',
      'set',
      'Inventory',
    ],
  },
  'Examples',
]

const Reference = [ {
  'Project manifest': [
    '@app',
    '@aws',
    '@events',
    '@http',
    '@plugins',
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

const About = [
  'Mission',
  'Community',
  'Contribute',
  'Upgrade guide',
  'Playground',
  'Ejecting from Architect'
]

export default {
  'Get Started': GetStarted,
  Guides,
  Reference,
  About,
}
