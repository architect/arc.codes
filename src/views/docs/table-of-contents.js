let About = [
  'Mission',
  'Community',
  'Contribute',
  'Playground', 
]

let Guides = [{
  'Get started': [
    'Why Architect?',
    'Quickstart',
    'Project layout',
    'Detailed AWS setup',
  ],
  'Developer experience': [
    'Local dev sandbox', // preview, debug and test
    'Share code', // src/shared and src/views
    'Custom source paths',
    'Dependency management',
    'Deploy',
    'Log & monitor', // cloudwatch
    'Migrate legacy code',// @proxy, arc.http.express
    'Upgrade',
  ],
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
    'Custom CloudFormation',
    'Add a custom domain',
    'Eject to SAM'
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
    'Deno',
    'Ruby',
    'Python'
  ]
}]

module.exports = {
  Guides,
  Reference,
  About
}
