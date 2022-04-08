---
title: Modeling & persisting data
description: A guide for using DynamoDB with Architect to create a note application with user accounts
---

## Overview

Durable persistence of structured data is the foundation of most applications. Architect (with `@architect/functions`) offers a very thin wrapper for `DynamoDB` and `DynamoDB.DocumentClient` that uses a project's `app.arc` file to return a client for creating, modifying, deleting and querying data from DynamoDB.

This guide will walk through building a simple note taking application, with multiple users, authentication, and data storage with `@architect/functions`'s `tables` client.

> To keep it simple, we'll create a JSON API without any HTML or view code.  
> A version of this example is [available on GitHub](https://github.com/architect/arc-example-notes). It adds a couple extra features and a simple front end client.

---

## Getting started

Create a fresh Architect project and change directories into the project folder.

```bash
mkdir arc-example-notes
cd arc-example-notes
npm init -f # initialize npm
npm i @architect/architect @architect/functions # install Architect and the Node.js helpers
touch app.arc # create an Architect manifest file
```

Then we'll add the following to our `app.arc` file:

```arc
@app
notes

@http
get /
get /logout
get /notes

post /login
post /signup
post /notes
get /notes/:noteID
post /notes/:noteID
post /notes/:noteID/delete

@tables
people
  email *String

notes
  email *String
  noteID **String
```

Last, we can use Architect's CLI to generate boilerplate for our routes in `src/http/`:

```bash
npx arc init
```

Each folder in `src/http` will be deployed as its own Lambda function as a part of the same CloudFormation Stack. Because they're managed by Architect, each function automatically has access to the same DynamoDB instance.

### The data layer

The `people` table defined above will have an `email` [partition key](https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/), while the `notes` table will have an `email` partition key and a unique `noteID`. This is one way to model a "many-to-many" relationship in Dynamo.

 > Note: the entire data model's schema does not have to be declared here; just the partition keys and global secondary indexes (don't worry, we'll go over those more in a bit).

`@architect/functions`'s `tables` helper uses your app's `app.arc` manifest to generate a data access client. Working with `app.arc` this way means:

- You can immediately start using a database without any configuration
- No syntax errors due to misspelled string identifiers for table names
- No configuration code to map table names to execution environments, ensuring staging and production data cannot get mixed up

Based on the `app.arc` file above, the following client API is automatically available:

- `client._db` - an instance of `DynamoDB` from the `aws-sdk`
- `client._doc` - an instance of `DynamoDB.DocumentClient` from the `aws-sdk`
- `client._name` - a helper for returning an environment appropriate table name
- `client.people.get` - get a person
- `client.people.query` - query people
- `client.people.scan` - return all people in pages of 1MB
- `client.people.put` - write a person
- `client.people.update` - update a person
- `client.people.delete` - delete a person
- `client.notes.get` - get a note
- `client.notes.query` - query notes
- `client.notes.scan` - return all notes in pages in 1MB
- `client.notes.put` - write a note
- `client.notes.update` - update a note
- `client.notes.delete` - delete a note

In addition to providing some extra safety, the generated code also saves on boilerplate!

All generated methods accept a params object as a first parameter, and will return a `Promise`.

---

## Simple root

To start, we'll just report if the user is logged in and if so, their email. Returning a plain JSON object without any reserved keys will set the returned status code to `200` and the correct headers to go along with our data:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions')

async function http (request){
  let { session } = request
  let email = session.person && session.person.email

  let isLoggedIn = !!session.person

  return { isLoggedIn, email }
}

exports.handler = arc.http.async(http)
```

Start up Architect Sandbox and test it out locally:

```bash
npx arc sandbox
```

And in a separate terminal:

```bash
curl --request GET --url http://localhost:3333/
# {"isLoggedIn":false}
```

---

## Authentication

### Account creation

The signup will be processed by our `post-signup` function, which will create a user in DynamoDB:

```javascript
// src/http/post-signup/index.js

let arc = require('@architect/functions')
let makePerson = require('./make-person.js')

async function http (request){
  let { session } = request
  let { email, password } = request.body

  if (!email || !password) {
    return {
      session,
      status: 400,
      json: {
        message: 'Please provide an email and password',
      },
    }
  }

  let person = await makePerson(request.body.email, request.body.password)
  session.person = person

  return {
    session,
    status: 201,
    json: {
      message: 'Created',
      email
    },
  }
}

