/* eslint-env browser */
(function (){
  let activeLink = document.querySelector('a.active')
  let main = document.getElementById('main')
  let menuButton = document.getElementById('menu-button')
  let sidebar = document.getElementById('sidebar')
  let themeButton = document.getElementById('theme-button')

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
}())
