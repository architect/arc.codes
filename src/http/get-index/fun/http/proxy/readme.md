example usage

```javascript
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({

  // force index.html no matter the folder depth 
  spa: true|false,
 
  // transform plugins per filetype
  plugins: {
    jsx: [
      '@architect/proxy-plugin-jsx',          // plugins run in order
      '@architect/proxy-plugin-bare-imports', 
      '@architect/proxy-plugin-mjs-urls' 
    ],
    tsx: [
      '@architect/proxy-plugin-tsx',     // strip typescript declarations
      '@architect/proxy-plugin-mjs-urls' // resolve imports urls
    ],
    mjs: [
      '@architect/proxy-plugin-mjs-urls'
    ],
    md: [
      '@architect/proxy-plugin-md',           // plugins are npm modules
      function layout(key, {headers, body}) { // or functions
        body = `<b>hi from layout</b><p>${body}</p><i>by from layout</i>`
        return {headers, body}
      }
    ],
    scss: [
      '@architect/proxy-plugin-sass'
    ],
  },

  // example of custom plugin configuration (for @architect/proxy-plugin-bare-imports)
  imports: {
    'preact': '/vendor/preact.mjs'
  }
 
  // the proxy also allows for aliasing full paths to fully qualified paths with an extension
  alias: {
   '/': '/templates/index.jade',
   '/css': '/styles/index.scss',
   '/wp_admin.php': '/lol.jsx'
  }
})
```
