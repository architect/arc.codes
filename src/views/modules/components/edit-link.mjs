export default function EditLink (state = {}) {
  const { editURL } = state
  return editURL ? `
<a href="${editURL}" target="_blank" rel="noreferrer" class="text1 text-p1 text-h1 text-a2 no-underline font-semibold">Edit this doc on GitHub →</a>
` : ''
}
