# Static Assets
## Simple storage service is the original serverless primitive

Architect projects support text and binary assets such as images, styles, and scripts. These assets are available directly from the root of an app on the same domain as HTTP functions.

---

- <a href=#local><b>🚜 Work locally</b></a> without reloading
- <a href=#provision><b>🌾 Provision</b></a> a bucket on S3 with all the right permissions to proxy 
- <a href=#deploy><b>🛳 Deploy</b></a> anytime with (and without) CloudFormation
- <a href=#fingerprint><b>🔎 Fingerprint</b></a> files and cache them forever while still maintaining instant deployment
- <a href=#ignore><b>🙈 Ignore</b></a> files in public

---

<h2 id=local>🚜 Work Locally</h2>

Running `arc sandbox` mounts `public/` at `http://localhost:3333`.

Some frontend JavaScript workflows involve a build step, in which case the `public/` folder can be considered a staging area for build artifacts.

> 💡 **Protip:** Architect works with any module bundler like [Browserify](http://browserify.org/), [Parcel](https://parceljs.org/) or [Webpack](https://webpack.js.org/) 

---

<h2 id=provision>🌾 Provision</h2>

Given the following `.arc` file:

```arc
@app
my-site

@static
```

Running `arc deploy` will setup create the following resources:

- `AWS::S3::Bucket`

---

<h2 id=deploy>🛳 Deploy</h2>

- `arc deploy` copies `public/` to staging S3 bucket after running a full CloudFormation stack update
- `arc deploy production` copies `public/` to a production S3 bucket after running a full CloudFormation stack update
- `arc deploy static` immediately copies `public/` directly to S3
- `arc deploy static production` immediately copies `public/` directly to S3

> ⛳️ Protip: `arc deploy static --delete` will remove files from the bucket that are no longer locally present

---

<h2 id=fingerprint>🔎 Fingerprint</h2>

To enable file fingerprinting add `fingerprint true` to the `@static` pragma:

```
@static
fingerprint true
```

---

<h2 id=ignore>🙈 Ignore</h2>

You can instruct Architect to ignore files from your `public/` directory with the `ignore` directive, like so:
```
@static
ignore
  zip
  tar
```

This works with a simple string search, so if you ignore `foo`, all filenames containing `foo` (or files with paths containing `foo`) will be ignored.

> By default, Architect ignores `.DS_Store`, `node_modules`, and `readme.md` files

---
