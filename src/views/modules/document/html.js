import Head from './head.js'
import Symbols from './symbols.js'
import Script from './script.js'
import State from './state.js'
import Logo from '../components/logo.js'
import Icon from '../components/icon.js'
import Sidebar from '../components/sidebar.js'

export default function HTML (props={}) {
  let {
    children=[],
    lang='en',
    scripts='',
    state={},
    thirdparty='',
    title=''
  } = props
  let scriptTags = scripts &&
    Array.isArray(props.scripts)
      ? scripts.map(src => Script({ src }))
      : Script(scripts)
  let stateTag = state &&
      State(state) || ''

  return `
<!DOCTYPE html>
<html lang="${ lang }" class="h-full">
${ Head(props) }
${ Symbols }
<body
  class="
    h-full
    font-sans
    overflow-hidden-lg
  "
>
  <div
    class="
      h-full-lg
      grid-lg
      two-column
    "
  >
    <header
      class="
        pt-1
        pr2
        pb0
        pl2
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
      ${ Logo({ classes: 'h-logo' }) }
      <button
        id="menu-button"
        class="
          bg-unset
          text-g0
          hidden-lg
          cursor-pointer
        "
      >
        ${ Icon({ href: 'hamburger', classes: 'icon fill-current' }) }
      </button>
      <div class="hairline bg-image0 absolute right0 bottom0 left0"></div>
    </header>
    ${ Sidebar(props) }
    <main
      id="main"
      class="
        h-full
        col-start-2
        p3
        overflow-auto
      "
    >
      <div
        class="
          max-width-content
          m-auto
        "
      >
        <h1
          class="
            mb1
            font-semibold
            text2
          "
        >
          ${ title }
        </h1>
        <div class="pb4 docs">
          ${ children }
        </div>
      </div>
    </main>
  </div>
  ${ stateTag }
  ${ scriptTags }
  ${ thirdparty }
</body>
</html>
`
}
