const test = require('tape')
const render = require('../../src/http/get-docs-000lang-catchall/renderer')

const TITLE = 'Test Doc'
const TITLE_SLUG = 'test-doc'
const CATEGORY = 'Testing'
const DESCRIPTION = 'Make sure we get Markdown'
const file = `
---
title: ${TITLE}
category: ${CATEGORY}
description: ${DESCRIPTION}
---

> Architect is a simple tool to build and deliver powerful cloud function-based web apps and APIs

## Create a new project

\`\`\`arc
@app

@http
get /
\`\`\`

## Deploy to AWS

[AWS is great](https://aws.amazon.com/)

### $ubsection 2.1?

## Section 3
`.trim()

test('custom Markdown renderer', (t) => {
  const result = render(file)

  t.equal(result.title, TITLE, 'title attribute is present')
  t.equal(result.category, CATEGORY, 'category attribute is present')
  t.equal(result.description, DESCRIPTION, 'description attribute is present')
  t.equal(result.titleSlug, TITLE_SLUG, 'titleSlug attribute is generated')
  t.ok(typeof result.docOutline === 'string', 'docOutline is a string of HTML')
  t.ok(typeof result.children === 'string', 'children is a string of HTML')
  t.ok(result.children.indexOf('id="create-a-new-project"') > 0, 'Headings are linkified')
  t.ok(result.children.indexOf('id="%24ubsection-2.1%3F"') > 0, 'Complex headings are linkified')
  t.ok(result.children.indexOf('target="_blank">AWS is great</a>') > 0, 'External link targets = blank')
  t.ok(result.children.indexOf('<pre class="hljs ') > 0, 'highlight.js is working')

  t.end()
})
