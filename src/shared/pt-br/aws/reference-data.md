<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=data href=#data>`@architect/data`</a>

## Interact with DynamoDB tables defined in `.arc`

Example, given the following `.arc` file:

```.arc
@app
testapp

@html
get /

@tables
notes
  personID *String
  noteID **String

ppl
  personID *String
```

The `.arc` file gets copied into every lambda `node_modules/@architect/shared/.arc` upon every deploy or restart of the sandbox. `@architect/data` uses a `.arc` file to generate a lightweight data access layer. For the example above the generated API is:

- `data.notes.get`
- `data.notes.query`
- `data.notes.scan`
- `data.notes.put`
- `data.notes.delete`
- `data.notes.update`
- `data.ppl.get`
- `data.ppl.query`
- `data.ppl.scan`
- `data.ppl.put`
- `data.ppl.delete`
- `data.ppl.update`

The following code in `src/html/get-index/index.js` demos usage:

```javascript
let arc = require('@architect/functions')
let data = require('@architect/data')

async function route(req, res) {
  let result = await data.notes.scan({})
  let html = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  res({html})
}

exports.handler = arc.html.get(route)
```

`@architect/data` also allows direct access to DynamoDB through a few methods:

- `data._db` which returns an instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- `data._doc` returns an instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- `data._name` helper function that returns a completely resolved resource name which is useful for constructing queries to tables or indexes

## Next: [`data._name`](/reference/data-name)
