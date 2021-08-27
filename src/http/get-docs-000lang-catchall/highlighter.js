const shiki = require('shiki')
// from @ryanblock https://github.com/ryanblock/architect-vscode-grammar-extension/blob/master/syntaxes/arc.tmGrammar.json
const arcGrammar = require('./arc.tmGrammar.json')

module.exports.forMarkdown = async function () {
  const highlighter = await shiki.getHighlighter({
    theme: 'dracula-soft',
    langs: [
      'bash',
      'javascript',
      'json',
      'powershell',
      'python',
      'ruby',
      'toml',
      'yaml',
      {
        id: 'arc',
        scopeName: 'source.arc',
        grammar: arcGrammar // the type is mismatched but still functions
      }
    ],
  })

  return function (code, lang) {
    try {
      return highlighter.codeToHtml(code, lang)
    }
    catch (error) {
      console.log(lang)
      return ''
    }
  }
}
