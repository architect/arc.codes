module.exports = function (hljs, escapeHtml, str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return `<pre class="hljs mb0 mb1-lg"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
    }
    catch (err) {
      console.error(err)
    }
  }

  return `<pre class="hljs mb0 mb1-lg"><code>${escapeHtml(str)}</code></pre>`
}
