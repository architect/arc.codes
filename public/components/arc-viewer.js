class ArcViewer extends HTMLElement {
  constructor() {
    super()
    this.labels = []
    this.clickHandler = this.clickHandler.bind(this)
    this.updateTabs = this.updateTabs.bind(this)
    this.defaultTab = this.getAttribute('default-tab')
    this.updateTabs(this.defaultTab)
    this.template = this.template.bind(this)
    const template = document.createElement('template')
    template.innerHTML = this.template()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.content = this.querySelector('[slot=contents]')
    this.initTabs = this.initTabs.bind(this)
  }

  template() {
    return `
<link rel="stylesheet" href="/css/styles.css">
<slot name="contents"></slot>
    `
  }

  clickHandler(e) {
    let target = e.target
    let label = target.dataset.label
    //remove active from all buttons
    let btns = this.shadowRoot.querySelectorAll('.arc--tab-btn')
    btns.forEach(b => b.classList.remove('active'))
    //add active to the target btn
    target.classList.add('active')
    this.updateTabs(label)
  }

  connectedCallback() {
    this.initTabs()
  }

  initTabs() {
    let fragment = new DocumentFragment()
    this.labels.forEach(l => {
      let btn = document.createElement('button')
      btn.addEventListener('click', this.clickHandler)
      btn.setAttribute('data-label', l)
      btn.innerHTML = l
      let active = l === this.defaultTab
      btn.classList.add(
        'arc--tab-btn',
        'pt-2',
        'pr0',
        'pb-2',
        'pl0',
        'bg-g1',
        'bg-h6',
        'bg-a0',
        'text-1',
        'text-center',
        'font-semibold',
        'cursor-pointer'
      )
      if (active) {
        btn.classList.add('active')
      }
      fragment.appendChild(btn)
    })
    this.shadowRoot.prepend(fragment)
  }


  updateTabs(str='') {
    let tabs = this.getElementsByTagName('arc-tab')
    for( let tab of tabs ) {
      let label = tab.getAttribute('label')
      tab.active = str === label
      this.labels.push(label)
    }
  }
}

customElements.define('arc-viewer', ArcViewer)
export default ArcViewer
