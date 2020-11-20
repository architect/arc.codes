import slugify from '../helpers/slugify.js'

export default function listFromObject(obj={}, list=Ul, item=Li) {
  let depth = 0
  let children = itemsFromObject(obj, list, item, depth)
  return list({
    children
  })
}

function itemsFromObject(obj={}, list, item, depth) {
  depth = depth + 1
  return Object.keys(obj).map(child => {
    let children = obj[child]
    return item({
        children: `
          ${ child }
          ${ listFromArray(children, list, item, depth) }
        `
    })
  }).join('')
}

function listFromArray(arr=[], list, item, depth) {
  let gi = getItem.bind(null, list, item, depth)
  let children = arr.map(gi).join('')
  return list({ children })
}

function getItem(list, item, depth, child) {
  return typeof child === 'string'
    ? item({ children: child })
    : itemsFromObject(child, list, item, depth)
}

function Ul(state={}) {
  let { children } = state
  return `
<ul>
  ${ children }
</ul>
  `
}

function Li(state={}) {
  let { children } = state
  return `
<li>
  ${ children }
</li>
  `
}

function Item(state={}) {
  let { heading='', children='' } = state
  return Li({
    children: `
     ${ heading
          ? Heading({
              children: Anchor({
                children: heading,
                href: slugify(heading)
            })
          })
          : ''
     }
     ${ children }
    `
  })
}

function Heading(state={}) {
  let { children } = state
  return `
<h3>${ children }</h3>
  `
}

function Anchor(state={}) {
  let { children, href } = state
  return `
<a href=${href}>${ children }</a>
  `
}
