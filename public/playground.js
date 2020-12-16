init()

function init() {
  initForm()
  initButton()
  initInput()
  initShare()
}

function initButton() {
  let btn = document.getElementById('pkg-submit')
  btn.remove()
}

function initForm() {
  const form = document.getElementById('pkg-form')
  form.onsubmit = submit
}

function initShare() {
  const shareBtn = document.getElementById('pkg-share')
  shareBtn.onclick = copyShare
}

function initInput() {
  let input = document.getElementById('pkg-input')
  let query = new URLSearchParams(window.location.search)
  let arc = query.get('arc')
  if (!arc) {
    arc = `@app\nmyapp\n\n@http\nget /`
  }
  input.addEventListener('input', getPreview)
  input.value = arc
  getPreview()
}

function copyShare(e) {
  e.preventDefault()
  const shareBtn = document.getElementById('pkg-share')
  let input = document.getElementById('pkg-input')
  let arc = input.value
  const shareUrl = `${window.location}?arc=${encodeURIComponent(arc)}`
  navigator.clipboard.writeText(shareUrl)
  shareBtn.innerHTML = 'Copied to clipboard'
  setTimeout(function resetButton () {
    shareBtn.innerHTML = 'Share'
  }, 2000)
}

async function getPreview() {
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

