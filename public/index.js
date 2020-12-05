 (function(){
    // Scroll active sidebar link into view
    document
       .querySelector('a.active')
       .scrollIntoView({
         behavior: 'smooth',
         block:  'center'
        })

    // Toggle sidebar on mobile
    let menuButton = document
       .getElementById('menu-button')
    let sidebar = document
       .getElementById('sidebar')
    let main = document
       .getElementById('main')

    main.onclick = function hideSidebar() {
      sidebar.classList.remove('open')
    }

    menuButton.onclick = function toggleSidebar() {
      sidebar.classList.toggle('open')
    }

    // Show percentage of page read
    let bar = document.querySelector('.hairline')
    bar.style.width = getScrollPercent(main)
    main.onscroll = setReadPercent

    function setReadPercent() {
      bar.style.width = `${getScrollPercent(main)}%`
    }

    function getScrollPercent(el) {
      let body = document.body
      let scrollTop = 'scrollTop'
      let scrollHeight = 'scrollHeight'
      let currentTop = el[scrollTop] || body[scrollTop]
      let currentHeight = (el[scrollHeight] || body[scrollHeight]) - body.clientHeight
      return Math.floor((currentTop / currentHeight) * 100);
    }


 }())
