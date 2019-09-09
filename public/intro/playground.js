/* eslint-env browser */
async function render () {
  let arc = document.querySelector('form textarea').value
  let base = window.location.pathname.startsWith('/production')
    ? '/production'
    : ''
  let url = `${base}/api/1/package?arc=${encodeURIComponent(arc)}`
  let result = await fetch(url)
  let json = await result.json()

  // render preview
  let preview = document.querySelector('div#preview')
  let code = JSON.stringify(json, null, 2)
  preview.innerHTML = cloudFormation({code})

  // render share input
  let share = `${window.location}?arc=${encodeURIComponent(arc)}`
  let shareInput = document.getElementById('js-share-input')
  shareInput.setAttribute('value', share)
  let shareButton = document.getElementById('js-share-button')
  shareButton.onclick = function () {
    shareInput.select()
    document.execCommand('copy')
    shareButton.innerHTML = 'Copied to clipboard'
    setTimeout(function resetButton () {
      shareButton.innerHTML = 'Share'
    }, 2000)
  }
}

function cloudFormation (props) {
  props = props || {}
  let code = props.code || ''
  return `
<pre>
  ${code}
</pre>
  `
}

function main () {
  let button = document.querySelector('form button')
  let textarea = document.querySelector('form textarea')
  let query = new URLSearchParams(window.location.search)
  let arc = query.get('arc')
  if (!arc) {
    arc = `@app\ntestapp\n\n@http\nget /`
  }

  button.remove()
  textarea.value = arc
  textarea.addEventListener('input', render)
  render()
}

document.addEventListener('DOMContentLoaded', main)
