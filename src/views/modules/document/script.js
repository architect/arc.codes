export default function Script (props) {
  props = props || {}
  let src = props.src
  return src ? `
<script src=${src} type="module" crossorigin=""></script>
  `
    : ''
}
