async function render() {
  let arc = document.querySelector('form textarea').value
  let base = window.location.pathname.startsWith('/production')? '/production' : ''
  let url = base + '/api/1/package?arc=' + encodeURIComponent(arc)
  let result = await fetch(url)
  let json = await result.json()
  let fun = r=> json.Resources[r].Type === 'AWS::Serverless::Function'
  let code = r=> json.Resources[r].Properties.CodeUri
  let sources = Object.keys(json.Resources).filter(fun).map(code)
  let preview = document.querySelector('div#preview')
  preview.innerHTML = '<pre>' + JSON.stringify(json, null, 2) + '</pre>'
  let tree = document.querySelector('div#tree')
  tree.innerHTML = sources.join('<br>')
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
