import ArcTab from './arc-tab.js'

class ArcTabBar extends HTMLElement {
  constructor() {
    self = super()
    self.labels = []
    self.initTabs()

    const template = document.createElement('template')
    template.innerHTML = self.template()
    self.attachShadow({ mode: 'open' })
    self.shadowRoot.appendChild(template.content.cloneNode(true))
    self.content = self.querySelector('[slot=content]')
  }

  template() {
    return `
<link rel="stylesheet" href="/css/styles.css">
<div>
  <slot name=content></slot>
</div>
    `
  }

  connectedCallback() {

  }

  initTabs() {
    let tabs = self.getElementsByTagName('arc-tab')
    for( let tab of tabs ) {
      let label = tab.getAttribute('label')
      self.labels.push(label)
    }
      console.log('LABELS: ', self.labels)
  }
}

// customElements.define('arc-tab-bar', ArcTabBar)
export default ArcTabBar
