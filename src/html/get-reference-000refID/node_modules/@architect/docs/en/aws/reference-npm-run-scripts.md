# Workflows

> The `npm run` scripts execute common development workflows against an `.arc` file.

- <a href=#arc-create>`@architect/create`</a> creates code and corosponding cloud infrastructure
- <a href=#arc-deploy>`@architect/deploy`</a> deploys cloud functions
- <a href=#arc-sandbox>`@architect/sandbox`</a> runs cloud function code locally, offline and completely in memory
- <a href=#arc-modules>`@architect/modules`</a> manage common npm tasks across all cloud functions

### Setup

```bash
npm i @architect/create @architect/deploy @architect/sandbox @architect/modules --save-dev
```

Add the following to `scripts` in `package.json`:

```javascript
{
  "create": "AWS_PROFILE=xxx AWS_REGION=us-west-1 arc-create",
  "deploy": "AWS_PROFILE=xxx AWS_REGION=us-west-1 arc-deploy",
  "start": "arc-sandbox",
  "install": "arc-modules-install",
  "link": "arc-modules-link",
  "uninstall": "arc-modules-uninstall",
  "update": "arc-modules-update",
}
```

> Don't forget to setup `AWS_PROFILE` and `AWS_REGION` env variables

---

## <a href=#arc-create id=arc-create>`@architect/create`</a>

Create code and infra from `.arc` in the current directory:

```bash
npm run create
```

---

## <a href=#arc-deploy id=arc-deploy>`@architect/deploy`</a>

Deploy all code in `./src` to `staging`:

```bash
npm run deploy
```

Deploy all code in `./src` to `production`:

```bash
ARC_DEPLOY=production npm run deploy
```

Deploy a single (example) function to `staging`:

```bash
npm run deploy src/html/get-index
```

Deploy a single (example!) function to `production`:

```bash
ARC_DEPLOY=production npm run deploy src/html/get-index
```

---

## <a href=#arc-sandbox id=arc-sandbox>`@architect/sandbox`</a>

Start a local webserver and in memory DyanmoDB instance:

```bash
npm start
```

> Works super well with [Nodemon](https://nodemon.io)

---

## <a href=#arc-modules id=arc-modules>`@architect/modules`</a>

Install a module to all `.arc` defined functions in `./src`:

```bash
npm run install lodash
```

Link a local module to all `.arc` defined functions in `./src`:

```bash
npm run link src/md
```

Uninstall a module from all `.arc` defined functions in `./src`:

```bash
npm run uninstall lodash
```

Update a module in all `.arc` defined functions in `./src`:

```bash
npm run update lodash
```

---

## Next Steps

Learn about authoring `.arc` defined cloud functions with the [`@architect/functions`](/reference/functions) namespace.
