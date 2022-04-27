export default function Icon (state = {}) {
  const { classes, href } = state
  return `
<div class="${classes}">
  <svg>
    <use xlink:href="#${href}"></use>
  </svg>
</div>
  `
}
