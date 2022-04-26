import Icon from './icon.mjs'

export default function GithubLink (state = {}) {
  const { classes } = state
  return `
<a
  rel="noreferrer"
  aria-label="Architect on GitHub"
  href="https://github.com/architect/architect"
  class="
  ${classes}
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'icon fill-current transition-fill', href: 'github' })}
</a>
  `
}
