# `@static`

> `@static` an S3 bucket for hosting static assets uploaded from `public/` folder

- No parameters are required
- `fingerprint` enables static asset file fingerprinting (and long-lived caching headers)
- `ignore` ignores files from `public/` folder
- `serialize` will serialize smaller files into API Gateway upon deployment

### Example

This `.arc` file defines a static bucket:

```arc
@app
testapp

@static
fingerprint true
ignore
  .tar.gz
  tmp
  user
```

### Deployment

Locally, if the folder `public/` exists, whenever you run `arc deploy` the contents are published to the `staging` stack. If you set `arc deploy production` the contents of `public/` are deployed to the production stack.

To _only_ deploy static assets from `/public` (and not function sources from `/src`), you can provide any of `--static`, `static` or `-s` flags, i.e. `arc deploy static`.

To _delete_ remote static assets on the S3 bucket that do not exist locally, provide the optional `--prune` or `--delete` flag, i.e. `arc deploy static --prune`.

---

<h2 id=serialize>🥣 Serialize</h2>

_This is an experimental feature._ Serialize static assets directly into API Gateway as mocks. 

Benefits
- Minimize network traffic
- Save on Lambda invocations

Downsides
- Requires a CloudFormation stack update to deploy which is slower than syncing a file to S3
- Can quickly bloat the generated CloudFormation template to max

Currently supported file types
- html
- css
- js
- mjs
- svg

Opt in:
```arc
@app
testapp

@static
serialize true

@http
get /
```

Running `arc deploy` will serialize `public/` into `sam.json`.

---
## Next: [Create dynamo tables with `@tables`](/reference/arc/tables)
