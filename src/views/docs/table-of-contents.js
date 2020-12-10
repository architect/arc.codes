let Guides = [{
  'Get started': [
    'Why Architect?',
    'Quickstart',
    'Project layout',
    'Detailed AWS setup',
  ],
  'Developer experience': [
    'Local development', // preview, debug and test
    'Sharing code', // src/shared and src/views
    'Custom source paths',
    'Dependency management',
    'Deployment',
    'Logging & monitoring', // cloudwatch
  ],
  /*TODO
  'Frontend': [
    'Static assets', // fingerprint, ignore, folder, link to cdn
    'HTTP functions', // 
    'Sessions',
    'Middleware',
    'WebSockets',
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
}]

let Reference = [{
  'CLI': [
    'deploy',
    'destroy',
    'env',
    'init',
    'logs',
    'package',
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
    'Deno',
    'Ruby',
    'Python'
  ]
}]

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

