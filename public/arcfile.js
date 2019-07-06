/* eslint-env browser */
let els = document.querySelectorAll('code.language-arc')
for (let item of els) {
  let arc = item.innerText.split('\n')
  let parent = item.parentNode
  parent.classList.add('arcfile')
  item.remove()
  let styles = 'line-height:1em;font-size:1.2em;border:none;margin:0;border-radius:0;padding:0 0 10px 20px;margin:0;background:black;'
  let index = 0
  let html = ``
  arc.forEach(line=> {

    if (index === 0) {
      styles = styles + 'padding-top:20px;'
    }
    else {
      styles = styles.replace('padding-top:20px;', '')
    }

    if (line.startsWith('#')) {
      html += `<code style="${styles}color:grey;">${line}\n</code>`
    }
    else if (line.startsWith('@')) {
      html += `<code style="${styles}color:cyan;font-weight:bolder;">${line}\n</code>`
    }
    else {
      let bits = line.split(' ')
      let verbs = 'get post put delete patch'.split(' ')
      if (verbs.includes(bits[0])) {
        let first = bits.shift()
        html += `<code style="${styles}"><span style="color:lightseagreen;font-weight:bolder;">${first}</span> <span style="color:lightseagreen;">${bits.join(' ')}</span></code>`
      }
      else {
        html += `<code style="${styles}color:lightseagreen;">${line}\n</code>`
      }
    }
    index += 1
  })
  parent.innerHTML = html
}

