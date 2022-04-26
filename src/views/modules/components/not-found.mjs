export default function FourOFour (state = {}) {
  const { term } = state
  return `
<div class="pt2 pt4-lg">
  <h3 class="text2-lg leading0">
    404: ${term ? `"${term}"` : 'that one'} is missing
  </h3>
  <p>
    Try using the search.
  </p>
</div>
`
}
