let About = [
  'Mission',
  'Community',
  'Playground', 
  'Contribute'
]

let Guides = [{
  'Get started': [
    'Quickstart',
    'Superpowers and limits',
    'Project layout',
    'Detailed AWS setup',
  ],
  'Develop': [
    'Local dev',
    'Custom file paths',
    'Sharing code',
    'Dependency management',
    'Deployment',
    'Logging & monitoring',
    'Migrating legacy apps',
    'Upgrading',
  ],
  'Frontend': [
    'Static assets',
    'HTTP',
    'CORS',
    'Sessions',
    'Middleware',
    'Web sockets',
  ],
  'Backend': [
    'Events',
    'Queues',
    'Scheduled',
    'Database',
  ],
  'Extend': [
    'Add a custom domain',
    'Custom IAM roles',
    'Customize generated CloudFormation',
    'Eject to AWS SAM'
  ]
}]

let Reference = [{
  'CLI': [
    'arc deploy',
    'arc destroy',
    'arc env',
    'arc init',
    'arc logs',
    'arc package',
    'arc sandbox',
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
  'config.arc':[
    '@aws'
  ],
  'prefs.arc': [
    '@create',
    '@env',
    '@sandbox'
  ], 
  'Runtime': [
    'Node',
    'Ruby',
    'Python'
  ]
}]

module.exports = {
  Guides,
  Reference,
  About
}
