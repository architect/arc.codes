import arc from '@architect/functions'
import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'
import { getStyles } from '@enhance/arc-plugin-styles'

import elements from '../../landing/elements.mjs'

export async function handler () {
  const html = enhance({
    styleTransforms: [ styleTransform ],
    elements,
  })

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: html`
<!DOCTYPE html>
<html lang="en" class="overflow-x-hidden overflow-y-auto">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Architect</title>
    ${getStyles.styleTag()}
    <style>
      @font-face {
        font-family: Montserrat;
        src: url('${arc.static('fonts/montserrat-subset-var.woff2')}') format("woff2-variations");
        src: url('${arc.static('fonts/montserrat-subset-var.woff2')}') format("woff2") tech("variations");
        font-weight: 100 900;
      }

      @font-face {
        font-family: Montserrat;
        src: ${arc.static('font/montserrat-italic-subset-var.woff2')} format("woff2-variations");
        src: ${arc.static('font/montserrat-italic-subset-var.woff2')} format("woff2") tech("variations");
        font-weight: 100 900;
        font-style: italic;
      }

      body {
        background-color: #efefef;
        color: var(--body);
        scrollbar-color: var(--gray-300) transparent;
        scrollbar-width: thin;
      }

      ::-webkit-scrollbar {
        inline-size: 8px;
        block-size: 8px;
      }

      ::-webkit-scrollbar-track {
        background-color: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--gray-300);
        border-radius: 8px;
      }

      ::-webkit-scrollbar-corner {
        background-color: transparent;
      }

      .underline {
        text-underline-offset: 0.075em;
      }
    </style>
    <link rel="stylesheet" href="${arc.static('css/landing-syntax.min.css')}" />
  </head>
  <body class="font-sans leading4 overflow-x-hidden overflow-y-auto">
    <arc-landing></arc-landing>
  </body>
</html>
`
  }
}
