export default function listFromObject ({ data = {}, map = {}, path = [], active }) {
  let depth = 0
  let { list, item } = map
  let children = itemsFromObject({ data, list, item, depth, path, active })
  return list({
    children
  })
}

function itemsFromObject ({ data = {}, list, item, depth, path, active }) {
  depth = depth + 1
  return Object.keys(data).map(child => {
    let children = data[child]
    return item({
      child,
      children: `
          ${listFromArray({ children, list, item, depth, path: path.concat([ child ]), active })}
        `,
      depth,
      path
    })
  }).join('')
}

function listFromArray ({ children = [], list, item, depth, path, active }) {
  let gi = getItem.bind(null, list, item, depth, path, active)
  let kids = children.map(gi).join('')
  return list({ children: kids })
}

function getItem (list, item, depth, path, active, child) {
  return typeof child === 'string'
    ? item({ child, depth, path, active })
    : itemsFromObject({ data: child, list, item, depth, path, active })
}
