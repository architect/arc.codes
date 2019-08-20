/* eslint-env browser */
let els = document.querySelectorAll('code.language-arc')
for (let item of els) {
  let arc = item.innerText.split('\n')
  let parent = item.parentNode
  parent.classList.add('language-arc')
  item.remove()
  let html = ``
  arc.forEach(line=> {
    if (line.startsWith('#')) {
      html += `<code style="color:grey;">${line}\n</code>`
    }
    else if (line.startsWith('@')) {
      html += `<code style="color:cyan;font-weight:bolder;">${line}\n</code>`
    }
    else {
      let bits = line.split(' ')
      let verbs = 'get post put delete patch'.split(' ')
      if (verbs.includes(bits[0])) {
        let first = bits.shift()
        html += `<code style="color:lightseagreen;"><span>${first}</span> <span>${bits.join(' ')}</span></code>`
      }
      else {
        html += `<code style="color:lightseagreen;">${line}\n</code>`
      }
    }
  })
  parent.innerHTML = html
}

