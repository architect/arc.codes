import Icon from './icon.js'

export default function ThemeButton (state = {}) {
  let { classes } = state
  return `
<button
  id="theme-button"
  class="
  ${classes}
   bg-g9
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'sun-icon hidden icon fill-current', href: 'sun' })}
  ${Icon({ classes: 'moon-icon hidden icon fill-current', href: 'moon' })}
</button>
  `
}
