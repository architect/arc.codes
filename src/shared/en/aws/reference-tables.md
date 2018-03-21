# `@tables`

## `@tables` defines DynamoDB tables

`@tables` syntax:

- Table names are just strings
- Keys and Lambdas are defined by indenting two spaces
- The required partition key is denoted by `*`
- The optional sort key is denoted by `**`
- Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- Lambdas can only be values of: `insert`, `update`, or `destroy`

Also worth noting, `.arc` creates isolated tables for `staging` and `production`.

This `.arc` file defines two `@tables`:

```arc
@app
testapp

@tables
people
  pplID *String
  insert Lambda
  update Lambda
  delete Lambda

cats
  pplID *String
  catID **String
```

The example `.arc` above would generate:

- `people-staging`
- `people-production`
- `cats-staging`
- `cats-production`

Function code will also be generated for the defined `people` Lambda triggers:

```bash
/
|-- tables
|   |-- people-insert/
|   |-- people-update/
|   `-- people-destroy/
|-- .arc
`-- package.json
```

## Next: [Defining DynamoDB table indexes with `@indexes`](/reference/indexes)
