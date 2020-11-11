import Head from './head.js'
// import Symbols from './symbols.mjs'
import Script from './script.js'
import State from './state.js'
import toc from '../../docs/table-of-contents.js'
import Logo from '../components/logo.js'

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
      ? scripts.map(src => Script({src}))
      : Script(scripts)
  let stateTag = state &&
      State(state) || ''
  let nav = parseTOC(toc).join('')

  function parseTOC(obj) {
    return Object.keys(obj)
      .map(t => {
        let section = obj[t]
        let children = Array.isArray(section) &&
          section.map(c => {
            if (typeof c === 'string') {
              return c
            }
            else {
              return Object.keys(c)
                .map(cc => {
                  //

                })
            }
          })

        return List({
          children,
          lang,
          title: t
        })
      })
  }

  function slugify(str) {
    return str
      .replace(' ', '-')
      .toLowerCase()
  }

  function List(props={}) {
    let { children, lang, title } = props
    let items = children
      .map(name => {
        let doc = slugify(name)
        let href = `/${lang}/${title}/${doc}`

        return `
        <li>
          <a href="${href}">${name}</a>
        </li>
        `
      })
      .join('')
    return `
    <h3>${title}</h3>
    <ul>
      ${items}
    </ul>
    `
  }

  function Navigation(props={}) {
    let { data, lang } = props
    let nav = data.map(d => {
      let { title, children } = d
      let section = title
      return Array.isArray(children[0])
        ? console.log('link: ', `/${lang}/${section}`, '\n', 'KIDS: ', children)
        : List({ children, lang, title })
    })

    return nav.join('')
  }

  return `
<!DOCTYPE html>
<html lang="${lang}" class="h-full">
${Head(props)}
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
        pb-1
        pl2
        sticky
        static-lg
        flex
        justify-between
        items-center
        top0
        bg-g9
        col-start-1
        col-end-3
        text-g0
      "
    >
      ${Logo({ classes: 'h-logo' })}
    </header>
    <aside
      id=arc-menu
      class="
        h-full
        fixed
        left-sidebar
        static-lg
        p2
        overflow-auto
        xsidebar-w
        transition-x
        col-start-1
        col-end-2
        row-start-2
        bg-g0
      "
    >
      ${ nav }
    </aside>
    <main
      class="
        h-full
        col-start-2
        p3
        overflow-auto
      "
    >
      <h1
        class="
          mb1
          capitalize
        "
      >
        ${ title }
      </h1>
      ${ children }
    </main>
  </div>
  ${ stateTag }
  ${ scriptTags }
  ${ thirdparty }
</body>
</html>
`
}
