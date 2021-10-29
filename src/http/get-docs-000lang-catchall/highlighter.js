module.exports = function (hljs, escapeHtml, str, lang) {
  if (lang && hljs.getLanguage(lang)) {

    try {
      return `<pre class="hljs mb0 mb1-lg"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
    }
    catch (error) {
      console.log(`Highlighter unsupported language: ${lang}`)
      return ''
    }
  }

  return `<pre class="hljs mb0 mb1-lg"><code>${escapeHtml(str)}</code></pre>`
}
