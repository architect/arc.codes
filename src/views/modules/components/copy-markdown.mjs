export default function CopyMarkdown (state = {}) {
  const { markdown } = state

  if (!markdown) return ''

  // Escape the markdown for safe embedding in a data attribute
  const escapedMarkdown = markdown
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return `
<button
  id="copy-markdown-btn"
  class="text1 text-p1 text-h1 text-a2 bg-unset cursor-pointer font-semibold inline-flex align-items-center gap-4"
  data-markdown="${escapedMarkdown}"
  title="Copy page markdown for use with LLMs"
>
  <span class="icon fill-current">
    <svg><use xlink:href="#copy"></use></svg>
  </span>
  <span id="copy-markdown-text">Copy for LLM</span>
</button>
`
}

