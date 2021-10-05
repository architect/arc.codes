export default function Banner (state = {}) {
  const { enabled } = state

  return enabled ? `
<div
  class="
    pt-1-lg
    pr2-lg
    pb0-lg
    pl2-lg
    pt-2
    pr-2
    pb-1
    pl-2
    flex
    items-center
    justify-center
    text-center
    top0
    bg-g1
    col-start-1
    col-end-3
    text-g8
  "
>
  <span>
    Community chat has moved to
    <a href="https://discord.gg/y5A2eTsCRX"
      class="font-medium text-p1 text-h1"
      target="_blank" rel="noopener noreferrer"
    >
      Discord
    </a>
  </span>
</div>
  ` : ''
}
