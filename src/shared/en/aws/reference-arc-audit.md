# `npx audit`

Displays all Lambda defined by `.arc` and their corresponding IAM Role ARNs.

## `npx audit apply`

The `role.json` file is an individual configuration manifest file that lives in the same folder as each Lambda it configures. This file is intended to be committed into your project git repository.

An example `role.json` file found at `src/json/get-api/role.json`:

```javascript
{
  "policies": [
    "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
  ]
}
```

`npx audit apply` creates a new unique IAM Role and applies `role.json` policies to the corresponding `staging` and `production` Lambdas.

