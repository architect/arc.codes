# Custom IAM Roles

> Define custom IAM Roles per Lambda function

Running `npx audit` will display all the functions represented by the current `app.arc` file.

Given the following `app.arc` file:

```arc
@app
testapp

@http
get /
```

Create a custom IAM Role by adding `role.json` to your Lambda function source code like this:

```javascript
// this file is in src/html/get-index/role.json
{
  "policies": [
    "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess",
    "arn:aws:iam::aws:policy/AlexaForBusinessReadOnlyAccess"
  ]
}
```

Running `npx audit apply` will create a new role named "testapp-get-index" with the managed policies listed in the `role.json` file and apply to both the `staging` and `production` lambda functions.

---

## Next: [YAML/JSON Config](/guides/yaml-and-json)
