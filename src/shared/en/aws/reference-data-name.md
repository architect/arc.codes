# <a id=data.name href=#data.name>`data._name`</a>

## Resolve a table name

Given a string `data._name` will resolve the resource name for the currently executing Lambda function.

Given the following example `.arc` file:

```.arc
@app
appname

@tables
cats
  catID *Number

@indexes
cats
  name *String
```

The following code running in a `staging` Lambda function:

```javascript
let tablename = data._name('cats')
// resolves appname-staging-cats
```

And likewise resolves the correct name for `production`:

```javascript
let index = data._name('cats-name-index')
// resolves appname-production-cats-name-index
```

This is useful when you need to write more complex queries.

```javascript
let data = require('@architect/data')

// my cats name
let name = 'sutr0'

// get the resolved index name
let IndexName = data._name('cats-name-index')

// run the query
let result = await data.cats.query({
  IndexName, 
  KeyConditionExpression: '#name = :name',
  ExpressionAttributeNames: {
    '#name': 'name' 
  },
  ExpressionAttributeValues: {
    ':name': name
  }
})
```

## Next: [`data._db`](/reference/data-db)
