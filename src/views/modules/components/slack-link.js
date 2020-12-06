import Icon from './icon.js'

export default function SlackLink(state={}) {
  let { classes } = state
  return `
<a
  href="https://architecture-as-text.slack.com"
  class="
  ${ classes }
   text-g0
   cursor-pointer
  "
>
  ${ Icon({ classes: 'slack-icon', href: 'slack' }) }
</a>
  `
}
