/* eslint-env browser */
(function (){
  /* Light/Dark Mode */
  // Get the user's theme preference from local storage, otherwise check OS default
  let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', currentTheme)
}())
