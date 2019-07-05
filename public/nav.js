for (let item of document.querySelectorAll('.nav > nav ul li b')) {
  item.addEventListener('click', function click(e) {
    e.target.nextSibling.classList.toggle('hide')
  })
}
// hide guides/ref
// show guides/ref
