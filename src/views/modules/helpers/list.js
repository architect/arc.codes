import capitalize from './capitalize.js'
import slugify from './slugify.js'

export default function listFromObject(obj={}, list=Ul, item=Li, anchor=Anchor) {
  let children = itemsFromObject(obj, list, item)
  return list({
    children
  })
}

function itemsFromObject(obj={}, list, item) {
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
  let children = arr.map(kid => {
      if(typeof kid === 'string') {
        return item({ children: kid })
      }
      else {
        return itemsFromObject(kid, list, item)
      }
    }).join('')

  return list({ children })
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

function Anchor(state={}) {
  let { children, href } = state
  return `
<a href=${href}>${ children }</a>
  `
}
