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
  let { children, href, id } = props
  return `
<a ${id ? `id='${id}'` : '' } href='${href}'>${children}</a>
  `
}

function slugify(str='') {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/"/g, '')
    .replace(/\s/g, '-')
}

function Section(props={}) {
  let {
    data={},
    lang='en',
  } = props
  let section = Object.keys(data)[0]
}

function LabelledSection(props={}) {
  let {
    data={},
    lang='en',
    sections=[]
  } = props
  let section = Object.keys(data)[0]
  let id = slugify(section)
  let subsections = data[section]
  let href = slugify(`#${section}`)
  let items = subsections.map(data => {
    return Subsection({
      data,
      lang,
      sections
    })
  }).join('')
  return Ul({
    children: Li({
      children: `${Anchor({
        id,
        children: section,
        href
      })}
      ${ items }
      `
    })
  })
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
        children: section,
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

test('Render section', t=> {
  let lang = 'jp'
  let data = {
    guides: [
      {
        'Start': [
          'one',
          'two',
          'three'
        ]
      }
    ],
    reference: [
      {
        'Architect project structure': [
          {
            'Things & stuff': [
               'four',
               'five',
               'six'
            ]
          },
          {
            'More': [
               'seven',
               'eight',
               'nine'
            ]
          }
        ]
      }
    ]
  }
  let expected = `
<ul>
  <li>
    guides
    <ul>
      <li>
        Start
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    reference
    <ul>
      <li>
        Architect project structure
        <ul>
          <li>
            Things & stuff
            <ul>
              <li>
                four
              </li>
              <li>
                five
              </li>
              <li>
                six
              </li>
            </ul>
          </li>
          <li>
            More
            <ul>
              <li>seven</li>
              <li>eight</li>
              <li>nine</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = Section({ lang, data })
  t.equals(strip(actual), strip(expected), 'Section rendered correctly')
  t.end()
})

test('Render subsection', t=> {
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
  t.equals(strip(actual), strip(expected), 'Subsection rendered correctly')
  t.end()
})

test('Render labelled section', t=> {
  let lang = 'en'
  let data = {
    'Architect project structure': [
      {
        'Architect manifest & config': [
          'Project manifest & config',
          'Function config file',
        ]
      },
      {
        'Static assets': [
          'Static',
          'CDN',
        ]
      }
    ]
  }

  let expected = `
<ul>
  <li>
    <a id='architect-project-structure' href='#architect-project-structure'>
      Architect project structure
    </a>
    <ul>
      <li>
        <a href='/en/architect-manifest-and-config'>
          Architect manifest & config
        </a>
        <ul>
          <li>
            <a href='/en/architect-manifest-and-config/project-manifest-and-config'>
              Project manifest & config
            </a>
          </li>
          <li>
            <a href='/en/architect-manifest-and-config/function-config-file'>
              Function config file
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
       <a href='/en/architect-manifest-and-config/static-assets'>
        Static assets
       </a>
       <ul>
         <li>
          <a href='/en/architect-manifest-and-config/static-assets/static'>
            Static
          </a>
         </li>
         <li>
          <a href='/en/architect-manifest-and-config/static-assets/cdn'>
            CDN
          </a>
         </li>
       </ul>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = LabelledSection({ lang, data })
  t.equals(strip(actual), strip(expected), `Labelled section rendered correctly`)
  t.end()
})
