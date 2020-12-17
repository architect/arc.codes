(function() {
  let btn = document.getElementById('pkg-submit')
  btn.remove()

  const form = document.getElementById('pkg-form')
  form.onsubmit = submit

  const shareBtn = document.getElementById('pkg-share')
  shareBtn.onclick = copyShare

  const input = document.getElementById('pkg-input')
  input.addEventListener('input', getPreview)

  let query = new URLSearchParams(window.location.search)
  let arc = query.get('arc')
  if (!arc) {
    arc = `@app\nmyapp\n\n@http\nget /`
  }

  input.value = arc
  getPreview()
}())


function copyShare(e) {
  e.preventDefault()
  let shareBtn = e.target
  let input = document.getElementById('pkg-input')
  let arc = input.value
  let shareUrl = `${window.location}?arc=${encodeURIComponent(arc)}`
  navigator.clipboard.writeText(shareUrl)
  shareBtn.innerHTML = 'Copied to clipboard'
  setTimeout(function resetButton() {
    shareBtn.innerHTML = 'Share'
  }, 2000)
}

async function getPreview() {
  console.log('GET PREVIEW')
  const input = document.getElementById('pkg-input')
  const arc = input.value
  const url = `/api/1/package?arc=${encodeURIComponent(arc)}`
  try {
    let cfn = JSON.stringify(await (await fetch(url)).json(), null, 2)
    update(cfn)
  }
  catch(e) {
    console.error(e)
  }
}

function submit(e) {
  e.preventDefault()
  getPreview()
}

function update(cfn) {
  const preview = document.getElementById('preview')
  preview.innerHTML = cfn
}

