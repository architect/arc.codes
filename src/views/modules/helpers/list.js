export default function listFromObject(obj={}, list=Ul, item=Li) {
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

function Ul(props={}) {
  let { children } = props
  return `
<ul>
  ${ children }
</ul>
  `
}

function Li(props={}) {
  let { children } = props
  return `
<li>
  ${ children }
</li>
  `
}
