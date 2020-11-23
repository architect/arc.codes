import test from 'tape'
import listFromObject from '../src/views/modules/helpers/list.js'
import strip from './helpers/strip.js'
import slugify from '../src/views/modules/helpers/slugify.js'

function Ul(state={}) {
  let { children } = state
  return `
<ul>
  ${ children }
</ul>
  `
}

function Li(state={}) {
  let { child='', children='' } = state
  return `
<li>
  ${ child }
  ${ children }
</li>
  `
}

function Item(state={}) {
  let { child='', children='', depth } = state
  return Li({
    children: `
     ${ child
          ? Heading({
              children: Anchor({
                children: child,
                href: slugify(child)
              }),
              depth
          })
          : ''
     }
     ${ children }
    `
  })
}

function Heading(state={}) {
  let { depth=0 } = state
  return [ Heading3, Heading4 ][depth - 1](state)
}
function Heading3(state={}) {
  let { children } = state
  return `
<h3>${ children }</h3>
  `
}

function Heading4(state={}) {
  let { children } = state
  return `
<h4>${ children }</h4>
  `
}

function Anchor(state={}) {
  let { children, href } = state
  return `
<a href=${href}>${ children }</a>
  `
}

let map = {
  anchor: Anchor,
  list: Ul,
  item: Li,
  headings: [
    Heading3,
    Heading4
  ]
}

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
  let actual = listFromObject(data, map)

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
  let actual = listFromObject(data, map)

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
  let actual = listFromObject(data, map)

  t.equal(strip(actual), strip(expected),'Should render object to list', actual)
  t.end()
})

test('should use custom component map', t => {
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
    <h3>
      <a href=one>
        one
      </a>
    </h3>

    <ul>
      <li>
        <h3>
          <a href=a>
            a
          </a>
        </h3>
      </li>
      <li>
        <h3>
          <a href=b>
            b
          </a>
        </h3>
      </li>
      <li>
        <h3>
          <a href=c>
            c
          </a>
        </h3>
      </li>
    </ul>
  </li>
  <li>
    <h3>
      <a href=two>
        two
      </a>
    </h3>
    <ul>
      <li>
        <h3>
          <a href=d>
            d
          </a>
        </h3>
      </li>
      <li>
        <h3>
          <a href=e>
            e
          </a>
        </h3>
      </li>
      <li>
        <h3>
          <a href=f>
            f
          </a>
        </h3>
      </li>
    </ul>
  </li>
</ul>
  `
  let actual = listFromObject(
    data,
    {
      list: Ul,
      item: Item
    }
  )
  t.equal(strip(actual), strip(expected), 'Should render object to custom list', actual)
  t.end()
})
