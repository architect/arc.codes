import Banner from '../components/banner.js'
import DocumentOutline from '../components/document-outline.js'
import EditLink from '../components/edit-link.js'
import GoogleAnalytics from './ga.js'
import Head from './head.js'
import Script from './script.js'
import Sidebar from '../components/sidebar.js'
import State from './state.js'
import Symbols from './symbols.js'
import TopNav from './top-nav.js'

export default function HTML (props = {}) {
  let {
    html = '',
    editURL = '',
    lang = 'en',
    scripts = '',
    slug = '',
    state = {},
    thirdparty = '',
    title = ''
  } = props

  let scriptTags = scripts &&
    Array.isArray(props.scripts)
    ? scripts.map(src => Script({ src })).join('')
    : Script(scripts)
  let stateTag = state && State(state) || ''

  return `
<!DOCTYPE html>
<html lang="${lang}" class="h-full">
${Head(props)}
${Symbols}
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
    ${TopNav()}
    ${Banner({ enabled: false })}
    ${Sidebar(props)}
    <main
      id="main"
      class="
        h-full
        p2-lg
        p1
        overflow-auto
      "
    >
      <div
        class="
          w-full
          max-width-content
          m-auto
        "
      >
        <h1
          id="${slug}"
          class="
            mb1
            font-semibold
            text3
          "
        >
          ${title}
        </h1>
        <div class="pb4 docs">
          ${html}
          ${EditLink({ editURL })}
        </div>
      </div>
      ${DocumentOutline(props)}
    </main>
  </div>
  ${stateTag}
  ${scriptTags}
  ${GoogleAnalytics()}
  ${thirdparty}
</body>
</html>
`
}
