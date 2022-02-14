let stripCode = str => str.replace(/\<\/?code\>/g, '')

export default function Head (props = {}) {
  let { category, description, lang = 'en', title } = props
  let descriptionContent = description || 'Architect documentation'
  let fullTitle = ''
  if (category && title)
    fullTitle += `${category} > ${title} - `
  else if (title)
    fullTitle += `${title} - `
  fullTitle += 'Architect documentation'

  return `
<head>
<!-- Primary Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1">
<meta name="description" content="${stripCode(descriptionContent)}">
<title>${stripCode(fullTitle)}</title>

<!-- Search Engine -->
<meta name="description" content="Architect is the quickest way to build serverless web apps on AWS.">
<meta name="image" content="https://arc.codes/arc.codes.png">

<!-- Schema.org for Google -->
<meta itemprop="name" content="Architect documentation">
<meta itemprop="description" content="Architect is the quickest way to build serverless web apps on AWS.">
<meta itemprop="image" content="https://arc.codes/arc.codes.png">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Architect documentation">
<meta name="twitter:description" content="Architect is the quickest way to build serverless web apps on AWS.">
<meta name="twitter:site" content="@begin">
<meta name="twitter:creator" content="@begin">
<meta name="twitter:image:src" content="https://arc.codes/arc.codes.png">

<!-- Open Graph general (Facebook, Pinterest & Google+) -->
<meta name="og:title" content="Architect documentation">
<meta name="og:description" content="Architect is the quickest way to build serverless web apps on AWS.">
<meta name="og:image" content="https://arc.codes/arc.codes.png">
<meta name="og:url" content="https://arc.codes/">
<meta name="og:site_name" content="Architect documentation">
<meta name="og:type" content="website">

<!-- Styles/Favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="https://assets.arc.codes/architect-favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://assets.arc.codes/architect-favicon-16.png">
<link rel="icon" type="image/png" sizes="64x64" href="https://assets.arc.codes/architect-favicon-64.png">
<link rel="stylesheet" type="text/css" href="/css/styles.css">
<link rel="stylesheet" type="text/css" href="/css/index.css">
<link rel="stylesheet" type="text/css" href="/css/docsearch.css">
<link rel="stylesheet" type="text/css" href="/css/syntax.css">

<!-- Algolia -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.css" />
<meta name="docsearch:language" content="${lang}" />
</head>
`
}
