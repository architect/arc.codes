let commentStart = '#.*$'
let booleans = {
  scope: 'literal',
  begin: '(?<=\\s|^|\\G)(true|false)',
  end: '(?=\\s|#|$)'
}
let numbers = {
  scope: 'number',
  begin: '(?<=\\s|^|\\G)((\\d*[.])?\\d+)(?=\\s|#|$)',
  end: '(?=\\s|#|$)'
}
let doubleQuotedStrings = {
  scope: 'string',
  begin: '(?<=\\s|^|\\G)(")',
  end: '(")',
  contains: [ { begin: '\\\\"' } ]
}
let singleQuotedStrings = {
  scope: 'string',
  begin: "(?<=\\s|^|\\G)(')",
  end: "(')",
  contains: [ { begin: "\\\\'" } ]
}
let backtickQuotedStrings = {
  scope: 'string',
  begin: '(?<=\\s|^|\\G)(`)',
  end: '(`)',
  contains: [ { begin: '\\\\`' } ]
}
let pragmas = { scope: 'title', begin: '^@[a-zA-Z0-9-_]+', end: '(?=\\s|#|$)' }
let mapVectorName = {
  scope: 'variable',
  begin: '(?<=^)(\\S+)(?=\\s|#|$)(?=#?[^\\r\\n]*[\\r\\n](^[\\t ]{2}\\S))',
  end: '\\s'
}
let mapProperties = {
  scope: 'property',
  begin: '(^[\\t ]{2}[^#\\r\\n\\t ]+)(?=[\\t ]+[^#\\r\\n\\t ]+(?=\\s|#|$))',
  end: '[\\t ]'
}
let string = { scope: 'string' }
module.exports = function index (hljs) {
  return {
    aliases: [ 'arc', 'architect' ],
    case_insensitive: true,
    contains: [
      booleans,
      numbers,
      doubleQuotedStrings,
      singleQuotedStrings,
      backtickQuotedStrings,
      pragmas,
      hljs.COMMENT(commentStart),
      // Map / vector stuff goes after comments to ensure clean inline captures
      mapVectorName,
      mapProperties,
      string, // String needs to be last, as anything not matched falls through to it
    ]
  }
}
