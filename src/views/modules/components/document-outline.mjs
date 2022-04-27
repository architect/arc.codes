export default function DocumentOutline (props = {}) {
  const {
    tocHtml = '',
    slug = '',
    title = 'Top',
  } = props

  return `
<div class="pl0 w-toc sticky top0 right-sidebar">
  <div class="pt0 ml-none-lg">
    <a
      id="top-link"
      href="#${slug}"
      class="block mb-1 font-bold text-p1 text-h1"
    >
      ↑ ${title}
    </a>
    ${tocHtml.replace(/class="mb1"/g, 'class="list-none"')}
  </div>
</div>
  `
}


