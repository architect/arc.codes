import Icon from './icon.js'

export default function DiscordLink (state = {}) {
  let { classes } = state
  return `
<a
  rel="noreferrer"
  aria-label="Architect on Discord"
  href="https://discord.gg/y5A2eTsCRX"
  class="
  ${classes}
   text-g0
   text-h0
   text-a2
   cursor-pointer
  "
>
  ${Icon({ classes: 'discord-icon transition-fill', href: 'discord' })}
</a>
  `
}
