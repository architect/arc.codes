export default function Search (state = {}) {
  const { classes = '' } = state
  return `
<input
  type="search"
  placeholder="Search..."
  id="docsearch"
  class="
    ${classes}
    radius2
    pt-3
    pb-3
    pl2
    outline-none
  "
/>
`
}
