import Icon from './icon.mjs'

export default function TwitterLink (state = {}) {
  const { classes } = state
  return `
<a
  rel="noreferrer"
  aria-label="Architect on Twitter"
  href="https://twitter.com/arcdotcodes"
  class="
  ${classes}
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'icon transition-fill', href: 'twitter' })}
</a>
  `
}
