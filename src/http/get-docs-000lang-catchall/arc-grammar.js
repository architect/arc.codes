module.exports = function (hljs) {
  const LITERALS = [
    'true',
    'false',
    'null'
  ].join(' ')
  const PRAGMAS = {
    className: 'built_in',
    begin: '^@.*'
  }
  return {
    aliases: [
      'arc',
      'architect'
    ],
    case_insensitive: true,
    keywords: {
      literal: LITERALS,
      keyword: [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'head',
        'any',
        'region',
        'profile',
        'runtime',
        'bucket',
        'httpv1',
        'rest',
        'apigateway',
        'fingerprint',
        'folder',
        'staging',
        'production',
        'session',
        '_idx',
        '_ttl'
      ].join(' ')
    },
    contains: [
      {
        className: 'string',
        begin: "'", end: "'"
      },
      hljs.COMMENT(
        '#.*'
      ),
      PRAGMAS
    ]
  }
}
