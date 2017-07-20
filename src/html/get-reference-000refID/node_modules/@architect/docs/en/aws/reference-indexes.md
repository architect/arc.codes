# @indexes

> `@indexes` define DynamoDB table indexes

The following `.arc` file defines a DynamoDB table with two Global Secondary Indexes:

```arc
@app
testapp

@tables
accounts
  accountID *String

@indexes
accounts
  email *String

accounts
  created *String
```

The syntax for defining `@tables` and `@indexes` is identical.

- Partition key, defined by a `*`, is required
- Sort key, defined by `**`, is optional
- Currently only `String` an `Number` keys are implemented 

## Reccomended 

DynamoDB is a powerful database. There is a great deal more to learn to take full advantage of it. Dig into [Amazon's DynamoDB documentation](https://aws.amazon.com/documentation/dynamodb/) to build out your apps data layer.

