import listFromObject from '../helpers/list.js'
import slugify from '../helpers/slugify.js'
import toc from '../../docs/table-of-contents.js'
const map = {
  list: function List (state = {}) {
    let { children } = state
    return `
<ul
  class="
    mb1
    list-none
  "
>
  ${children}
</ul>
    `
  },
  item: function Item (state = {}) {
    let { child = '', children = [], depth, path, active } = state
    let isHeading = children.length
    let ml = depth > 1
      ? 'ml-5'
      : ''
    return `
<li
  class="
    mb-1
    ${ml}
  "
>
  ${
  isHeading
    ? Heading({ children: child, depth, path, active })
    : Anchor({ children: child, depth, path, active })
}
  ${children}
</li>
    `
  }
}

function Anchor (state = {}) {
  let { children, path, active } = state
  let uri = path
    .concat([ children ])
    .map(part => slugify(part))
    .join('/')
  let href = `/${uri}`
  let isActive = active === href
  let activeClass = isActive
    ? 'active'
    : ''
  let pointer = isActive
    ? '→'
    : ''

  return `
<a href="${href}" class="w-full inline-block text-p1 text-h1 text-a2 no-underline font-medium ${activeClass}" >${pointer} ${children}</a>
  `
}

function Heading3 (state = {}) {
  let { children } = state
  return `
<h3
  class="
   mb-5
   font-semibold
   text1
  "
>
  ${children}
</h3>
<hr class="border-solid border1 border-p1 mb1">
  `
}

function Heading4 (state = {}) {
  let { children } = state
  return `
<h4
  class="
   mb0
   text0
   font-semibold
  "
>
  ${children}
</h4>
  `
}

function Heading5 (state = {}) {
  let { children } = state
  return `
<h5
  class="
   mb-1
   text0
   font-medium
  "
>
  ${children}
</h5>
  `
}

function Heading (state = {}) {
  let { depth } = state
  const headings = [
    Heading3,
    Heading4,
    Heading5
  ]
  return headings[depth - 1](state)
}

export default function Sidebar (props = {}) {
  let { active } = props
  return `
<aside
  id="sidebar"
  class="
    h-full
    fixed
    left-sidebar
    static-lg
    pt3
    pr2
    pb3
    pl2
    overflow-auto
    sidebar-w
    transition-x
    col-start-1
    col-end-2
    row-start-2
    bg-g0
  "
>
  ${listFromObject({ data: toc, map, path: [ 'docs', 'en' ], active })}
</aside>
  `
}
