---
title: Sharing code 
category: developer experience
sections:
  - Overview
  - Principles & best practices
  - src/shared
  - src/views
---

Architect makes it easy to share code across many Lambda functions. Apps most commonly need to share business logic and view templates so Architect provides `@shared` and `@views` capability. Architect copies the contents of `src/shared` into all Lambdas and `src/views` into Lambda functions wired to respond to `@http` GET requests. This ensures your code is vendored into the function whenever the sandbox is started or the code is deployed. 

Example `app.arc`

```arc
@app
myapp

@shared
src src/shared # this is the default

@views
src src/views # this is the default

@http
get /
post /like
```

No matter where `@shared` source is configured it gets copied to every Lambda. The destination is slightly different depending on runtime:

<table>
  <tr><th>Runtime</th><th>`@shared` destination</h1></tr>
  <tr><td>Node</td><td>`src/http/get-index/node_modules/@architect/shared`</td></tr>
  <tr><td>Ruby</td><td>`src/http/get-index/vendor/shared`</td></tr>
  <tr><td>Python</td><td>`src/http/get-index/vendor/shared`</td></tr>
</table>

Likewise, `@views` runtime destinations:

<table>
  <tr><th>Runtime</th><th>`@views` destination</h1></tr>
  <tr><td>Node</td><td>`src/http/get-index/node_modules/@architect/views`</td></tr>
  <tr><td>Ruby</td><td>`src/http/get-index/vendor/views`</td></tr>
  <tr><td>Python</td><td>`src/http/get-index/vendor/views`</td></tr>
</table>

> Tip: the entire contents of `src/shared` are copied so we strongly suggest keeping the directory structure as flat as possible, and the payloads as small as possible to ensure the best performance.

## Dependencies

`@shared` and `@views` support having their own dependencies defined by `package.json`, `requirements.txt` or `Gemfile`.
