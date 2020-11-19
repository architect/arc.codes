export default function Head (props={}) {
  let { category, description, title } = props
  let fullTitle = category && title
    ? `${category} > ${title} - Architect documentation`
    : 'Architect documentation'
  let descriptionContent = description || 'Architect documentation'

  return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1">
  <meta name="description" content="${descriptionContent}">
  <title>${fullTitle}</title>
  <link rel="stylesheet" type="text/css" href="/_static/css/styles.css">
  <link rel="stylesheet" type="text/css" href="/_static/css/index.css">
  <link rel="stylesheet" type="text/css" href="/_static/css/syntax.css">
</head>
`
}
