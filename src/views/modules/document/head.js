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

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://arc.codes/docs/en/guides/get-started/quickstart">
  <meta property="og:title" content="OpenJS Architect documentation">
  <meta property="og:description" content="Architect is the quickest way to build serverless web apps on AWS">

  <meta property="og:image" content="https://arc.codes/arc.codes.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://arc.codes/docs/en/guides/get-started/quickstart">
  <meta property="twitter:title" content="OpenJS Architect documentation">
  <meta property="twitter:description" content="Architect is the quickest way to build serverless web apps on AWS">

  <meta property="twitter:image" content="">

  <!-- OG Begin -->
  <link rel="icon" type="image/png" sizes="32x32" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-16.png">
  <link rel="icon" type="image/png" sizes="64x64" href="https://s3-us-west-2.amazonaws.com/arc.codes/architect-favicon-64.png">
  <link rel="stylesheet" type="text/css" href="/css/styles.css">
  <link rel="stylesheet" type="text/css" href="/css/index.css">
  <link rel="stylesheet" type="text/css" href="/css/syntax.css">
</head>
`
}
