export default function Head (props = {}) {
  let { category, description, title } = props
  let fullTitle = category && title
    ? `${category} > ${title} - Architect documentation`
    : 'Architect documentation'
  let descriptionContent = description || 'Architect documentation'

  return `
<head>
<!-- Primary Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1">
<meta name="description" content="${descriptionContent}">
<title>${fullTitle}</title>

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
<link rel="icon" type="image/png" sizes="32x32" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-16.png">
<link rel="icon" type="image/png" sizes="64x64" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-64.png">
<link rel="stylesheet" type="text/css" href="/css/styles.css">
<link rel="stylesheet" type="text/css" href="/css/index.css">
<link rel="stylesheet" type="text/css" href="/css/syntax.css">
</head>
`
}
