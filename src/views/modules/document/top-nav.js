import Logo from '../components/logo.js'
import Icon from '../components/icon.js'
import Search from '../components/search.js'
import GithubLink from '../components/github-link.js'
import DiscordLink from '../components/discord-link.js'
import ThemeButton from '../components/theme-button.js'

export default function TopNav () {
  return `
  <header
  class="
    pt-1-lg
    pr2-lg
    pb0-lg
    pl2-lg
    pt-2
    pr-2
    pb-1
    pl-2
    sticky
    relative-lg
    flex
    items-center
    justify-between
    top0
    bg-g9
    col-start-1
    col-end-3
    text-g0
  "
>
  <a
    aria-label="OpenJS Architect"
    href="/"
    class="
      text-g0
      text-h0
      text-a2
      cursor-pointer
    "
  >
    ${Logo({ classes: 'logo' })}
  </a>
  <div
    class="
      flex
      items-center
      justify-between
    "
  >
    ${Search({ classes: 'hidden inline-block-lg mr0' })}
    ${DiscordLink()}
    ${GithubLink({ classes: 'ml0' })}
    ${ThemeButton({ classes: 'ml0' })}
    <button
      aria-label="Menu"
      id="menu-button"
      class="
        ml0
        bg-unset
        text-g0
        text-h0
        text-a2
        hidden-lg
        cursor-pointer
      "
    >
      ${Icon({ href: 'hamburger', classes: 'icon fill-current' })}
    </button>
  </div>
  <div class="indicator bg-image0 absolute right0 bottom0 left0"></div>
</header>
<div
  class="
    pt-1-lg
    pr2-lg
    pb0-lg
    pl2-lg
    pt-2
    pr-2
    pb-1
    pl-2
    flex
    items-center
    justify-center
    text-center
    top0
    bg-g1
    col-start-1
    col-end-3
    text-g8
  "
>
  <span>
    Community chat has moved to
    <a href="https://discord.gg/y5A2eTsCRX"
      class="font-medium text-p1 text-h1"
      target="_blank" rel="noopener noreferrer"
    >
      Discord
    </a>
  </span>
</div>
`
}
