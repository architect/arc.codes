export default function Anchor (props = {}) {
  let { children, href = '#' } = props
  return `
<a href=${href}>${children}</a>
  `
}
