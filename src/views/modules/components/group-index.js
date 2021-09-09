import slugify from '../helpers/slugify.js'
import List from './list.js'
import Item from './item.js'
import Anchor from './anchor.js'

export default function GroupIndex (props = {}) {
  let { groupPages, active } = props

  if (!groupPages) return ''

  const children = groupPages.map((page) => {
    if (typeof page === 'string') {
      const anchor = Anchor({
        children: page,
        classes: 'font-medium text-p1 text-h1',
        href: [active, slugify(page)].join('/')
      })
      const item = Item({ children: anchor })
      return item
    } else {
      // ? TODO: handle nested groups
    }
  }).join('')

  return List({ children, classes: 'list-none ml-1 mb-1' })
}