exports.handler = arc.http.async(http)
```

`make-person.js` uses the popular [bcrypt](https://www.npmjs.com/package/bcrypt) tool to store a hashed version of the password in DynamoDB. Be sure to install it to the top level of you project first:

```bash
npm i bcrypt
```

```javascript
// src/http/post-signup/make-person.js

let arc = require('@architect/functions')
let bcrypt = require('bcrypt')

const SALT_ROUNDS = 12

module.exports = async function makePerson (email, suppliedPassword) {
  let client = await arc.tables()
  let hashedPassword = await bcrypt.hash(suppliedPassword, SALT_ROUNDS)
  let person = { email, password: hashedPassword }

  await client.people.put(person)

  console.log(`Created person ${email}`)

  delete person.password

  return person
}
```

---

### Logging in

When people fill in the form, we'll process it, sending the request to `'./authenticate-person.js`:

```javascript
// src/http/post-login/index.js

let arc = require('@architect/functions')
let authenticatePerson = require('./authenticate-person.js')

async function http (request){
  let { session } = request
  let { email, password } = request.body

  if (!email || !password) {
    return {
      session,
      status: 400,
      json: {
        message: 'Please provide an email and password',
      },
    }
  }

  let person = await authenticatePerson(email, password)

  if (!person) {
    return {
      session: {},
      status: 401,
      json: {
        message: 'Incorrect email or password',
        attemptedEmail: email
      },
    }
  }
  else {
    session.person = person

    return {
      session,
      status: 200,
      json: { person },
    }
  }
}

exports.handler = arc.http.async(http)

```

The authentication queries DynamoDB to find a `person` with the email specified, and compares the `suppliedPassword` to the stored one:

```javascript
// src/http/post-login/authenticate-person.js

let arc = require('@architect/functions')
let bcrypt = require('bcrypt')

module.exports = async function authenticatePerson (email, suppliedPassword){
  let client = await arc.tables()
  let result = await client.people.query({
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email }
  })

  console.log(`Found ${result.Count} "${email}".`)

  if (result.Items.length) {
    let person = result.Items[0]
    let authorized = await bcrypt.compare(suppliedPassword, person.password)

    if (authorized) {
      console.log(`Successful login as ${email}`)

      delete person.password
      return person
    }
  }

  console.log(`Failed login attempt as ${email}`)

  return null
}
```

If `authenticatePerson` returns a user, `src/http/post-login/index.js` will redirect to `/notes`. Otherwise we'll send the user back to the login page - with `atttemptedUser` added to their session so we can tell the user they failed.

---

### Logout

We'll implement the logout handler by clearing the session:

```javascript
// src/http/get-logout/index.js

let arc = require('@architect/functions')

async function http () {
  return {
    session: {},
    status: 200,
    json: { message: 'Logged out' },
  }
}

exports.handler = arc.http.async(http)
```

This wipes the current session and redirects back to `/`.

---

## Protecting Routes

To ensure no bad actors start posting notes, we can lock down the other routes using Arc's middleware, [@architect/functions](https://github.com/architect/functions).

```bash
mkdir src/shared
touch src/shared/require-login.js
```

The `require-login.js` function will can be combined with a route by `arc.middleware`. `require-login.js` will check for `req.session.person`.

If `req.session.person` doesn't exist, `require-login.js` will return a response that ends the request.

If `req.session.person` exists, execution is passed to the next function in the middleware chain.

Later in the guide we'll incorporate this into routes we want to protect.

```javascript
// src/shared/require-login.js

module.exports = async function requireLogin (request){
  let { session } = request

  if (!session.person) {
    console.log(`Not logged in!`)
    // Return a response, so middleware processing ends
    return {
      status: 401,
      json: { message: 'You must be logged in!' },
    }
  }

  console.log(`We're logged in as ${session.person.email}`)
  // return nothing, so middleware processing continues
}
```

> 🏄‍♀️  Read more about [middleware](/docs/en/guides/tutorials/cloud-function-middleware) here.

---

## Note CRUD

Let's make a page that shows existing notes, with a form to make new notes.

At the bottom you'll notice we're using `arc.middleware` to combine this route with `require-login`, making this only available to logged in users:

```javascript
// src/http/get-notes/index.js

let arc = require('@architect/functions')
let requireLogin = require('@architect/shared/require-login')
let getNotes = require('./get-notes.js')

async function showProtectedPage (request){
  let { session } = request
  let notes = await getNotes(session.person.email)

  return { notes }
}

