import listFromObject from '../helpers/list.js'
import slugify from '../helpers/slugify.js'

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
    let ml = depth > 1 ? 'ml-5' : ''
    return `
<li
  class="
    mb-1
    ${ml}
  "
>
  ${
  isHeading
    ? Heading({ name: child, depth, path, active, children })
    : Anchor({ name: child, depth, path, active })
}
  ${depth >= 3 ? '' : children}
</li>
    `
  },
}

function Anchor (state = {}) {
  let { name, path, active } = state
  let uri = path
    .concat([ name ])
    .map((part) => slugify(part))
    .join('/')
  let href = `/${uri}`
  let isActive = active === href
  let activeClass = isActive ? 'active' : ''
  let text = isActive ? `→ ${name}` : name

  return `
<a href="${href}" class="w-full inline-block text-p1 text-h1 text-a2 no-underline font-medium ${activeClass}" >${text}</a>
  `
}

function Heading3 (state = {}) {
  let { name } = state
  return `
<h3
  class="
   mb-5
   text1
   font-semibold
  "
>
  ${name}
</h3>
<hr class="border-solid border1 border-p1 mb1">
  `
}

function Heading4 (state = {}) {
  let { name } = state
  return `
<h4
  class="
   mb0
   text0
   font-semibold
  "
>
  ${name}
</h4>
  `
}

function Group (state = {}) {
  let { name, depth, active, children } = state
  let slug = slugify(name)
  let groupIsActive =
    active.replace('/docs/en', '').split('/').indexOf(slug) === depth

  return `
<details
  class="
    block
    cursor-pointer
    mb-1
    text0
    font-medium
    sidebar-group-title
  "
  ${groupIsActive ? 'open' : ''}
>
  <summary class="text-p1 mb0 flex items-center">${name}
    <span class="plus-icon inline icon fill-current pl-5">
      <svg style="vertical-align: baseline;">
        <use xlink:href="#plus"></use>
      </svg>
    </span>
    <span class="minus-icon inline icon fill-current pl-5">
      <svg style="vertical-align: baseline;">
        <use xlink:href="#minus"></use>
      </svg>
    </span>
  </summary>
  <div class="pl0">${children}</div>
</details>
  `
}

function Heading (state = {}) {
  let { depth } = state
  const headings = [ Heading3, Heading4, Group ]
  return headings[depth - 1](state)
}

export default function Sidebar (props = {}) {
  let { active, toc } = props
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
    bg-g0
  "
>
  ${listFromObject({ data: toc, map, path: [ 'docs', 'en' ], active })}
</aside>
  `
}
