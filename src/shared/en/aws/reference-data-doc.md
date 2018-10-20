# <a id=data.doc href=#data.doc>`data._doc`</a>

## Get an instance of `AWS.DynamoDB.DocumentClient` from the `aws-sdk`

In this example we'll model a comic book store. Accounts are uniquely identified by email. One account has many purchases. Notice how the `.arc` comments annotates the extra fields on the purchases table definition (`#comicID` and `#price`). DynamoDB tables only define a schema for keys. All other attributes are optional. Likewise these comments are not significant but they will help your future colleagues understand the schema intent. 

```arc
@app
testapp

@http
get /

@tables
accounts
  email *String
  
purchases
  email *String
  #comicID
  #price

comics
  comicID *String

@index
comics
  publisher *String
```

Accessing the data with `DynamoDB.DocumentClient` is slightly nicer than the lower level `DynamoDB` client because it returns rows unformatted by their underlying DynamoDB types.

```javascript
let data = require('@architect/data')

let email = 'b@brian.io'

let TableName = data._name('purchases')

let purchases = await data._doc.query({
  TableName,
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: {
    ':email': email
  }
})
```

In the example above we query purchases by email to see all the comics they bought.

- [`AWS.DynamoDB.DocumentClient` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

## Next: [`get`](/reference/data-get)
