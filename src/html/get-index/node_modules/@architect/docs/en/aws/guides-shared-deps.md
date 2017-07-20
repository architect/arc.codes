# Shared Deps

> Cloud functions tend to share logic across an `@app`. The best way to do this is by creating a module you can share between them. 

Given the following `.arc` file:

```arc
@app
testapp

@html
get /
get /about
get /contact
post /contact
```

You would have the following file system layout:

```bash
/
|-src
| '-html
|   |-get-index/
|   |-get-about/
|   |-get-contact/
|   '-post-contact/
|-.arc
'-package.json
```

Sweet! However, each of these endpoints needs to share a layout.

## Scoped Code

Modules are good for sharing code. So lets create a module for the layout.

```bash
mkdir src/layout
touch src/layout/index.js
touch src/layout/package.json
```

Add the following to `src/layout/index.js`:

```javascript
// index.js
module.exports = function layout(body) {
  return `
  <html>
  <body>
  <h1>layout</h1>
  ${body}
  </body>
  </html>
  `
}
```

We want to keep this module private but still use `npm`. [You can learn about setting up an npm organization for scoped modules here.](https://www.npmjs.com/docs/orgs/)

```javascript
{
  "name":"@mycompany/layout"
}
```

We are not ready to publish this module yet. First, lets have a look at this layout.

## Link for Local Dev

We need to make this module available to our local code for development. Normally we would do this with `npm link` but this will get very tedious with many functions in `./src`. Tedium is error prone, but no worries, we can use `@archtiect/modules` to save time. Make sure you have [installed `@smallwins/modules` and added `link` to `scripts` in your `package.json`](/reference/npm-run-scripts).

To link everything defined by `.arc` in `./src` to `./src/layout` run:

```bash
npm run link src/layout
```

Now you can start local dev:

```bash
npm start
```

Cool. Now all changes are automatically available. 

## Install, Update and Deploy

Once happy with `@mycompany/layout` you can publish it to the registry and install it across your `.arc` defined functions:

```bash
cd src/layout
npm publish
cd ../../
npm run install @mycompany/layout
```

Great! And someday it will require an update:

```bash
cd src/layout
npm version patch
npm publish
cd ../../
npm run update @mycompany/layout
```

All the while we can throw up deploys to staging to check stuff out:

```bash
npm run deploy
```

If it looks good: ship it!

```bash
ARC_DEPLOY=production npm run deploy
```

## Next Steps

- Read about [persisting data](/guides/data)
