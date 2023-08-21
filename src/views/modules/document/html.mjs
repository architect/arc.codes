import Banner from '../components/banner.mjs'
import DocumentOutline from '../components/document-outline.mjs'
import EditLink from '../components/edit-link.mjs'
import GoogleAnalytics from './ga.mjs'
import Head from './head.mjs'
import Script from './script.mjs'
import Sidebar from '../components/sidebar.mjs'
import State from './state.mjs'
import Symbols from './symbols.mjs'
import TopNav from './top-nav.mjs'

export default function HTML (props = {}) {
  const {
    html = '',
    editURL = '',
    lang = 'en',
    scripts = '',
    slug = '',
    state = {},
    thirdparty = '',
    title = ''
  } = props

  const scriptTags = scripts &&
    Array.isArray(props.scripts)
    ? scripts.map(src => Script({ src })).join('')
    : Script(scripts)
  const stateTag = state && State(state) || ''

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
            text5
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
