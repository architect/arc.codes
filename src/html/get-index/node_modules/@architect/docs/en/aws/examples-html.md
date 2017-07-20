# @html example

```arc
@app
hello

@html
get /
get /posts
get /posts/:postID

post /posts
post /posts/:postID
post /posts/:postID/delete
```

```javascript
// src/html/get-index
var arc = require('@smallwins/arc-prototype')

function index(req, res) {
  res({html})
}

exports.handler = arc.html.get(index)
```
