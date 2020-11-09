import toc from '../../docs/table-of-contents.js'

export default function Sidebar(props={}) {
  let Navigation = ''
  let navData = parseTOC(toc)

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
              return parseTOC(c)
            }
          })

        return {
          title: t,
          children
        }
      })
  }

  console.log('NAV: ', navData)
  return `
<aside
  slot=sidebar
  class="
    h-full
    fixed
    left-sidebar
    static-lg
    p2
    overflow-auto
    sidebar-w
    transition-x
    col-start-1
    col-end-2
    row-start-2
    bg-g0
  "
>
  ${ Navigation }
</aside>
  `
}
