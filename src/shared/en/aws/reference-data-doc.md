# <a id=data.doc href=#data.doc>`data._doc`</a>

## Get an instance of `DynamoDB.DocumentClient` from the `aws-sdk`

Example:

```.arc
@app
testapp

@html
get /

@tables
notes
  noteID *String

```
