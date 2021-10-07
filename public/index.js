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
  main.onclick = function hideSidebar () {
    sidebar.classList.remove('open')
  }

  menuButton.onclick = function toggleSidebar () {
    sidebar.classList.toggle('open')
  }

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

  // Show percentage of page read on desktop
  let bar = document.querySelector('.indicator')
  let isDesktop = window.innerWidth > 768

  if (isDesktop) {
    // If we want this to work on mobile
    // we need to add a second function
    // for handling window.onscroll
    let el = main
    bar.style.width = getScrollPercent(el)
    el.onscroll = setReadPercent.bind(null, el)
  }

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
