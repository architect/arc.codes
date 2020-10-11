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
  let preview = document.getElementById('js-preview')
  let code = JSON.stringify(json, null, 2)
  preview.innerHTML = cloudFormation({ code })

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

  let arcColumn = document.getElementById('js-arc-column')

  // Drag divider
  let divider = document.getElementById('js-divider')
  divider.onmousedown = function down () {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', resizeEnd)
  }

  function resize (e) {
    let windowX = e.pageX
    let bounds = arcColumn.getBoundingClientRect()
    let left = bounds.left
    let newWidth = windowX + left
    arcColumn.style['min-width'] = `${newWidth}px`
  }

  function resizeEnd () {
    window.removeEventListener('mousemove', resize)
  }
}

function cloudFormation (props) {
  props = props || {}
  let code = props.code || ''
  return `
<pre id="js-pre" class="font-size-0">
  ${code}
</pre>
  `
}

function main () {
  let button = document.getElementById('js-submit')
  let textarea = document.getElementById('js-textarea')
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
