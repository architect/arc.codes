import Icon from './icon.js'

export default function StarLink (state = {}) {
  let { classes } = state
  return `
<a
  href="https://github.com/architect"
  class="
  ${classes}
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'icon fill-current transition-fill', href: 'star' })}
</a>
  `
}
