export default function List (props = {}) {
  let { children, classes } = props
  return `
<ul class=${classes}>
  ${children}
</ul>
  `
}
