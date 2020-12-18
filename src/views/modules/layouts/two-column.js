import Sidebar from '../components/sidebar.js'

export default function TwoColumn (props = {}) {
  let { children } = props

  return `
<div
  class="
    h-full-lg
    grid-lg
  "
>
  <header
    class="
      pt-1
      pr2
      pb-1
      pl2
      sticky
      static-lg
      flex
      justify-between
      items-center
      top0
      bg-g9
      col-start-1
      col-end-3
    "
  >
  </header>
  ${Sidebar(props)}
  <main
    class="
      col-start-2
      p3
      overflow-auto
    "
  >
    ${children}
</div>
  `
}
