import Icon from './icon.js'

export default function SlackLink (state = {}) {
  let { classes } = state
  return `
<a 
  rel="noreferrer"
  aria-label="Architect on Slack"
  href="https://join.slack.com/t/architecture-as-text/shared_invite/MjE2MzU4Nzg0NTY1LTE1MDA2NzgyMzYtODE2NzRkOGRmYw"
  class="
  ${classes}
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'slack-icon transition-fill', href: 'slack' })}
</a>
  `
}
