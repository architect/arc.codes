export default function listFromObject ({ data = {}, map = {}, path = [], active = null }) {
  const depth = 0
  const { list, item } = map
  const children = itemsFromObject({ data, list, item, depth, path, active })
  return list({
    children
  })
}

function itemsFromObject ({ data = {}, list, item, depth, path, active }) {
  depth = depth + 1
  return Object.keys(data).map(child => {
    const children = data[child]
    return item({
      child,
      children: `
          ${listFromArray({ children, list, item, depth, path: path.concat([ child ]), active })}
        `,
      depth,
      path,
      active,
    })
  }).join('')
}

function listFromArray ({ children = [], list, item, depth, path, active }) {
  const gi = getItem.bind(null, list, item, depth, path, active)
  const kids = children.map(gi).join('')
  return list({ children: kids })
}

function getItem (list, item, depth, path, active, child) {
  return typeof child === 'string'
    ? item({ child, depth, path, active })
    : itemsFromObject({ data: child, list, item, depth, path, active })
}
