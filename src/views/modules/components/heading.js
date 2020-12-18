export default function Heading (state = {}) {
  let { children, classes, level = '1' } = state
  return `
<h${level} class=${classes}>
  ${children}
</h${level}>
  `
}
