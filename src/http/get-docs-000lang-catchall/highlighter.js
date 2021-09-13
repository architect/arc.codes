const path = require('path')
const shiki = require('./shiki/dist')
const arcGrammar = require('./arc-textmate.json')

module.exports.forMarkdown = async function () {
  const theme = await shiki.loadTheme(path.join(__dirname, './themes/atom-one-dark.json'))
  const highlighter = await shiki.getHighlighter({
    theme,
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