exports.handler = arc.http.async(requireLogin, showProtectedPage)
```

The DynamoDB work is done by `get-notes.js` which is a simple query for all notes for that `email`:

```javascript
// src/http/get-notes/get-notes.js

let arc = require('@architect/functions')

module.exports = async function getNotes (email){
  let client = await arc.tables()
  let result = await client.notes.query({
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  })

  console.log(`Found ${result.Count} notes for "${email}".`)

  return result.Items
}
```

Now that we've got the form, let's implement the POST handler.

```javascript
// src/http/post-notes/index.js

let arc = require('@architect/functions')
let makeNote = require('./make-note.js')
let requireLogin = require('@architect/shared/require-login')

async function route (request){
  let { session } = request
  let { title, body } = request.body

  let result = await makeNote({
    title,
    body,
    email: session.person.email,
  })

  console.log(`Created ${result}`)

  return {
    status: 201,
    json: { note: result },
  }
}

exports.handler = arc.http.async(requireLogin, route)
```

The `make-note` function:

```javascript
// src/http/post-notes/make-note.js

let crypto = require('crypto')
let arc = require('@architect/functions')

module.exports = async function makeNote (newNote){
  let client = await arc.tables()
  // create the partition and sort keys
  let note = {
    ...newNote,
    noteID: crypto.randomUUID()
  }

  console.log(`Making a note with ${JSON.stringify(note, null, 2)}`)

  // save the note
  let result = await client.notes.put(note)

  return result
}
```

Now as we add notes, we can see them in the GET `/notes` response.

---

### Get a note by id

```javascript
// src/http/get-notes-000noteID/index.js

let arc = require('@architect/functions')
let requireLogin = require('@architect/shared/require-login')

async function showNote (request){
  let { session } = request
  let client = await arc.tables()
  let noteID = request.params.noteID
  let email = session.person && session.person.email

  let note = await client.notes.get({ noteID, email })

  if (note) {
    return { note }
  }
  else {
    return {
      status: 404,
      json: { message: `Note ${noteID} not found` },
    }
  }
}

exports.handler = arc.http.async(requireLogin, showNote)
```

### Edit a specific note

Next let's implement the update action:

```javascript
// src/http/post-notes-000noteID/index.js

let arc = require('@architect/functions')
let requireLogin = require('@architect/shared/require-login')

async function editNote (request) {
  let { session } = request
  let client = await arc.tables()

  // get the note (including title, body and noteID) from the form post
  let note = request.body
  // create the partition and sort keys
  note.email = session.person && session.person.email

  // save the updated note
  let result = await client.notes.put(note)
  console.log(`Saved ${result.noteID}`)

  return {
    status: 200,
    json: { note: result },
  }
}

exports.handler = arc.http.async(requireLogin, editNote)
```

This is cheating a little bit. We're directly overwriting the note record with `put`. A more complex example would probably use `update`.

It can be helpful to inspect the data using the REPL. To do that, first install `@architect/data` into the root of your project:

Now running `npx repl` opens a REPL into your Dynamo schema running locally and in-memory. If you are running the app with `npx sandbox` in another tab, it connects to that database.

Try starting the REPL and running: `data.notes.scan({}, console.log)` to see all the current notes. The REPL can attach itself to the `staging` and `production` databases also by setting the appropriate `ARC_ENV` environment variable flag.

---

### Delete a Note

Finally, let's implement a delete route:

```javascript
// src/http/post-notes-000noteID-delete/index.js

let arc = require('@architect/functions')
let requireLogin = require('@architect/shared/require-login')

async function deleteNote (request){
  let { session } = request
  let client = await arc.tables()
  let noteID = request.params.noteID
  let email = session.person && session.person.email

  console.log(`Deleting note ${noteID}`)

  await client.notes.delete({
    noteID,
    email
  })

  return {
    status: 204,
    json: { message: `Note ${noteID} deleted` },
  }
}

exports.handler = arc.http.async(requireLogin, deleteNote)
```

> 🎩  Tip: `data._db` and `data._doc` return instances of `DynamoDB` and `DynamoDB.DocumentClient` for directly accessing your data; use `data._name` to resolve the table names with the app name and environment prefix.

## Final thoughts

It is important to note this is a powerful client that allows you to read and write data indiscriminately. Security and access control to your Dynamo tables is determined by your application's business logic. This is why the middleware is used to wrap the route with `shared/require-login` first, to protect the route.

Extra credit:

- Sanitize inputs with XSS
- Validate input; you probably can do without a library
