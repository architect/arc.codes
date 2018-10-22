# <a id=data.db href=#data.db>`data._db`</a>

## Get an instance of `AWS.DynamoDB` from the `aws-sdk`

Example, given the following `.arc` file:

```.arc
@app
testapp

@http
get /

@tables
bikes
  bikeID *String

@index
bikes
  type *String
```

Connect directly to DynamoDB.

```javascript
let data = require('@architect/data')

// list all tables 
let tables = await data._db.listTables({})
// result: {Tables: ['testapp-staging-bikes', 'testapp-production-bikes']}
```

- [`AWS.DynamoDB` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)

## Next: [`data._doc`](/reference/data-doc)
