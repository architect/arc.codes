class ArcTab extends HTMLElement {
  constructor() {
    self = super()
    const template = document.createElement('template')
    template.innerHTML = self.template()
    self.attachShadow({ mode: 'open' })
    self.shadowRoot.appendChild(template.content.cloneNode(true))
    self.content = self.querySelector('[slot=content]')
  }

  template() {
    return `
<link rel="stylesheet" href="/_static/css/styles.css">
<div
  class="
    hidden
  "
>
  <slot name=content></slot>
</div>
    `
  }

  static get observedAttributes() {
    return [
      'active'
    ]
  }
}

// customElements.define('arc-tab', ArcTab)
export default ArcTab
