export default function listFromObject(obj={}, componentMap) {
  let depth = 0
  let { list, item } = componentMap
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
        child,
        children: `
          ${ listFromArray(children, list, item, depth) }
        `,
        depth
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
    ? item({ child, depth })
    : itemsFromObject(child, list, item, depth)
}
