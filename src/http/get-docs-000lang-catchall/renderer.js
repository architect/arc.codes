const { escape } = require('querystring')
const frontmatter = require('tiny-frontmatter')
const Markdown = require('markdown-it')
const markdownClass = require('./markdown-class')
const markdownExternalAnchor = require('markdown-it-external-anchor')
const markdownToC = require('markdown-it-toc-and-anchor').default

const classMapping = require('./markdown-class-mappings')
const { escapeHtml } = Markdown().utils
const hljs = require('./highlight')
const highlight = require('./highlighter').bind(null, hljs, escapeHtml)

// reproduces the slugify algorithm used in markdown-it-external-anchor
const slugify = (s) => escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))

module.exports = function (fileContents) {
  let docOutline = ''
  const markdown = new Markdown({
    linkify: true,
    html: true,
    typographer: true,
    highlight
  })
    .use(markdownClass, classMapping)
    .use(markdownExternalAnchor)
    .use(markdownToC, {
      anchorLink: false,
      slugify,
      tocClassName: 'pageToC',
      tocFirstLevel: 2,
      tocLastLevel: 6,
      tocCallback: (tocMarkdown, tocArray, tocHtml) => { docOutline = tocHtml }
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
