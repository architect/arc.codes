/* eslint-env browser */
(function (){
  const activeLink = document.querySelector('a.active')
  const main = document.getElementById('main')
  const menuButton = document.getElementById('menu-button')
  const sidebar = document.getElementById('sidebar')
  const themeButton = document.getElementById('theme-button')
  const codeBlocks = document.querySelectorAll('pre.hljs')

  // Scroll active sidebar link into view
  if (activeLink)
    activeLink.scrollIntoView({
      behavior: 'smooth',
      block:  'center'
    })

  // Toggle sidebar on mobile
  main.onclick = () => sidebar.classList.remove('open')
  menuButton.onclick = () => sidebar.classList.toggle('open')

  /* Light/Dark Mode */
  // Get the user's theme preference from local storage, otherwise check OS default
  let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', currentTheme)

  themeButton.onclick = function toggleTheme () {
    let currentTheme = document.documentElement.getAttribute('data-theme')
    let targetTheme = currentTheme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme)
  }

  // Copy-Paste function for code blocks
  const buttonClassList = [
    'icon',
    'invisible',
    'visible-lg',
    'absolute',
    'top0',
    'right0',
    'mt-2',
    'mr-2',
    'cursor-pointer',
    'text-h0',
    'text-a2',
    'bg-unset',
    'fill-current',
  ]
  const svgCopy = '<svg><use xlink:href="#copy"></use></svg>'
  const svgCheck = '<svg><use xlink:href="#check"></use></svg>'
  for (const codeBlock of codeBlocks) {
    codeBlock.classList.add('relative')
    // create copy button
    const button = document.createElement('button')
    button.className = buttonClassList.join(' ')
    button.innerHTML = svgCopy

    button.onclick = (evt) => {
      const target = evt.target
      const parent = target.closest('pre')
      const codeText = parent.querySelector('code').textContent.trim()

      navigator.clipboard.writeText(codeText).then(
        () => {
          target.innerHTML = svgCheck
          setTimeout(() => target.innerHTML = svgCopy, 2000)
        },
        () => target.innerHTML = 'Error copying!'
      )
    }

    codeBlock.appendChild(button)
  }

  let bar = document.querySelector('.indicator')
  bar.style.width = getScrollPercent(main)
  main.onscroll = setReadPercent.bind(null, main)

  function setReadPercent (el) {
    bar.style.width = `${getScrollPercent(el)}%`
  }

  function getScrollPercent (el) {
    let body = document.body
    let scrollTop = 'scrollTop'
    let scrollHeight = 'scrollHeight'
    let currentTop = el[scrollTop] || body[scrollTop]
    let currentHeight = (el[scrollHeight] || body[scrollHeight]) - body.clientHeight
    return Math.floor((currentTop / currentHeight) * 100)
  }

  window.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
      const allSectionLinks = document.querySelectorAll('.right-sidebar li a')
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          const sectionLink = document.querySelector(`.right-sidebar a[href="#${id}"]`)
          allSectionLinks.forEach(link => link.classList.remove('active'))
          if (sectionLink) sectionLink.classList.add('active')
        }
      })
    }, {
      root: null,
      rootMargin: `0% 0% -80% 0%`,
      threshold: [ 1 ],
    })

    document.querySelectorAll('h2, h3, h4, h5, h6').forEach((header) => {
      observer.observe(header)
    })
  })
}())
