export default function Anchor (props = {}) {
  let { children, classes = '', href = '#' } = props
  return `
<a href="${href}" class="${classes}">${children}</a>
  `
}
