---
title: Modeling & persisting data
description: Tutorial showing how to use DynamoDB with Architect to create a note application with user accounts
sections:
  - Overview
  - Generating the Data Layer
  - Implementing an Admin Interface
  - Implementing Signup
  - Implementing Login
  - Implementing Logout
  - Protecting Routes
  - Showing and making notes
  - Edit a specific note
  - Delete a Note
---

## Overview

Durable persistence of structured data is the foundation of most applications. `@architect/data` is a very thin wrapper for `DynamoDB` and `DynamoDB.DocumentClient` that reads a `app.arc` file and returns a client for creating, modifying, deleting and querying data from DynamoDB!

In this tutorial you will build a simple note taking application, with multiple users, authentication, and data storage with `@architect/data`.

> The example below is also [available on GitHub.](https://github.com/architect/arc-example-notes)


**Sections**
- [Overview](#overview)
- [Generating the Data Layer](#generating-the-data-layer)
- [Implementing an Admin Interface](#implementing-an-admin-interface)
- [Implementing Signup](#implementing-signup)
- [Implementing Login](#implementing-login)
- [Implementing Logout](#implementing-logout)
- [Protecting Routes](#protecting-routes)
- [Showing and making notes](#showing-and-making-notes)
- [Edit a specific note](#edit-a-specific-note)
- [Delete a Note](#delete-a-note)

---

## Generating the Data Layer

Let's first create a fresh Architect project and change directories into the project folder.

```bash
mkdir arc-example-notes
cd arc-example-notes
touch app.arc
```

Then we'll add the following to our `app.arc` file:

```bash
@app
notes

@http
get /
get /login
get /signup
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

Running `arc init` will generate routes and tables to model our persistence needs. The `people` table defined above will have an `email` [partition key](https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/), while the `notes` table will have an `email` partition key and a unique `noteID`. This is one way to model a "many-to-many" relationship in Dynamo.

So, at this point, `arc init` will create the following Dynamo tables:

- `testapp-staging-people`
- `testapp-production-people`
- `testapp-staging-notes`
- `testapp-production-notes`

---

## Implementing an Admin Interface

Now let's create a basic interface for this notes app. First, let's create a basic shared layout in `src/shared`, which will make it available to all functions (more on [sharing code across functions here](/docs/en/guides/tutorials/code-sharing-across-functions)):

```bash
mkdir src/shared
touch src/shared/layout.js
```

```javascript
// src/shared/layout.js

let arc = require('@architect/functions'),
    url = arc.http.helpers.url,
    static = arc.http.helpers.static

module.exports = function layout(contents, showNav = true, isLoggedIn = true) {
  let nav = ''

  let navLinks = `
<a class="button subtle" href="${ url('/login') }">Log in</a>
<a class="button" href="${ url('/signup') }">Sign up</a>
  `
  if (isLoggedIn) {
    navLinks = `
<a class="button subtle" href="${ url('/logout') }">Log out</a>
  `
  }

  if (showNav) {
    nav = `
<nav>
  <a href="/">
    <img class="logo" src="${ static('/images/logo.svg') }"/>
  </a>
  <a href="https://arc.codes" target="_blank">Documentation</a>
  ${ navLinks }
</nav>`
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Architect demo app</title>
  <link rel=stylesheet href="${ static('/css/style.css') }">
  <link rel="icon" type="image/png" sizes="64x64" href="${ static('/images/favicon.png') }">
</head>
<body>
  ${ nav }
  <body>
    ${ contents }
  </body>
</html>
  `
}
```

The layout module has a params of `contents`, plus two options: whether to show navigation, and whether we're logged in. It returns an HTML document as a string. String interpolation is truly the purest essence of web development. We add some basic CSS too.

Next, we require the layout module in the root of our application. This will show different contents based on whether someone is logged in or not:

```javascript
// src/http/get-index/index.js

let arc = require('@architect/functions'),
    layout = require('@architect/shared/layout'),
    url = arc.http.helpers.url

require('@architect/shared/globals')

exports.handler = async function http(request) {
  let state = await arc.http.session.read(request)
  let email = state.person && state.person.email

  let isLoggedIn = !!state.person

  let loggedInPage = `
<section class="hero">
  <h1>Welcome back <strong>${ email }</strong>!</h1>
  <h2>You've logged in. That's so cool.</p>
  <p>Check your <a href=${ url('/notes') }>notes</a> or <a href=${ url('/logout') }>logout</a></p>
</section>
  `

  let notLoggedInPage = `
<section class="hero">
  <h1>Welcome to the Architect demo app!</h1>
  <h2>It looks like it's your first time here. You should <a href="${ url('/signup') }">sign up</a> now!</p>
  <p>You can also try and visit <a href=${ url('/notes') }>Notes</a> or <a href="${ url('/login') }">Log in</a> but you'll need to sign up first.</a></p>
</section>
  `
  let contents = isLoggedIn ? loggedInPage : notLoggedInPage

  return {
    type: HTML,
    status: OK,
    body: layout(contents, true, isLoggedIn)
  }
}
```
---

## Implementing Signup

Our signup page is a simple form:

```javascript
// src/http/get-signup/index.js

let arc = require('@architect/functions'),
    layout = require('@architect/shared/layout'),
    url = arc.http.helpers.url,
    static = arc.http.helpers.static

require('@architect/shared/globals')

exports.handler = async function http(req) {
  let state = await arc.http.session.read(req)

  if (state.person) {
    // You're already logged in
    return {
      status: MOVED_TEMPORARILY,
      location: url('/notes')
    }
  }

  let signupPage = `
<body class="signup-page dark">
  <form class="signup" method="post" action=${ url('/signup') }>

    <a href="/"><img class="logo" src="${ static('/images/logo.svg') }"/></a>
    <h2>Sign up</h2>

    <p>Enter an email and password to sign up</p>

    <div class="input-and-label">
      <input name="email" required="required" type="email" autocomplete="off" value="" placeholder="Email address" autofocus/>
      <label for="email">Email address</label>
    </div>

    <div class="input-and-label">
      <input name="password" required="required" type="password" autocomplete="off" placeholder="Password"/>
      <label for="password">Password</label>
    </div>

    <div class="input-and-label checkbox">
      <input type="checkbox" required checked>
      <label for=tsandcs>Agree to the terms of conditions</label>
    </div>

    <button type="submit">Sign up</button>

  </form>

  <a href="${ url('/login') }">Log in</a>
</body>
  `

  return {
    type: HTML,
    status: OK,
    body: layout(signupPage, false)
  }
}
```

The signup will be processed by our `post-signup` lambda, which will create a user in DynamoDB:

```javascript
// src/http/post-signup/index.js

let arc = require('@architect/functions'),
  makePerson = require('./make-person.js'),
  log = console.log.bind(console),
  url = arc.http.helpers.url

require('@architect/shared/globals')

exports.handler = async function http(request) {
  let session = await arc.http.session.read(request)
  let person = await makePerson(request.body.email, request.body.password)
  session.person = person
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: MOVED_TEMPORARILY,
    location: url('/notes')
  }
}
```

`make-person.js` uses the popular [bcrypt](https://github.com/kelektiv/node.bcrypt.js) tool to store a hashed version of the password in DynamoDB:

```javascript
// src/http/post-signup/make-person.js

let data = require('@architect/data'),
  bcrypt = require('bcrypt'),
  log = console.log.bind(console)

const SALT_ROUNDS = 12

module.exports = async function makePerson(email, suppliedPassword) {
  let hashedPassword = await bcrypt.hash(suppliedPassword, SALT_ROUNDS)
  let person = {email, password: hashedPassword}
  data.people.put(person)
  log(`Created person ${ email }`)
  return person
}
```

Requiring `@architect/data` reads your app's `app.arc` manifest and generates a data access client from it. Working with `app.arc` this way means:

- You can immediately start working with a database without any configuration
- No syntax errors due to misspelled string identifiers for table names
- No configuration code to map table names to execution environments, ensuring staging and production data cannot get mixed up

The following API was generated from the `app.arc` file above:

- `data._client` - an instance of `DynamoDB` from [`aws-lite`](https://aws-lite.org)
- `data._name` - a helper for returning an environment appropriate table name
- `data.people.get` - get a person
- `data.people.query` - query people
- `data.people.scan` - return all people in pages of 1MB
- `data.people.put` - write a person
- `data.people.update` - update a person
- `data.people.delete` - delete a person
- `data.notes.get` - get a note
- `data.notes.query` - query notes
- `data.notes.scan` - return all notes in pages in 1MB
- `data.notes.put` - write a note
- `data.notes.update` - update a note
- `data.notes.delete` - delete a note

In addition to providing some extra safety, the generated code also saves on boilerplate!

All generated methods accept a params object as a first parameter, and will return a Promise.

It is important to note this is a powerful client that allows you to read and write data indiscriminately. Security and access control to your Dynamo tables is determined by your application's business logic. This is why the middleware is used to wrap the route with `shared/require-login` first, to protect the route.

Extra credit:

- Sanitize inputs with XSS
- Validate input; you probably can do without a library

---

## Implementing Login

Let's make a login page. It's just a form:

```javascript
// src/http/get-login/index.js

let arc = require('@architect/functions'),
  layout = require('@architect/shared/layout'),
  url = arc.http.helpers.url,
  static = arc.http.helpers.static

require('@architect/shared/globals')

exports.handler = async function http(req) {
  let state = await arc.http.session.read(req)

  let message = null
  if (state.attemptedEmail) {
    message = `Could not log in as ${ state.attemptedEmail }`
  }

  let loggedInPage = `
    <body>
      <h2>You're already logged in!</h2>
        <p>
        <a href=${ url('/notes') }>notes</a>
        <a href=${ url('/logout') }>logout</a>
      </p>
    </body>`

  let notLoggedInPage = `
    <body class="signup-page dark">
      <form class="login" method="post" action=${ url('/login') } >

        <a href="/"><img class="logo" src="${ static('/images/logo.svg') }"/></a>

        <h2>Please log in below!</h2>

        <div class="flash-message ${ message ? '' : 'no-messages' }">
          ${ message || '' }
        </div>

        <div class="input-and-label">
          <input
            name="email"
            required="required"
            type="email"
            autocomplete="off"
            value="${ state.attemptedEmail || '' }"
            placeholder="Email address"
            autofocus
          />
          <label for="email">
            Email address
          </label>
        </div>

        <div class="input-and-label">
          <input
            name="password"
            required="required"
            type="password"
            autocomplete="off"
            placeholder="Password"
          />
          <label for="password">
            Password
          </label>
        </div>

        <button>
          Log In
        </button>

      </form>

      <a href="${ url('/signup') }">Sign up</a>

    </body>
  `
  let content = state.person
   ? loggedInPage
   : notLoggedInPage

  return {
    type: HTML,
    status: OK,
    body: layout(content, false)
  }
}
```

When people fill in the form, we'll process it, sending the request to `'./authenticate-person.js`:

```javascript
// src/http/post-login/index.js

let arc = require('@architect/functions'),
  authenticatePerson = require('./authenticate-person.js'),
  url = arc.http.helpers.url

require('@architect/shared/globals')

exports.handler = async function http(request) {
  let session = await arc.http.session.read(request)

  let person = await authenticatePerson(request.body.email, request.body.password)

  const location = person ? url('/notes') : url('/login')

  session.attemptedEmail = person ? null : request.body.email

  session.person = person

  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: MOVED_TEMPORARILY,
    location
  }
}
```

The authentication queries DynamoDB to find a `person` with the email specified, and compares the `suppliedPassword` to the stored one:

```javascript
// src/http/post-login/authenticate-person.js

let data = require('@architect/data'),
  bcrypt = require('bcrypt'),
  log = console.log.bind(console)

module.exports = async function authenticatePerson(email, suppliedPassword) {
  let result = await data.people.query({
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  })
  log(`Searching for person "${ email }" matching user-supplied password. Found ${ result.Count } results`)
  if (result.Items.length) {
    let firstResult = result.Items[0]
    let person = firstResult
    let authorized = await bcrypt.compare(suppliedPassword, person.password)
    if (authorized) {
      // Remove the hashed password, as we don't want it in sessions (or anywhere else outside this module)
      delete person.password
      log(`Successful login as ${ email }`)
      return person
    }
  }
  log(`Failed login attempt as ${ email }`)
  return null
}
```

If `authenticatePerson` returns a user, `src/http/post-login/index.js` will redirect to `/notes`. Otherwise we'll send the user back to the login page - with `atttemptedUser` added to their session so we can tell the user they failed.

---

## Implementing Logout

We'll implement the logout handler too:

```javascript
// src/http/get-logout/index.js

let arc = require('@architect/functions')
let url = arc.http.helpers.url

require('@architect/shared/globals')

exports.handler = async function route(request) {
  let session = await arc.http.session.read(request)
  session.person = null
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: MOVED_TEMPORARILY,
    location: url('/')
  }
}
```

This wipes the current session and redirects back to `/`.

---

## Protecting Routes

To ensure no bad actors start posting notes, we can lock down the other routes using Arc's middleware, [@architect/functions](https://github.com/architect/functions).

```bash
touch src/shared/require-login.js
```

The `require-login.js` function will can be combined with a route by `arc.middleware`. `require-login.js` will check for `req.session.person`.

If `req.session.person` doesn't exist, `require-login.js` will return a response that ends the request.

If `req.session.person` exists, execution is passed to the next function in the middleware chain.

Later in the guide we'll incorporate this into routes we want to protect.

```javascript
// src/shared/require-login.js

let arc = require('@architect/functions'),
  log = console.log.bind(console),
  url = arc.http.helpers.url

require('@architect/shared/globals')

module.exports = async function requireLogin(request) {
  let state = await arc.http.session.read(request)

  if (!state.person) {
    console.log(`Attempt to access protected page without logging in!`)
    // Return a response, so middleware processing ends
    return {
      status: MOVED_TEMPORARILY,
      location: url(`/login`)
    }
  }
  console.log(`We're logged in as ${ state.person.email }`)
  // return nothing, so middleware processing continues
}
```

> 🏄‍♀️  Read more about [middleware](/docs/en/guides/tutorials/cloud-function-middleware) here.

---

## Showing and making notes

Let's make a page that shows existing notes, with a form to make new notes.

At the bottom you'll notice we're using `arc.middleware` to combine this route with `require-login`, making this only available to logged in users:

```javascript
// src/http/get-notes/index.js

let arc = require('@architect/functions'),
  layout = require('@architect/shared/layout'),
  requireLogin = require('@architect/shared/require-login'),
  getNotes = require('./get-notes.js'),
  log = console.log.bind(console),
  url = arc.http.helpers.url

require('@architect/shared/globals')

async function showProtectedPage(request) {
  log(`Showing notes`)
  let state = await arc.http.session.read(request)

  let notes = await getNotes(state.person.email)

  let greeting = `You don't have any notes! Make some below`
  if (notes.length) {
    greeting = `You have <strong>${ notes.length }</strong> notes.`
  }

  let existingNotes = ``
  notes.forEach(function(note) {
    let noteURL = url(`/notes/${ note.noteID }`)
    existingNotes += `
      <section class="card">
        <a href="${ noteURL }">
          <heading>
            ${note.title}
          </heading>
          <p>
            ${ note.body }
          </p>
        </a>
      </section>`
  })

  let contents = `
    <section>
      <h2>Welcome to the Notes page <strong>${ state.person.email }</strong>!</h2>
      <p>${ greeting }</p>

      <section class="cards">
        ${ existingNotes }
      </section>


      <form
        action=${ url('/notes') }
        method=post
      >
        <h2>Make a note</h2>
        <div class="input-and-label">
          <input
            name="title"
            required="required"
            type="text"
            autocomplete="off"
            value=""
            placeholder="Title"
            autofocus
          />
          <label for="email">Title</label>
        </div>
        <div class="input-and-label">
          <textarea
            name="body"
            required="required"
            autocomplete="off"
            value=""
            placeholder="Body text">
          </textarea>
          <label for="body">Body</label>
        </div>
        <button>
          Make a note
        </button>
      </form>
    </section>

  `

  return {
    status: OK,
    body: layout(contents, true, true),
    type: HTML
  }
}

exports.handler = arc.middleware(requireLogin, showProtectedPage)
```

The DynamoDB work is done by `get-notes.js` which is a simple query for all notes for that `email`:

```javascript
// src/http/get-notes/get-notes.js

let data = require('@architect/data'),
  log = console.log.bind(console)

module.exports = async function getNotes(email) {
  let result = await data.notes.query({
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  })

  log(`Searching for notes for "${ email }". Found ${ result.Count } results`)

  let notes = result.Items
  return notes
}
```

Now that we've got the form, let's implement the POST handler. We'll use the [`hashids`](https://hashids.org/) library to help create keys for our notes.

```bash
cd src/http/post-notes
npm i hashids
```

```javascript
// src/http/post-notes/make-note.js

let Hashids = require('hashids'),
  data = require('@architect/data'),
  log = console.log.bind(console),
  hashids = new Hashids()

async function makeNote(email, title, body) {
  // create the partition and sort keys
  let note = {
    email,
    title,
    body,
    noteID: hashids.encode(Date.now())
  }
  log(`Making a note with ${ JSON.stringify(note, null, 2) }`)
  // save the note
  let result = await data.notes.put(note)
  return result
}

module.exports = makeNote
```

And then in the handler:

```javascript
// src/http/post-notes/index.js

let arc = require('@architect/functions'),
  makeNote = require('./make-note.js'),
  requireLogin = require('@architect/shared/require-login'),
  url = arc.http.helpers.url

require('@architect/shared/globals')

async function route(request) {
  try {
    let session = await arc.http.session.read(request)

    // create the partition and sort keys
    let email = session.person.email
    // save the note
    let result = await makeNote(email, request.body.title, request.body.body)
    // log it to stdout
    console.log(result)
  } catch (error) {
    console.log(error)
  }
  return {
    status: MOVED_TEMPORARILY,
    location: url('/notes')
  }
}

exports.handler = arc.middleware(requireLogin, route)
```

Now as we add notes, we can see them in our UI!

---

## Edit a specific note

Lets make a detail page to edit a specific note.

While we're at it, let's delete the note too!

This is just another lambda that returns two forms. Like always, we use middleware to wrap it with `requireLogin`:

```javascript
// src/http/get-notes-000noteID/index.js

let arc = require('@architect/functions'),
  layout = require('@architect/shared/layout'),
  requireLogin = require('@architect/shared/require-login'),
  data = require('@architect/data'),
  url = arc.http.helpers.url

require('@architect/shared/globals')

async function showNote(request) {
  let noteID = request.params.noteID

  let session = await arc.http.session.read(request)

  let email = session.person && session.person.email

  let note = await data.notes.get({ noteID, email })
  note.noteURL = url(`/notes/${ noteID }`)

  let showNote = function(note) {
    return `
      <article>
        <h2>Edit note</h2>
        <form
          action=${ note.noteURL }
          method=post
        >
            <input
              type=hidden
              name=noteID
              value=${ noteID }
            >
          <div class="input-and-label">
            <input
              type=text
              name=title
              placeholder="Enter title"
              value="${ note.title }"
              required
            >
          </div>
          <div class="input-and-label">
            <textarea
              class=form-control
              name=body
              placeholder="Enter text"
            >
              ${ note.body }
            </textarea>
          </div>
          <button type=submit>Save changes</button>
        </form>

        <form
          action="${ note.noteURL }/delete"
          method=post
        >
          <button class="danger">
            Delete
          </button>
        </form>

      </article>
    `
  }

  return {
    status: OK,
    body: layout(showNote(note)),
    type: HTML
  }
}

exports.handler = arc.middleware(requireLogin, showNote)
```

Next let's implement the update action:

```javascript
// src/http/post-notes-000noteID/index.js

let arc = require('@architect/functions'),
  requireLogin = require('@architect/shared/require-login'),
  url = arc.http.helpers.url,
  data = require('@architect/data'),
  log = console.log.bind(console)

require('@architect/shared/globals')

let editNote = async function route(request) {
  try {
    let session = await arc.http.session.read(request)
    // get the note (including title, body and noteID) from the form post
    let note = request.body
    // create the partition and sort keys
    note.email = session.person && session.person.email
    // save the updated note
    log(`Saving ${ JSON.stringify(note, null, 2) }`)
    let result = await data.notes.put(note)
    log(result)
  } catch (error) {
    log(error)
  }
  return {
    status: MOVED_TEMPORARILY,
    location: url('/notes')
  }
}

exports.handler = arc.middleware(requireLogin, editNote)
```

This is cheating a little bit. We're directly overwriting the note record with `put`. A more complex example would probably use `update`.

It can be helpful to inspect the data using the REPL. To do that, first install `@architect/data` into the root of your project:

```bash
npm i @architect/data
```

Now running `npx repl` opens a REPL into your Dynamo schema running locally and in-memory. If you are running the app with `npx sandbox` in another tab, it connects to that database.

Try starting the REPL and running: `data.notes.scan({}, console.log)` to see all the current notes. The REPL can attach itself to the `staging` and `production` databases also by setting the appropriate `ARC_ENV` environment variable flag.

---

## Delete a Note

Finally, let's implement a delete route:

```javascript
// src/http/post-notes-000noteID-delete/index.js

let arc = require('@architect/functions'),
  data = require('@architect/data'),
  url = arc.http.helpers.url,
  requireLogin = require('@architect/shared/require-login'),
  log = console.log.bind(console)

let deleteNote = async function route(request) {
  let noteID = request.params.noteID
  let session = await arc.http.session.read(request)
  let email = session.person && session.person.email
  log(
    `Deleting notes matching ${ JSON.stringify(
      {
        noteID,
        email
      },
      null,
      2
    )}`
  )
  await data.notes.delete({
    noteID,
    email
  })
  return {
    status: MOVED_TEMPORARILY,
    location: url('/notes')
  }
}
exports.handler = arc.middleware(requireLogin, deleteNote)
```

> Use `data._name` to resolve table names with the app name and environment prefix
