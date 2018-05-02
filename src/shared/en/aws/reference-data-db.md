# <a id=data.db href=#data.db>`data._db`</a>

## Get an instance of `DynamoDB` from the `aws-sdk`

Example, given the following `.arc` file:

```.arc
@app
testapp

@html
get /

@tables
notes
  noteID *String

```
