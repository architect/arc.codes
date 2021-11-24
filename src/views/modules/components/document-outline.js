export default function DocumentOutline (props = {}) {
  const {
    docOutline = '',
    titleSlug = '',
    title = 'Top',
  } = props

  return `
<div class="pl0 w-toc sticky top0 right-sidebar">
  <div class="pt0 ml-none-lg">
    <a
      id="top-link"
      href="#${titleSlug}"
      class="block mb-1 font-bold text-p1 text-h1"
    >
      ↑ ${title}
    </a>
    ${docOutline.replace(/class="mb1"/g, 'class="list-none"')}
  </div>
</div>
  `
}


