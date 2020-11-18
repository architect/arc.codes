import test from 'tape'
import listFromObject from '../src/views/modules/helpers/list.js'
import strip from './helpers/strip.js'

test('render object to list', t => {
  let data = {
    'one': [
      'a',
      'b',
      'c'
    ],
    'two': [
      'd',
      'e',
      'f'
    ]
  }
  let expected = `
<ul>
  <li>
    one
    <ul>
      <li>a</li>
      <li>b</li>
      <li>c</li>
    </ul>
  </li>
  <li>
    two
    <ul>
      <li>d</li>
      <li>e</li>
      <li>f</li>
    </ul>
  </li>
</ul>
  `
  let actual = listFromObject(data)

  t.equal(strip(actual), strip(expected), 'Should render object to list', actual)
  t.end()
})

test('render nested object to list', t => {
  let data = {
    'label': [
      {
        'one': [
          'a',
          'b',
          'c'
        ]
      },
      {
        'two': [
          'd',
          'e',
          'f'
        ]
      }
    ]
  }
  let expected = `
<ul>
  <li>
    label
    <ul>
      <li>
        one
        <ul>
          <li>a</li>
          <li>b</li>
          <li>c</li>
        </ul>
      </li>
      <li>
        two
        <ul>
          <li>d</li>
          <li>e</li>
          <li>f</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = listFromObject(data)

  t.equal(strip(actual), strip(expected),'Should render object to list', actual)
  t.end()
})

test('render deeply nested object to list', t => {
  let data = {
    'label': [
      {
        'one': [
          {
            'a': [
              '1',
              '2',
              '3'
            ]
          },
          'b',
          'c'
        ]
      },
      {
        'two': [
          'd',
          'e',
          'f'
        ]
      }
    ]
  }
  let expected = `
<ul>
  <li>
    label
    <ul>
      <li>
        one
        <ul>
          <li>
            a
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </li>
          <li>b</li>
          <li>c</li>
        </ul>
      </li>
      <li>
        two
        <ul>
          <li>d</li>
          <li>e</li>
          <li>f</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = listFromObject(data)

  t.equal(strip(actual), strip(expected),'Should render object to list', actual)
  t.end()
})
/*
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
*/
