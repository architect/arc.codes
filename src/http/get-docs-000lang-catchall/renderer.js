const { escape } = require('querystring')
const frontmatter = require('tiny-frontmatter')
const Markdown = require('markdown-it')
const markdownClass = require('./markdown-class')
const markdownExternalAnchor = require('markdown-it-external-anchor')
const markdownToC = require('markdown-it-toc-and-anchor').default
const container = require('markdown-it-container')
const markdownItAttrs = require('markdown-it-attrs')

const classMapping = require('./markdown-class-mappings')
const { escapeHtml } = Markdown().utils
const hljs = require('./highlight')
const highlight = require('./highlighter').bind(null, hljs, escapeHtml)

// reproduces the slugify algorithm used in markdown-it-external-anchor
const slugify = (s) => escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))

module.exports = function (fileContents) {
  let docOutline = ''
  const tags = []
  const markdown = new Markdown({
    html: true,
    linkify: true,
    typographer: true
  })
    .use(markdownClass, classMapping)
    .use(markdownExternalAnchor)
    .use(markdownItAttrs)
    .use(markdownToC, {
      anchorLink: false,
      slugify,
      tocClassName: 'pageToC',
      tocFirstLevel: 2,
      tocLastLevel: 6,
      tocCallback: (tocMarkdown, tocArray, tocHtml) => { docOutline = tocHtml }
    })
    .use(container, 'wc', {
      render: (tokens, idx) => {
        const m = tokens[idx].info.trim().match(/^wc\s+(.*)$/)
        if (m && m[1]) {
          tags.push(m[1])
        }
        if (tokens[idx].nesting === 1) {
          return `<${m[1]}>`
        }
        return `</${tags.pop()}> \n`
      }
    })

  const { attributes, body } = frontmatter(fileContents)
  const children = markdown.render(body)

  return {
    ...attributes,
    children,
    docOutline,
    titleSlug: slugify(attributes.title),
  }
}
