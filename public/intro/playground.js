/* eslint-env browser */
async function render() {
  let arc = document.querySelector('form textarea').value
  let base = window.location.pathname.startsWith('/production')? '/production' : ''
  let url = base + '/api/1/package?arc=' + encodeURIComponent(arc)
  let result = await fetch(url)
  let json = await result.json()

  // render preview
  let preview = document.querySelector('div#preview')
  preview.innerHTML = '<pre>' + JSON.stringify(json, null, 2) + '</pre>'

  // render sources
  let fun = r=> json.Resources[r].Type === 'AWS::Serverless::Function'
  let code = r=> json.Resources[r].Properties.CodeUri
  let sources = Object.keys(json.Resources).filter(fun).map(code)
  let tree = document.querySelector('div#tree')
  tree.innerHTML = sources.join('<br>')

  // render share input
  let share = `${window.location}?arc=${encodeURIComponent(arc)}`
  tree.innerHTML += `<br><input type=text name=share value="${share}">`
}

function main() {
  let button = document.querySelector('form button')
  let textarea = document.querySelector('form textarea')
  let query = new URLSearchParams(window.location.search)
  let arc = query.get('arc')
  if (!arc)
    arc = `@app\ntestapp\n\n@http\nget /`

  button.remove()
  textarea.value = arc
  textarea.addEventListener('input', render)
  render()
}

document.addEventListener('DOMContentLoaded', main)
