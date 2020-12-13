---
title: '@views'
description: Pragma for sharing view code
sections:
---

Configure the location of view code. Architect considers copies view code into HTTP GET handler Lambda functions.

You can also specify to only copy view code to specific lambda functions by listing them directly. 
## Syntax

- Routes should be existing `@http` routes.
- Route names follow the same requirements as `@http` routes. [see `@http`](@http)

## Example

This `app.arc` file defines specific `@http` functions to copy `src/views/` to:

<arc-tab-bar>

<arc-tab label=arc>

<h5>arc</h5>

```arc
@app
testapp

@http
get /
get /kittens
get /dogs
get /raccoons

@views
get /kittens
get /raccoons
```

</arc-tab>

<arc-tab label=json>

  <h5>json</h5>

  <div slot=content>

```json
{
  "architect": {
    "app": "testapp",
    "http": [
      [
        "get",
        "/"
      ],
      [
        "get",
        "/kittens"
      ],
      [
        "get",
        "/dogs"
      ],
      [
        "get",
        "/raccoons"
      ]
    ],
    "views": [
      [
        "get",
        "/kittens"
      ],
      [
        "get",
        "/raccoons"
      ]
    ]
  },
  "start": "npx sandbox",
  "dependencies": {
    "@architect/architect": "latest"
  }
}
```

  </div>

</arc-tab>

<arc-tab label=toml>

  <h5>toml</h5>

  <div slot=content>

```toml
app="testapp"

http=[
 [
  "get",
  "/"
 ]
  [
    "get",
    "/kittens"
  ],
  [
    "get",
    "/dogs"
  ],
  [
    "get",
    "/raccoons"
  ]
]

views=[
  [
    "get",
    "/kittens"
  ],
  [
    "get",
    "/raccoons"
  ]
]

```

  </div>

</arc-tab>

<arc-tab label=yaml>

  <h5>yaml</h5>

  <div slot=content>

```yml
---
app: testapp

http:
- get: "/"
- get: "kittens"
- get: "dogs"
- get: "raccoons"

views:
- get: "kittens"
- get: "raccoons"
```

  </div>

<arc-tab>
</arc-tab-bar>
