import listFromObject from '../helpers/list.mjs'
import slugify from '../helpers/slugify.mjs'

const map = {
  list: function List (state = {}) {
    const { children } = state
    return `
<ul
  class="
    mb-1
    list-none
  "
>
  ${children}
</ul>
    `
  },
  item: function Item (state = {}) {
    const { child = '', children = [], depth, path, active } = state
    const isHeading = children.length
    const mb = isHeading ? 'mb1' : 'mb-4'
    const ml = path.length > 3 ? 'ml-1' : ''
    return `
<li
  class="
    ${mb}
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
  const { name, path, active } = state
  const uri = path
    .concat([ name ])
    .map((part) => slugify(part))
    .join('/')
  const href = `/${uri}`
  const isActive = active === href
  const activeClass = isActive ? ' active' : ''
  const text = isActive ? `→ ${name}` : name

  return `
<a href="${href}" class="w-full inline-block text-p1 text-h1 text-a2 no-underline font-normal${activeClass}">${text}</a>
  `
}

function Heading3 (state = {}) {
  const { name } = state
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
<hr class="border-solid border1 border-p1 mb-2">
  `
}

function Heading4 (state = {}) {
  const { name } = state
  return `
<h4
  class="
   mb-2
   text0
   font-medium
  "
>
  ${name}
</h4>
  `
}

function Group (state = {}) {
  const { name, depth, active, children } = state
  const slug = slugify(name)
  const groupIsActive =
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
  <summary class="text-p1 mb-2 flex items-center">${name}
    <span class="plus-icon inline icon fill-current pl-5">
      <svg style="vertical-align: baseline;">
        <use href="#plus"></use>
      </svg>
    </span>
    <span class="minus-icon inline icon fill-current pl-5">
      <svg style="vertical-align: baseline;">
        <use xlink:href="#minus"></use>
      </svg>
    </span>
  </summary>
  <div>${children}</div>
</details>
  `
}

function Heading (state = {}) {
  const { depth } = state
  const headings = [ Heading3, Heading4, Group ]
  return headings[depth - 1](state)
}

export default function Sidebar (props = {}) {
  const { active, toc } = props

  return `
<aside
  id="sidebar"
  class="
    h-full
    fixed
    left-sidebar
    static-lg
    pt2
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
