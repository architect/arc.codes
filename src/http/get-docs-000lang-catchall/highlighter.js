const shiki = require('shiki')
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
        grammar: arcGrammar
      }
    ],
  })

  return function (code, lang) {
    try {
      return highlighter.codeToHtml(code, lang)
    }
    catch (error) {
      console.log(`Highlighter unsupported language: ${lang}`)
      return ''
    }
  }
}
