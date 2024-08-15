const GetStarted = [
  'Why Architect',
  'Quickstart',
  'Project manifest',
  'Detailed AWS setup',
  'Runtime support',
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
      'Using Deno',
      'Custom CloudFormation',
      'Create AWS credentials',
      {
        'Continuous integration': [
          'GitHub Actions',
          'GitLab Pipelines',
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
      'create',
      'deploy',
      'hydrate',
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
