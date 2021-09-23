export default function Search (state = {}) {
  let { classes = '' } = state
  return `
<input
  type="text"
  placeholder="Search docs..."
  id="docsearch"
  class="
    ${classes}
    radius2
    p-3
  "
/>
`
}
