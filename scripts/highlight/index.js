var hljs = require('./core')

// Shells
hljs.registerLanguage('bash', require('./languages/bash'))
hljs.registerLanguage('powershell', require('./languages/powershell'))

// Languages
hljs.registerLanguage('ruby', require('./languages/ruby'))
hljs.registerLanguage('javascript', require('./languages/javascript'))
hljs.registerLanguage('python', require('./languages/python'))

// Formats
hljs.registerLanguage('arc', require('./languages/arc'))
hljs.registerLanguage('json', require('./languages/json'))
hljs.registerLanguage('yaml', require('./languages/yaml'))
// TODO: add TOMLol

hljs.HighlightJS = hljs
hljs.default = hljs
module.exports = hljs
