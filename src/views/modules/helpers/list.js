export default function listFromObject(obj={}, list=Ul, item=Li, heading=Heading, anchor=Anchor) {
  let children = itemsFromObject(obj, list, item)
  return list({
    children
  })
}

function itemsFromObject(obj={}, list, item, heading) {
  return Object.keys(obj).map(child => {
    let children = obj[child]
    return item({
      children: `
       ${ child }
       ${ listFromArray(children, list, item) }
      `
    })
  }).join('')
}

function listFromArray(arr=[], list, item) {
  let gi = getItem.bind(null, item, list)
  let children = arr.map(gi).join('')
  return list({ children })
}

function getItem(item, list, child) {
  return typeof child === 'string'
    ? item({ children: child })
    : itemsFromObject(child, list, item)
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
