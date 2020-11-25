export default function listFromObject({ data={}, map={}, path=[] }) {
  let depth = 0
  let { list, item } = map
  let children = itemsFromObject({ data, list, item, depth, path })
  return list({
    children
  })
}

function itemsFromObject({ data={}, list, item, depth, path }) {
  depth = depth + 1
  return Object.keys(data).map(child => {
    let children = data[child]
    return item({
        child,
        children: `
          ${ listFromArray({ children, list, item, depth, path: path.concat([ child ]) }) }
        `,
        depth,
        path
    })
  }).join('')
}

function listFromArray({ children=[], list, item, depth, path }) {
  let gi = getItem.bind(null, list, item, depth, path)
  let kids = children.map(gi).join('')
  return list({ children: kids })
}

function getItem(list, item, depth, path, child) {
  return typeof child === 'string'
    ? item({ child, depth, path })
    : itemsFromObject({ data: child, list, item, depth, path })
}
