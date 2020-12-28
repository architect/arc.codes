class ArcTab extends HTMLElement {
  constructor() {
    super()
    const template = document.createElement('template')
    this.template = this.template.bind(this)
    template.innerHTML = this.template()
    this.attachShadow({ mode: 'open' })
    this.updateStyles = this.updateStyles.bind(this)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.content = this.querySelector('[slot=content]')
  }

  template() {
    return `
<link rel="stylesheet" href="/css/styles.css">
<slot name=content></slot>
    `
  }

  connectedCallback() {
    this.updateStyles()
  }

  set active(value) {
    const isActive = Boolean(value)
    if (isActive) {
      this.setAttribute('active', '')
    }
    else {
      this.removeAttribute('active')
    }
  }

  set label(value) {
    this.setAttribute('label', value)
  }

  get label() {
    return this.getAttribute('label')
  }

  get active() {
    return this.hasAttribute('active')
  }

  static get observedAttributes() {
    return [
      'active'
    ]
  }

  attributeChangedCallback(name, o, n) {
    if(name === 'active') {
      if (o !== n) {
        this.updateStyles()
      }
    }
  }

  updateStyles() {
    if(this.hasAttribute('active')) {
      this.content.classList.remove('hidden')
    }
    else {
      this.content.classList.add('hidden')
    }
  }
}

customElements.define('arc-tab', ArcTab)
export default ArcTab
