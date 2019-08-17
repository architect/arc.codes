// Make langues into a tabbed 
// So Ruby folk only have to see Ruby examples, JS folk JS examples, etc.

const PRETTY_LANGUAGES = {
  'javascript': 'JavaScript',
  'ruby': 'Ruby',
  'python': 'Python',
}

const LANGUAGES = Object.keys(PRETTY_LANGUAGES)

window.prefferedLanguage = LANGUAGES[0]

// See https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

let codeExamples = document.querySelectorAll('section.code-examples')

// Find anything in a <section class="code-examples"> block and replace it
// with our pretty UI
codeExamples.forEach(function(codeExample){
  var examples = ''
  var languageOptions = ''

  LANGUAGES.forEach(function(language, index){
    // Find each example
    var exampleCode = codeExample.querySelector(`.language-${language}`)

    var isSelected = language === window.prefferedLanguage ? 'selected' : ''

    // Add it (as text) to our list of examples
    examples += `<section class="example ${isSelected} ${language}">${exampleCode.outerHTML}</section>`

    // Add option to <select>
    languageOptions += `<option ${isSelected} value="${language}">${PRETTY_LANGUAGES[language]}</option>`
  })  

  var newHTML = htmlToElement(`
    <section class="code-examples">
      <header>
        <h4>EXAMPLE</h4>
        <select>
          ${languageOptions}
        </select>
      </header>
      ${examples}
    </section>
  `)

  codeExample.replaceWith(newHTML)
})

// Make `select` elements change the preferred language on every example
document.querySelectorAll('.code-examples select').forEach(function(selectElement){
  selectElement.addEventListener('change', function(event){
    window.prefferedLanguage = event.target.value
    // TODO: We really should save this to the user's cookies
    // So they don't have to change it on other pages, but anyway

    // Update the selected options
    document.querySelectorAll('.code-examples select option').forEach(function(optionElement){
      if ( optionElement.textContent === window.prefferedLanguage ) {
        optionElement.classList.add('selected')
      } else {
        optionElement.classList.remove('selected')
      }
    })

    // Update the selected code examples
    document.querySelectorAll('.code-examples .example').forEach(function(exampleElement){
      if ( exampleElement.classList.contains(window.prefferedLanguage) ) {
        exampleElement.classList.add('selected')
      } else {
        exampleElement.classList.remove('selected')
      }
    })
  })
})