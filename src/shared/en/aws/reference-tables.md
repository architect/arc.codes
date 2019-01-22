# `@tables`

## `@tables` defines DynamoDB database tables and trigger functions for them

### Table name syntax
- Lowercase alphanumeric string
- Between 3 and 255 characters
- Dashes are allowed
- Underscores are not allowed
- Must begin with a letter

### Table structure syntax
- Keys and Lambdas are defined by indenting two spaces
- The required partition key is denoted by `*`
- The optional sort key is denoted by `**`
- Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- Lambdas can only be values of: `insert`, `update`, or `destroy`

> Note: `.arc` creates fully isolated tables for `staging` and `production`.

### Example

This `.arc` file defines two database tables:

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
├── tables
│   ├── people-insert/
│   ├── people-update/
│   └── people-destroy/
├── .arc
└── package.json
```

## Next: [Web Sockets with `@ws`](/reference/ws)
