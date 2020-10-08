# `@http`

## `@http` section defines generic HTTP routes

### Syntax

Each HTTP route is a tuple of an HTTP method and a path.

#### Methods
- Each route begins with one of the following:
  - `get`
  - `post`
  - `put`
  - `patch`
  - `delete`
  - `options`
  - `head`
  - `any` (which receives all method types)

#### Path syntax

Paths support the following syntax:

- Paths must begin with a leading slash
- Static paths (and each subsequent part) must begin with a letter
  - Static paths may contain `[a-z0-9-_.]`
  - Example: `get /foo/bar123`
- Dynamic paths can contain **URL parameters** or **catchalls**
  - URL parameters are denoted with colons: `:`, followed by `[A-Za-z0-9]`
    - Params do not capture requests for resources nested in lower path parts
    - Example: `get /:foo`
    - See also: [Express route parameters](https://expressjs.com/en/guide/routing.html#route-parameters)
  - Catchalls are defined with a `*`, followed by no additional characters
    - Catchalls are greedy and capture requests for resources in all nested path parts
    - Example: `get /foo/*`


### Example

This `app.arc` file defines some typical routes:

```arc
@app
testapp

@http
get /
get /pages
get /pages/:dateID
get /contact
post /contact
```

The `app.arc` above generates the following functions within your project:

```bash
/
├── http
│   ├── get-index/
│   ├── get-pages/
│   ├── get-pages-000dateID/
│   ├── get-contact/
│   └── post-contact/
├── app.arc
└── package.json
```

> Note: The route `/pages/:dateID`'s corresponding handler deliberately looks a bit strange, thanks to its leading `000`. This is to aid in quickly differentiating URL parameters from other path parts.


---

## Next: [`Creating table indexes with @indexes`](/reference/arc/indexes)
