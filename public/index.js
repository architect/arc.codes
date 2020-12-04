 (function(){
    document
       .querySelector('a.active')
       .scrollIntoView({
         behavior: 'smooth',
         block:  'center'
        })
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
 }())
