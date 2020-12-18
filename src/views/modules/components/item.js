export default function Item (state = {}) {
  let { children, classes } = state
  return `
<li class=${classes}>
  ${children}
</li>
  `
}
