async function render() {
  let arc = document.querySelector('form textarea').value
  let base = window.location.pathname.startsWith('/production')? '/production' : '' 
  let url = base + '/api/1/package?arc=' + encodeURIComponent(arc)
  let result = await fetch(url)
  let json = await result.json()
  let preview = document.querySelector('div#preview')
  preview.innerHTML = '<pre>' + JSON.stringify(json, null, 2) + '</pre>'
}

function main() {
  let form = document.querySelector('form')
  let button = document.querySelector('form button')
  let textarea = document.querySelector('form textarea')

  button.remove()
  textarea.addEventListener('input', render)
  render()
}

document.addEventListener('DOMContentLoaded', main)
