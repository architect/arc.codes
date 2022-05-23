export default function EditLink ({ active = '' }) {
  let editURL = 'https://github.com/architect/arc.codes/edit/main/src/views/'
  editURL += `${active}.md`

  return `
<div class="flex justify-end mt4">
  <a href="${editURL}" target="_blank" rel="noreferrer" class="text1 text-p1 text-h1 text-a2 no-underline font-semibold">Edit this doc on Github →</a>
</div>
`
}
