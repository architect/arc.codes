# <a id=data.name href=#data.name>`data._name`</a>

## Resolve a table name

Given a string `data._name` will resolve the full table name in the current executing Lambda function.

Given the following example `.arc` file:

```.arc
@app
appname

@tables
cats
  catID *Number
```

The following code running in a staging Lambda function:

```javascript
let tablename = data._name('cats')
// resolves appname-staging-cats
```
