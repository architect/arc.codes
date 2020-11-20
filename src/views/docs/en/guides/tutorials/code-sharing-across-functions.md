---
title: Code sharing across functions
description: Tutorial for sharing code between your cloud functions.
sections:
  - Overview
  - Principles & best practices
  - src/shared
  - src/views
---

## Overview

Architect provides an easy way to abstract and reuse code in your functions. Most applications need to share logic, templates, or utilities. In order to do this, Architect uses a folder convention to copy the contents of `src/shared` and `src/views` into each functions `node_modules` directory. 

These two special folders have different behaviors and we will go over their use in the following tutorials. 

All the contents of `src/shared` gets copied to every function's `node_modules/@architect/shared` directory. 

All the contents of `src/views` gets copied into each of your project's `@HTTP GET` function's `node_modules/@architect/views` directory. 

## Principles & best practices

It is important to note that the entire contents of `src/shared` are copied recursively, we strongly suggest keeping the directory structure as flat as possible, and the payloads as small as possible to improve performance. We recommend that you keep the entire payload under 5MB to avoid cold start penalties. To learn more about cold starts [check this out](https://learn.begin.com/jargon#cold-start).

You can organize the code in `src/shared` in a way that makes sense for your project. Common structures include: 

- `src/shared/middleware` 
- `src/shared/helpers`
- `src/shared/lib`

## `src/shared` example 

In this example, we will create an example helper that all of our functions will need.

1.) To get started with sharing code, let's create a new project from the command line. The following command will generate a project structure and template code.

```bash
npm init @architect ./arc-shared-views
```

2.) Next we can modify the `app.arc` file in the root of the project with the following: 

```bash 
# app.arc file

@app 
arc-shared

@http
get /
get /answer
```

3.) Now we can start to build out our `/src/shared` modules by creating a new folder and file at `/src/shared/helper.js`

In our example we need to make sure a number is converted to a string and this helper function will do the trick! 

``` javascript
// src/shared/helper.js

function theAnswer() {
  //really important number that needs to be converted to a string
  let universe = 42 
  return universe.toString()
}

module.exports = theAnswer
```

4.) We can use this helper in all of our functions by just requiring it from `@architect/shared/`
Modify the `get-answer` function with the following: 

```javascript
// src/http/get-answer/index.js

let Answer = require('@architect/shared/helper')

exports.handler = async function http (req) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title> The Answer is </title>
      </head>
      <body>
        <p> This is the Answer: ${Answer()} </p>
      </body>
      </html>
    `
  }
}
```

5.) Run `npm start` from the command line and take a look at our code structure. Sandbox will hydrate our functions with a `node_modules/@architect/shared` directory which is part of the function's payload when deployed and executed. 

```bash
.
├── src
│   ├── http
│   │   ├── get-index/
│   │   └── get-answer/
│   │
│   └── shared/
│       └── helper.js
│   
├── app.arc
└── package.json
```

When you navigate to http://localhost:3333/answer you will be greeted with data from our shared module, and it can be used by any other function.

## `src/views` example

The `src/views` folder is a special location that allows you to include code for each of your HTTP functions with a GET route. Continuing with our `/src/shared` example we will include a layout template that your HTTP functions can use.

1.) Modify the `app.arc` file to match the following:

```bash
@app
arc-shared

@http
get /
get /answer 
get /about
get /css/:stylesheet

@views
get / 
get /about
```

What we've done is added two new routes -  `/about` and `/css/:stylesheet`, then declared that two of the routes `/` and `/about` should receive a copy of the modules in `src/views`. 

2.) Create a new folder and file, `src/views/layout.js`. In this file we'll write the following contents: 

```javascript
module.exports = function Layout (props) {
  props = props || {}
  let heading = props.heading || 'Architect views!'
  return `
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>Architect example</title>
 <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
 <h1>${heading}</h1>
</body>
</html>
`
}
```

This is our shared view template that will be used by each GET route listed under the `@views` pragma in the `app.arc` file. 

3.) Next we'll modify `src/http/get-index/index.js` with the following: 

```javascript
let Layout = require('@architect/views/layout')

exports.handler = async function http (request) {
  try {
    return {
      statusCode: 200,
      headers: {
        'content-type':'text/html; charset=utf8'
      }, 
      body: Layout()
    }
  } catch (e) {
    console.error(e)
    return {
      headers: {
        type: 'application/json; charset=utf8',
      },
      status: 500,
      body: JSON.stringify({
        name: e.name,
        message: e.message,
        stack: e.stack
      }, null, 2)
    }
  }
}
```

This function will call the layout file and return it's output as the body of the response. 

4.) Next we can set up the about page to send a different set of props to the layout. Modify `src/http/get-about/index.js` with the following: 

``` javascript
let Layout = require('@architect/views/layout')

exports.handler = async function http (request) {
  try {
    return {
      statusCode: 200,
      headers: {
        'content-type':'text/html; charset=utf8'
      }, 
      body: Layout({heading: 'About'})
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500,
      type: 'application/json; charset=utf8',
      body: JSON.stringify({
        name: e.name,
        message: e.message,
        stack: e.stack
      }, null, 2)
    }
  }
}
```

When `/about` is requested, this function will execute and be able to return the data being passed into `Layout()`. 

5.) Finally we have some finer control over which GET functions will have `/src/views` copied into it. We do this with the `@views` pragma in the `app.arc` file. 
We want to create an URL to our style sheet, but this function doesn't need access to the layout code. Only the GET routes under `@views` will have the `src/views` code copied into it. Our first route of `/answer` won't have the `src/views` modules copied into `node_modules`. 

Now we can modify the code in `/src/http/get-css-000stylesheet/index.js` with the following: 

```javascript
const styles = `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
`
exports.handler = async function http (request) {
  return {
    statusCode: 200,
    type: 'text/css; charset=utf8',
    body: styles
  }
}
```

6.) OK! Go ahead and run `npm start` from the project root and navigate to http://localhost:3333 to see our app in action! Change the route to http://localhost:3333/about and you'll see that our props were passed as expected. 

