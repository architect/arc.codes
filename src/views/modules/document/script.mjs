import arc from '@architect/functions'

export default function Script (props) {
  props = props || {}
  const src = props.src
  return src ? `
<script src=${arc.static(src)} type="module" crossorigin=""></script>
  `
    : ''
}
