import Logo from '../components/logo.mjs'
import Icon from '../components/icon.mjs'
import Search from '../components/search.mjs'
import GithubLink from '../components/github-link.mjs'
import DiscordLink from '../components/discord-link.mjs'
import TwitterLink from '../components/twitter-link.mjs'
import ThemeButton from '../components/theme-button.mjs'

export default function TopNav () {
  return `
<header
  class="
    pt0-lg
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
    top0
    bg-g9
    col-start-1
    col-end-3
    text-g0
    z1
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

  <div class="hidden flex-lg items-center gap0 pl2 text-1">
    <a class="navButton font-medium text-g0 no-underline font-medium pl-1 pr-1" href="/">Home</a>
    <a class="navButton font-medium text-g0 no-underline font-medium pl-1 pr-1 active" href="/docs/en/get-started/quickstart">Docs</a>
  </div>
  <div
    class="
      flex
      items-center
      justify-between
      ml-auto
    "
  >
    ${Search({ classes: 'hidden inline-block-lg mr0' })}
    ${DiscordLink()}
    ${TwitterLink({ classes: 'ml0' })}
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
  <div class="indicator invisible visible-lg bg-image0 absolute right0 bottom0 left0"></div>
</header>
  `
}
