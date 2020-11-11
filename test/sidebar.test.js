const test = require('tape')
const toc = require('../src/views/docs/table-of-contents')

function strip(str='') {
  return str.replace(/\s/g,'')
}

function Ul(props={}) {
  let { children } = props
  return `
<ul>
  ${children}
</ul>
  `
}

function Li(props={}) {
  let { children } = props
  return `
<li>
  ${children}
</li>
  `
}

function Anchor(props={}) {
  let { children, href } = props
  return `
<a href='${href}'>${children}</a>
  `
}

function slugify(str='') {
  return str
    .toLowerCase()
    .replace(/\s/g, '-')
}

function Subsection(props={}) {
  let {
    data={},
    lang='en',
    sections=[]
  } = props
  let section = Object.keys(data)[0]
  sections.push(section)
  let children = data[section]
  let path = sections.join('/')
  let items = children.map(doc => {
    let href = slugify(`/${lang}/${path}/${doc}`)
    return Li({
      children: Anchor({
        children: doc,
        href
      })
    })
  }).join('')
  let list = Ul({
    children: Li({
      children: `${Anchor({
        children: path,
        href: `/${lang}/${slugify(path)}`
      })}
      ${Ul({
        children: items
      })}
      `
    })
  })
  return list
}

test('toc exists', t=> {
  t.ok(toc)
  t.end()
})

test('slugify', t=> {
  let input = 'Contributor Guide'
  let expected = 'contributor-guide'
  let actual = slugify(input)
  t.equals(expected, actual, 'slugifies')
  t.end()
})

test('parse list from section', t=> {
  let lang = 'en'
  let data = {
    'Get started': [
      'One',
      'Two',
      'Three'
    ]
  }
  let expected = `
<ul>
  <li>
    <a href='/en/get-started'>
      Get started
    </a>
    <ul>
      <li>
        <a href='/en/get-started/one'>
          One
        </a>
      </li>
      <li>
        <a href='/en/get-started/two'>
          Two
        </a>
      </li>
      <li>
        <a href='/en/get-started/three'>
          Three
        </a>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = Subsection({ lang, data })
  t.equals(strip(actual), strip(expected))
  t.end()
})
