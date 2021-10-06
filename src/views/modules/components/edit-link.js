export default function EditLink (state = {}) {
  const { editURL } = state
  return editURL ? `
<div class="flex justify-end mt4">
  <a href="${editURL}" target="_blank" rel="noreferrer" class="text1 text-p1 text-h1 text-a2 no-underline font-semibold">Edit this doc on Github →</a>
</div>
` : ''
}
