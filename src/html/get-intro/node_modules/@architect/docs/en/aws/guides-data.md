# Data

> Data is the core to most apps; `architect` favors DynamoDB for its flexability and ease of use

Given the following `.arc` file:

```arc
@app
testapp

@tables
accounts
  accountID *String

notes
  noteID **String
  accountID *String
```

NOTES:

- further seperating reads from writes is a decent idea
- isolating stage data from prod data is not a horrible idea

    Let's create a database client to do the usual persistence methods.

Create a couple of modules `accounts` and `notes` to represent their corosponding tables:

```bash
mkdir accounts
mkdir projects
touch accounts/index.js
touch projects/index.js
```

### accounts

The API for these should be very straightforward.

- `accounts.create`
- `accounts.update`
- `accounts.destroy`
- `accounts.findByEmail`
- `accounts.findByAccountID`

```javascript
// accounts/index.js
var create = require('./create')
var update = require('./update')
var destroy = require('./destroy')
var findByEmail = require('./findByEmail')
var findByAccountID = require('./findByAccountID')

module.exports = {
  create,
  update,
  destroy,
  findByEmail,
  findByAccountID,
}
```

```javascript
// get-doc-client.js
var aws = require('aws-sdk')
var client = offline? new aws.DynamoDB.DocumentClient : 
module.exports = client
```

```javascript
var db = require('./_get-doc-client')

module.exports = function create(params, callback) {
  db.put(params, callback)
}
```

### notes

```javascript
// notes/index.js
module.exports = {
  create,
  update,
  destroy,
  findByID,
  findByAccountID,
}
```
