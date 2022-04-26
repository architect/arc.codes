import arc from '@architect/functions'

const stripCode = str => str.replace(/\<\/?code\>/g, '')

export default function Head (props = {}) {
  const { category, description, lang = 'en', path, title } = props
  const descriptionContent = description || 'Architect documentation'
  let fullTitle = ''
  if (category && title)
    fullTitle += `${category} > ${title} - `
  else if (title)
    fullTitle += `${title} - `
  fullTitle += 'Architect documentation'

  return `
<head>
<!-- Primary meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1">
<meta name="description" content="${stripCode(descriptionContent)}">
<meta name="image" content="https://arc.codes${arc.static('arc.codes.png')}">
<title>${stripCode(fullTitle)}</title>

<!-- schema.org -->
<meta itemprop="name" content="${stripCode(fullTitle)}">
<meta itemprop="description" content="${stripCode(descriptionContent)}">
<meta itemprop="image" content="https://arc.codes${arc.static('arc.codes.png')}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${stripCode(fullTitle)}">
<meta name="twitter:description" content="${stripCode(descriptionContent)}">
<meta name="twitter:site" content="@begin">
<meta name="twitter:creator" content="@begin">
<meta name="twitter:image:src" content="https://arc.codes${arc.static('arc.codes.png')}">

<!-- Open Graph -->
<meta name="og:title" content="${stripCode(fullTitle)}">
<meta name="og:description" content="${stripCode(descriptionContent)}">
<meta name="og:image" content="https://arc.codes${arc.static('arc.codes.png')}">
<meta name="og:url" content="https://arc.codes/${path}">
<meta name="og:site_name" content="OpenJSF Architect">
<meta name="og:type" content="website">

<!-- Styles + favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="https://assets.arc.codes/architect-favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://assets.arc.codes/architect-favicon-16.png">
<link rel="icon" type="image/png" sizes="64x64" href="https://assets.arc.codes/architect-favicon-64.png">
<link rel="stylesheet" type="text/css" href="${arc.static('/css/styles.css')}">
<link rel="stylesheet" type="text/css" href="${arc.static('/css/index.css')}">
<link rel="stylesheet" type="text/css" href="${arc.static('/css/docsearch.css')}">
<link rel="stylesheet" type="text/css" href="${arc.static('/css/syntax.css')}">

<!-- Canonical -->
<link rel="canonical" href="https://arc.codes/${path}" />

<!-- Algolia search -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.css" />
<meta name="docsearch:language" content="${lang}" />
</head>
`
}
