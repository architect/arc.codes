const test = require('tape')
const createGroupIndex = require('../src/http/get-docs-000lang-catchall/group-index')

const fakeToc = {
  Foo: [
    {
      'Arcu': 'nunc id cursus'.split(' '),
      'Dictum': 'ullamcorper velit sed'.split(' '),
      'Varius': [
        'iaculis',
        {
          LOREM: [
            'ipsum',
            'dolor',
            'sit'
          ]
        }
      ]
    }
  ],
  Bar: [ {
    'pharetra': 'convallis posuere morbi leo'.split(' '),
    'convallis': 'posuere morbi leo'.split(' '),
    'posuere': 'morbi leo'.split(' '),
    'morbi': [ 'leo' ]
  } ],
  Baz: 'fusce ut placerat orci nulla'.split(' ')
}

test('createGroupIndex: validate', t => {
  t.equal(typeof createGroupIndex, 'function', 'it is a function')
  t.end()
})

test('createGroupIndex: top level group', t => {
  t.deepEqual(
    createGroupIndex([ 'baz' ], fakeToc),
    {
      title: 'Baz',
      groupPages: [ 'fusce', 'ut', 'placerat', 'orci', 'nulla' ]
    },
    'extracts top level group'
  )
  t.end()
})

test('createGroupIndex: simple group from shallow path', t => {
  t.deepEqual(
    createGroupIndex([ 'bar', 'posuere' ], fakeToc),
    {
      title: 'posuere',
      category: 'Bar',
      groupPages: [ 'morbi', 'leo' ]
    },
    'extracts a shallow list'
  )

  t.deepEqual(
    createGroupIndex([ 'foo', 'dictum' ], fakeToc),
    {
      title: 'Dictum',
      category: 'Foo',
      groupPages: [ 'ullamcorper', 'velit', 'sed' ]
    },
    'extracts an uppercase shallow list'
  )

  t.end()
})

test('createGroupIndex: nested list from path', t => {
  t.deepEqual(
    createGroupIndex([ 'foo', 'varius' ], fakeToc),
    {
      title: 'Varius',
      category: 'Foo',
      groupPages: [ 'iaculis', { LOREM: [ 'ipsum', 'dolor', 'sit' ] } ]
    },
    'extracts nested list'
  )

  t.end()
})

test('createGroupIndex: nested group from path', t => {
  t.deepEqual(
    createGroupIndex([ 'foo', 'varius', 'lorem' ], fakeToc),
    {
      title: 'LOREM',
      category: 'Foo',
      groupPages: [ 'ipsum', 'dolor', 'sit' ]
    },
    'extracts nested group from list'
  )

  t.end()
})

test('createGroupIndex: path without children', t => {
  t.notOk(
    createGroupIndex([ 'foo', 'varius', 'iaculis' ], fakeToc),
    'returns falsy for dead end'
  )

  t.end()
})
